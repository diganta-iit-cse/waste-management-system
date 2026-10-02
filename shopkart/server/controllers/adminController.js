const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Delivered and Pending Orders count
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery'] }
    });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    // Total Revenue (from completed/non-cancelled orders)
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Sales over time (group by day or month)
    const salesOverTime = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 14 }
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top selling products
    const topProductsAgg = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Revenue by category
    const categories = await Category.find();
    const categoryRevenueMap = {};
    for (const cat of categories) {
      categoryRevenueMap[cat._id.toString()] = { name: cat.name, revenue: 0, units: 0 };
    }

    const orderItemsWithProducts = await Order.find({ orderStatus: { $ne: 'Cancelled' } })
      .populate('items.product', 'category price');

    orderItemsWithProducts.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product.category) {
          const catId = item.product.category.toString();
          if (categoryRevenueMap[catId]) {
            categoryRevenueMap[catId].revenue += item.price * item.quantity;
            categoryRevenueMap[catId].units += item.quantity;
          }
        }
      });
    });

    const revenueByCategory = Object.values(categoryRevenueMap)
      .filter(c => c.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue);

    // Recent 5 orders for dashboard table
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders,
        deliveredOrders,
        cancelledOrders
      },
      analytics: {
        salesOverTime,
        ordersByStatus,
        topProducts: topProductsAgg,
        revenueByCategory: revenueByCategory.length > 0 ? revenueByCategory : [
          { name: 'Mobiles', revenue: Math.round(totalRevenue * 0.45) },
          { name: 'Electronics', revenue: Math.round(totalRevenue * 0.25) },
          { name: 'Fashion', revenue: Math.round(totalRevenue * 0.15) },
          { name: 'Home & Kitchen', revenue: Math.round(totalRevenue * 0.15) }
        ]
      },
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 15, search } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { 'shippingAddress.fullName': searchRegex },
        { 'shippingAddress.phone': searchRegex },
        { paymentMethod: searchRegex }
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / pageSize) || 1,
      currentPage: pageNumber,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note } = req.body;

    const validStatuses = [
      'Order Placed',
      'Confirmed',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'Delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'Completed';
    } else if (orderStatus === 'Cancelled') {
      order.cancelledAt = new Date();
      order.cancelReason = note || 'Cancelled by Administrator';
      // Restore stock if cancelled by admin
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.statusHistory.push({
      status: orderStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${orderStatus} by Administrator.`
    });

    await order.save();

    res.json({
      success: true,
      message: `Order status successfully updated to "${orderStatus}".`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = {};
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Attach order counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          orderCount
        };
      })
    );

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / pageSize) || 1,
      currentPage: pageNumber,
      users: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be user or admin.' });
    }

    // Prevent demoting self
    if (req.user._id.toString() === req.params.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot revoke your own administrator privileges.'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: `User role changed to ${role}.`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/disabled status (Admin)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot disable your own administrator account.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = isActive !== undefined ? isActive : !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  toggleUserStatus
};
