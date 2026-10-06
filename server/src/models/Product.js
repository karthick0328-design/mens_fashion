import mongoose from 'mongoose';
import { PRODUCT_SIZES } from '../constants/index.js';

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true },
    images: [{ type: String }],
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, uppercase: true, trim: true },
    color: {
      name: { type: String, required: true },
      hex: { type: String, required: true },
      images: [{ type: String }],
    },
    size: {
      type: String,
      required: true,
      enum: PRODUCT_SIZES,
    },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    brand: { type: String, required: true, trim: true, index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    colors: [colorSchema],
    sizes: [{ type: String, enum: PRODUCT_SIZES }],
    variants: [variantSchema],
    specifications: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    tags: [{ type: String, index: true }],
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound and text indexes for rapid search, filtering, and sorting
productSchema.index({ category: 1, isActive: 1, 'rating.average': -1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ 'variants.price': 1 });
productSchema.index({ 'variants.sku': 1 });
productSchema.index(
  {
    title: 'text',
    brand: 'text',
    description: 'text',
    tags: 'text',
  },
  {
    weights: {
      title: 10,
      brand: 8,
      tags: 5,
      description: 2,
    },
    name: 'ProductTextSearchIndex',
  }
);

export const Product = mongoose.model('Product', productSchema);
