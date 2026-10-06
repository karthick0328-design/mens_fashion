import mongoose from 'mongoose';

const giftCardTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['ISSUED', 'REDEEMED', 'REFUNDED', 'EXPIRED'],
      required: true,
    },
    amount: { type: Number, required: true },
    orderNumber: { type: String, default: '' },
    note: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const giftCardSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ['SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'],
      default: 'GOLD',
      required: true,
    },
    initialAmount: {
      type: Number,
      required: true,
      min: 500,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
    },
    senderName: { type: String, required: true, trim: true },
    recipientName: { type: String, required: true, trim: true },
    recipientEmail: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, default: '' },
    designImage: { type: String, default: '' },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'REDEEMED', 'EXPIRED', 'DISABLED'],
      default: 'ACTIVE',
      index: true,
    },
    transactions: [giftCardTransactionSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

giftCardSchema.index({ recipientEmail: 1 });

export const GiftCard = mongoose.model('GiftCard', giftCardSchema);
