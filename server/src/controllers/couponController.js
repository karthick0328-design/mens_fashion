import { Coupon } from '../models/Coupon.js';
import { AppError } from '../middleware/errorHandler.js';
import { DISCOUNT_TYPES } from '../constants/index.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartAmount } = req.body;

    if (!code) {
      return next(new AppError('Please provide a coupon code', 400));
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return next(new AppError('Invalid or inactive coupon code', 404));
    }

    if (new Date() > new Date(coupon.endDate)) {
      return next(new AppError('This coupon has expired', 400));
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return next(new AppError('Coupon usage limit has been reached', 400));
    }

    const amount = parseFloat(cartAmount || 0);
    if (amount < coupon.minOrderAmount) {
      return next(
        new AppError(
          `Minimum order value of ₹${coupon.minOrderAmount} required for this coupon`,
          400
        )
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === DISCOUNT_TYPES.PERCENTAGE) {
      discountAmount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, amount);
    }

    discountAmount = Math.round(discountAmount);

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};
