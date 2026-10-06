import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    sku: { type: String, required: true, uppercase: true, index: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    change: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['ORDER_PLACED', 'ORDER_CANCELLED', 'RESTOCK', 'MANUAL_ADJUSTMENT'],
      default: 'MANUAL_ADJUSTMENT',
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);
