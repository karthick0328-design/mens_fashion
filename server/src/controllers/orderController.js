import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';
import { User } from '../models/User.js';
import { Coupon } from '../models/Coupon.js';
import { InventoryLog } from '../models/InventoryLog.js';
import { AppError } from '../middleware/errorHandler.js';
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, DISCOUNT_TYPES } from '../constants/index.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddressId, shippingAddress, paymentMethod = PAYMENT_METHODS.COD, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new AppError('Your order must contain at least one item', 400));
    }

    // Resolve shipping address
    let resolvedAddress = shippingAddress;
    if (!resolvedAddress && shippingAddressId) {
      const user = await User.findById(req.user._id);
      const addr = user?.addresses.id(shippingAddressId);
      if (addr) resolvedAddress = addr.toObject();
    }

    if (!resolvedAddress || !resolvedAddress.addressLine1 || !resolvedAddress.city || !resolvedAddress.postalCode) {
      return next(new AppError('Please provide a valid shipping address', 400));
    }

    // ZERO-TRUST: Fetch fresh products and calculate prices strictly from DB
    const validatedOrderItems = [];
    let subtotal = 0;
    const stockUpdates = [];

    for (const reqItem of items) {
      const { sku, quantity } = reqItem;
      if (!sku || !quantity || quantity < 1) {
        return next(new AppError('Invalid SKU or quantity in order payload', 400));
      }

      // Find product containing this variant SKU
      const product = await Product.findOne({ 'variants.sku': sku, isActive: true });
      if (!product) {
        return next(new AppError(`Product variant ${sku} is no longer available`, 400));
      }

      const variant = product.variants.find((v) => v.sku === sku);
      if (!variant) {
        return next(new AppError(`Variant ${sku} not found`, 404));
      }

      if (variant.stock < quantity) {
        return next(
          new AppError(
            `Insufficient stock for "${product.title}" (${variant.color.name}, ${variant.size}). Only ${variant.stock} left.`,
            400
          )
        );
      }

      const itemTotal = variant.price * quantity;
      subtotal += itemTotal;

      validatedOrderItems.push({
        productId: product._id,
        sku: variant.sku,
        title: product.title,
        image: variant.color?.images?.[0] || product.images?.[0] || '',
        color: {
          name: variant.color.name,
          hex: variant.color.hex,
        },
        size: variant.size,
        unitPrice: variant.price,
        mrp: variant.mrp,
        quantity,
        totalPrice: itemTotal,
      });

      stockUpdates.push({
        productId: product._id,
        sku: variant.sku,
        quantity,
        previousStock: variant.stock,
      });
    }

    // Server-side Coupon validation & recalculation
    let couponApplied = undefined;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
      });

      if (coupon && new Date() <= new Date(coupon.endDate) && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === DISCOUNT_TYPES.PERCENTAGE) {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
        discountAmount = Math.round(discountAmount);
        couponApplied = {
          code: coupon.code,
          discountAmount,
        };
        // Increment coupon use count
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    // Shipping calculation: Free shipping above ₹999, else ₹99
    const shippingFee = subtotal >= 999 ? 0 : 99;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    // Atomically decrement stock
    for (const update of stockUpdates) {
      const updateResult = await Product.updateOne(
        {
          _id: update.productId,
          variants: {
            $elemMatch: {
              sku: update.sku,
              stock: { $gte: update.quantity },
            },
          },
        },
        {
          $inc: { 'variants.$.stock': -update.quantity },
        }
      );

      if (updateResult.modifiedCount === 0) {
        return next(
          new AppError(
            `Could not complete order: stock changed concurrently for SKU ${update.sku}`,
            409
          )
        );
      }

      // Record inventory audit log
      await InventoryLog.create({
        productId: update.productId,
        sku: update.sku,
        previousStock: update.previousStock,
        newStock: update.previousStock - update.quantity,
        change: -update.quantity,
        reason: 'ORDER_PLACED',
      });
    }

    // Generate unique order number: ORD-YYYY-RANDOM
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await Order.create({
      orderNumber,
      userId: req.user._id,
      items: validatedOrderItems,
      shippingAddress: resolvedAddress,
      pricing: {
        subtotal,
        discount: discountAmount,
        shippingFee,
        tax: 0,
        totalAmount,
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === PAYMENT_METHODS.COD ? PAYMENT_STATUSES.PENDING : PAYMENT_STATUSES.PAID,
        paidAt: paymentMethod !== PAYMENT_METHODS.COD ? new Date() : undefined,
      },
      orderStatus: ORDER_STATUSES.CONFIRMED,
      timeline: [
        {
          status: ORDER_STATUSES.CONFIRMED,
          timestamp: new Date(),
          note: 'Order confirmed and sent for fulfillment',
        },
      ],
      couponApplied,
    });

    // Clear user's cart
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = { _id: id };
    if (req.user.role !== 'ADMIN') {
      query.userId = req.user._id;
    }

    const order = await Order.findOne(query).lean();
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = { _id: id };
    if (req.user.role !== 'ADMIN') {
      query.userId = req.user._id;
    }

    const order = await Order.findOne(query);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (
      order.orderStatus === ORDER_STATUSES.DELIVERED ||
      order.orderStatus === ORDER_STATUSES.CANCELLED
    ) {
      return next(new AppError(`Cannot cancel order in ${order.orderStatus} status`, 400));
    }

    // Atomically restore stock
    for (const item of order.items) {
      await Product.updateOne(
        { 'variants.sku': item.sku },
        { $inc: { 'variants.$.stock': item.quantity } }
      );

      await InventoryLog.create({
        productId: item.productId,
        sku: item.sku,
        previousStock: 0,
        newStock: item.quantity,
        change: item.quantity,
        reason: 'ORDER_CANCELLED',
        orderId: order._id,
      });
    }

    order.orderStatus = ORDER_STATUSES.CANCELLED;
    order.timeline.push({
      status: ORDER_STATUSES.CANCELLED,
      timestamp: new Date(),
      note: 'Order cancelled by customer. Stock restored to catalog.',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
