import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { AppError } from '../middleware/errorHandler.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      subCategory,
      brand,
      color,
      size,
      minPrice,
      maxPrice,
      rating,
      discount,
      availability,
      sort = 'relevance',
      page = 1,
      limit = 16,
    } = req.query;

    const query = { isActive: true };

    // Text search or keyword match
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Category / Subcategory handling
    if (category) {
      // Find category by slug or id
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });

      if (catDoc) {
        // Find if this category has children
        const childCats = await Category.find({ parentCategory: catDoc._id });
        if (childCats.length > 0) {
          const catIds = [catDoc._id, ...childCats.map((c) => c._id)];
          query.$or = query.$or
            ? [{ $and: [query.$or, { $or: [{ category: { $in: catIds } }, { subCategory: { $in: catIds } }] }] }]
            : [{ category: { $in: catIds } }, { subCategory: { $in: catIds } }];
        } else {
          query.category = catDoc._id;
        }
      }
    }

    if (subCategory) {
      const subDoc = await Category.findOne({
        $or: [{ slug: subCategory }, { _id: subCategory.match(/^[0-9a-fA-F]{24}$/) ? subCategory : null }],
      });
      if (subDoc) {
        query.subCategory = subDoc._id;
      }
    }

    // Brands filter
    if (brand) {
      const brandArray = Array.isArray(brand) ? brand : brand.split(',').map((b) => b.trim());
      query.brand = { $in: brandArray.map((b) => new RegExp(`^${b}$`, 'i')) };
    }

    // Colors filter
    if (color) {
      const colorArray = Array.isArray(color) ? color : color.split(',').map((c) => c.trim());
      query['colors.name'] = { $in: colorArray.map((c) => new RegExp(c, 'i')) };
    }

    // Sizes filter
    if (size) {
      const sizeArray = Array.isArray(size) ? size : size.split(',').map((s) => s.trim());
      query.sizes = { $in: sizeArray };
    }

    // Rating filter (e.g. 4 stars & above)
    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['variants.price'].$lte = parseFloat(maxPrice);
    }

    // Discount filter (e.g. 30% and above)
    if (discount) {
      query['variants.discountPercentage'] = { $gte: parseFloat(discount) };
    }

    // In Stock filter
    if (availability === 'true' || availability === true) {
      query['variants.stock'] = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    switch (sort) {
      case 'popularity':
        sortOptions = { 'rating.count': -1 };
        break;
      case 'price_asc':
        sortOptions = { 'variants.price': 1 };
        break;
      case 'price_desc':
        sortOptions = { 'variants.price': -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'discount':
        sortOptions = { 'variants.discountPercentage': -1 };
        break;
      case 'relevance':
      default:
        sortOptions = { isFeatured: -1, 'rating.average': -1, createdAt: -1 };
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('category', 'name slug')
        .populate('subCategory', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug parentCategory')
      .populate('subCategory', 'name slug')
      .lean();

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Fetch related products from same subCategory or category
    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      $or: [
        { subCategory: product.subCategory?._id },
        { category: product.category?._id },
        { brand: product.brand },
      ],
    })
      .limit(8)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        product,
        similarProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ 'rating.count': -1, 'rating.average': -1 })
      .populate('category', 'name slug')
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getFilterFacets = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filterQuery = { isActive: true };

    if (search) {
      filterQuery.$or = [
        { title: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
      ];
    }

    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        const childCats = await Category.find({ parentCategory: catDoc._id });
        if (childCats.length > 0) {
          filterQuery.$or = [
            { category: { $in: [catDoc._id, ...childCats.map((c) => c._id)] } },
            { subCategory: { $in: [catDoc._id, ...childCats.map((c) => c._id)] } },
          ];
        } else {
          filterQuery.category = catDoc._id;
        }
      }
    }

    const [brands, colors, sizes] = await Promise.all([
      Product.distinct('brand', filterQuery),
      Product.distinct('colors.name', filterQuery),
      Product.distinct('sizes', filterQuery),
    ]);

    res.status(200).json({
      success: true,
      data: {
        brands: brands.sort(),
        colors: colors.sort(),
        sizes,
      },
    });
  } catch (error) {
    next(error);
  }
};
