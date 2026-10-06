import mongoose from 'mongoose';
import { PRODUCT_SIZES } from '../constants/index.js';

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: { type: String, required: true, uppercase: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    color: {
      name: { type: String, required: true },
      hex: { type: String, required: true },
    },
    size: {
      type: String,
      required: true,
      enum: PRODUCT_SIZES,
    },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model('Cart', cartSchema);
