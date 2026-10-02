const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided.'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required.'
      });
    }

    // Verify stock and compute pricing directly from current database product records
    const orderItems = [];
    let itemsPrice = 0;
    let totalMRP = 0;

    for (const item of items) {
      const productId = item.product?._id || item.product || item._id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ID ${productId}`
        });
      }

      const qty = Number(item.quantity) || 1;
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}.`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        quantity: qty
      });

      itemsPrice += product.price * qty;
      totalMRP += (product.originalPrice || product.price) * qty;

      // Decrement product stock
      product.stock -= qty;
      await product.save();
    }

    const discount = Math.max(0, totalMRP - itemsPrice);
    const deliveryFee = itemsPrice >= 499 ? 0 : 40;
    const totalAmount = itemsPrice + deliveryFee;

    const validPaymentMethod = ['Cash on Delivery', 'Mock Online Payment', 'Card', 'UPI'].includes(paymentMethod)
      ? paymentMethod
      : 'Cash on Delivery';

    const isPaidOnline = validPaymentMethod !== 'Cash on Delivery';

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: validPaymentMethod,
      paymentStatus: isPaidOnline ? 'Completed' : 'Pending',
      paymentDetails: isPaidOnline ? {
        transactionId: `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        paidAt: new Date()
      } : {},
      orderStatus: 'Order Placed',
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date(),
          note: isPaidOnline ? 'Order placed and payment received successfully.' : 'Order placed with Cash on Delivery.'
        }
      ],
      itemsPrice,
      discount,
      deliveryFee,
      totalAmount
    });

    // Clear user's active cart after successful order creation
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images brand')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images brand category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Check authorization: must be order owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order.'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Check authorization: must be order owner or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order.'
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders cannot be cancelled directly. Please initiate a return.'
      });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled.'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason || 'Cancelled by customer';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: reason ? `Cancellation reason: ${reason}` : 'Cancelled by customer'
    });

    if (order.paymentStatus === 'Completed') {
      order.paymentStatus = 'Refunded';
      order.statusHistory.push({
        status: 'Refund Initiated',
        timestamp: new Date(),
        note: 'Refund will be credited to original payment source within 3-5 business days.'
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully and stock restored.',
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};
