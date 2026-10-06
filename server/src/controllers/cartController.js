import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

// Helper to format cart and compute live subtotal
const formatCartResponse = (cart) => {
  let subtotal = 0;
  let totalMrp = 0;
  let itemCount = 0;

  const formattedItems = cart.items.map((item) => {
    const itemTotal = item.price * item.quantity;
    const itemMrpTotal = item.mrp * item.quantity;
    subtotal += itemTotal;
    totalMrp += itemMrpTotal;
    itemCount += item.quantity;

    return {
      _id: item._id,
      productId: item.productId,
      sku: item.sku,
      title: item.title,
      image: item.image,
      color: item.color,
      size: item.size,
      price: item.price,
      mrp: item.mrp,
      quantity: item.quantity,
      stock: item.stock,
    };
  });

  const discount = Math.max(0, totalMrp - subtotal);

  return {
    _id: cart._id,
    userId: cart.userId,
    items: formattedItems,
    subtotal,
    discount,
    total: subtotal,
    itemCount,
    updatedAt: cart.updatedAt,
  };
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Refresh prices and live stock from actual product variants
    let modified = false;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const variant = product.variants.find((v) => v.sku === item.sku);
        if (variant) {
          if (item.price !== variant.price || item.stock !== variant.stock) {
            item.price = variant.price;
            item.mrp = variant.mrp;
            item.stock = variant.stock;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, sku, quantity = 1 } = req.body;

    if (!productId || !sku) {
      return next(new AppError('Please provide productId and variant SKU', 400));
    }

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return next(new AppError('Product not found or inactive', 404));
    }

    const variant = product.variants.find((v) => v.sku === sku);
    if (!variant) {
      return next(new AppError('Product variant not found', 404));
    }

    if (variant.stock <= 0) {
      return next(new AppError('This variant is currently out of stock', 400));
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex((item) => item.sku === sku);

    const primaryImage =
      variant.color?.images?.[0] || product.images?.[0] || '';

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantity > variant.stock) {
        return next(
          new AppError(
            `Cannot add more. Only ${variant.stock} units available in stock.`,
            400
          )
        );
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = variant.price;
      cart.items[existingItemIndex].stock = variant.stock;
    } else {
      if (quantity > variant.stock) {
        return next(
          new AppError(`Only ${variant.stock} units available in stock.`, 400)
        );
      }
      cart.items.push({
        productId: product._id,
        sku: variant.sku,
        title: product.title,
        image: primaryImage,
        color: {
          name: variant.color.name,
          hex: variant.color.hex,
        },
        size: variant.size,
        price: variant.price,
        mrp: variant.mrp,
        quantity,
        stock: variant.stock,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const { sku } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return next(new AppError('Quantity must be at least 1', 400));
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    const item = cart.items.find((i) => i.sku === sku);
    if (!item) {
      return next(new AppError('Item not found in cart', 404));
    }

    // Check stock from live product variant
    const product = await Product.findById(item.productId);
    const variant = product?.variants.find((v) => v.sku === sku);

    if (!variant || variant.stock < quantity) {
      return next(
        new AppError(
          `Requested quantity exceeds available stock (${variant?.stock || 0})`,
          400
        )
      );
    }

    item.quantity = quantity;
    item.price = variant.price;
    item.stock = variant.stock;

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { sku } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = cart.items.filter((item) => item.sku !== sku);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: {
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        itemCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
