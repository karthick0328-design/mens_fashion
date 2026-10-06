import { Category } from '../models/Category.js';
import { AppError } from '../middleware/errorHandler.js';

export const getCategories = async (req, res, next) => {
  try {
    const allCategories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();

    // Build hierarchy: root categories with nested children
    const roots = allCategories.filter((c) => !c.parentCategory);
    const categoryTree = roots.map((root) => {
      const children = allCategories.filter(
        (c) => c.parentCategory && c.parentCategory.toString() === root._id.toString()
      );
      return {
        ...root,
        children,
      };
    });

    res.status(200).json({
      success: true,
      data: categoryTree,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true }).populate('parentCategory');

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    const subCategories = await Category.find({
      parentCategory: category._id,
      isActive: true,
    }).sort({ sortOrder: 1 });

    res.status(200).json({
      success: true,
      data: {
        category,
        subCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};
