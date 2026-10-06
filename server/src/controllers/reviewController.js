import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { AppError } from '../middleware/errorHandler.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Compute distribution counts
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating] += 1;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        total: reviews.length,
        distribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images = [] } = req.body;

    if (!rating || !title || !comment) {
      return next(new AppError('Please provide rating, title, and comment', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Verify if user previously purchased this product
    const priorOrder = await Order.findOne({
      userId: req.user._id,
      'items.productId': productId,
    });

    const newReview = await Review.create({
      productId,
      userId: req.user._id,
      rating: parseInt(rating, 10),
      title: title.trim(),
      comment: comment.trim(),
      images,
      verifiedPurchase: Boolean(priorOrder),
    });

    // Update Product average rating & count
    const allReviews = await Review.find({ productId });
    const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgScore = parseFloat((totalScore / allReviews.length).toFixed(1));

    product.rating.average = avgScore;
    product.rating.count = allReviews.length;
    await product.save();

    await newReview.populate('userId', 'name');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};
