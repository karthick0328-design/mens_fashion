import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      match: { isActive: true },
      select: 'title slug brand images rating variants category colors',
    });

    res.status(200).json({
      success: true,
      data: user.wishlist || [],
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    let added = false;
    if (existingIndex > -1) {
      user.wishlist.splice(existingIndex, 1);
      added = false;
    } else {
      user.wishlist.push(productId);
      added = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      data: {
        productId,
        inWishlist: added,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    next(error);
  }
};
