import mongoose from 'mongoose';

const shippingMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    estimatedDelivery: { type: String, required: true },
    zones: [{ type: String, trim: true }],
    freeAboveAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const ShippingMethod = mongoose.model('ShippingMethod', shippingMethodSchema);
