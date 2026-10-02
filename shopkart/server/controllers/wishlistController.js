const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name brand price originalPrice discount images rating numReviews stock category',
      populate: { path: 'category', select: 'name slug' }
    });

    res.json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const user = await User.findById(req.user._id);

    const isAlreadyWishlisted = user.wishlist.some(
      id => id.toString() === productId
    );

    if (isAlreadyWishlisted) {
      return res.status(200).json({
        success: true,
        message: 'Product already in your wishlist.',
        wishlist: user.wishlist
      });
    }

    user.wishlist.push(productId);
    await user.save();

    await user.populate({
      path: 'wishlist',
      select: 'name brand price originalPrice discount images rating numReviews stock category'
    });

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist.',
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId
    );

    await user.save();

    await user.populate({
      path: 'wishlist',
      select: 'name brand price originalPrice discount images rating numReviews stock category'
    });

    res.json({
      success: true,
      message: 'Product removed from wishlist.',
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
