import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    images: [{ type: String }],
    verifiedPurchase: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REPORTED', 'HIDDEN'],
      default: 'APPROVED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ productId: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
