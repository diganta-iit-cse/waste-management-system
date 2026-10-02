const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to compute cart totals
const calculateTotals = (items) => {
  let totalMRP = 0;
  let sellingTotal = 0;
  let totalQuantity = 0;

  items.forEach(item => {
    if (item.product) {
      const origPrice = item.product.originalPrice || item.product.price;
      const curPrice = item.product.price;
      const qty = item.quantity || 1;

      totalMRP += origPrice * qty;
      sellingTotal += curPrice * qty;
      totalQuantity += qty;
    }
  });

  const discount = Math.max(0, totalMRP - sellingTotal);
  // Free delivery for orders above Rs 499
  const deliveryFee = sellingTotal >= 499 || sellingTotal === 0 ? 0 : 40;
  const finalTotal = sellingTotal + deliveryFee;

  return {
    totalMRP,
    sellingTotal,
    discount,
    deliveryFee,
    finalTotal,
    totalQuantity
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price originalPrice discount images brand stock rating numReviews')
      .populate('savedForLater.product', 'name price originalPrice discount images brand stock rating numReviews');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], savedForLater: [] });
    }

    // Filter out any deleted products
    cart.items = cart.items.filter(item => item.product !== null);
    cart.savedForLater = cart.savedForLater.filter(item => item.product !== null);

    const summary = calculateTotals(cart.items);

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        savedForLater: cart.savedForLater,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Sorry, this product is currently out of stock.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], savedForLater: [] });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} units available in stock.`
        });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.price;
    } else {
      const addQty = Math.min(Number(quantity), product.stock);
      cart.items.push({
        product: productId,
        quantity: addQty,
        price: product.price
      });
    }

    // If item was in saved for later, remove from there
    cart.savedForLater = cart.savedForLater.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    // Populate for response
    await cart.populate('items.product', 'name price originalPrice discount images brand stock rating numReviews');
    await cart.populate('savedForLater.product', 'name price originalPrice discount images brand stock rating numReviews');

    const summary = calculateTotals(cart.items);

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully.',
      cart: {
        _id: cart._id,
        items: cart.items,
        savedForLater: cart.savedForLater,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Valid quantity (>= 1) is required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock} available).`
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in your cart.' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    cart.items[itemIndex].price = product.price;

    await cart.save();

    await cart.populate('items.product', 'name price originalPrice discount images brand stock rating numReviews');
    await cart.populate('savedForLater.product', 'name price originalPrice discount images brand stock rating numReviews');

    const summary = calculateTotals(cart.items);

    res.json({
      success: true,
      message: 'Cart updated successfully.',
      cart: {
        _id: cart._id,
        items: cart.items,
        savedForLater: cart.savedForLater,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    await cart.populate('items.product', 'name price originalPrice discount images brand stock rating numReviews');
    await cart.populate('savedForLater.product', 'name price originalPrice discount images brand stock rating numReviews');

    const summary = calculateTotals(cart.items);

    res.json({
      success: true,
      message: 'Item removed from cart.',
      cart: {
        _id: cart._id,
        items: cart.items,
        savedForLater: cart.savedForLater,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully.',
      cart: {
        items: [],
        savedForLater: cart ? cart.savedForLater : [],
        summary: calculateTotals([])
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save cart item for later
// @route   POST /api/cart/save-for-later/:productId
// @access  Private
const saveForLater = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in active cart.' });
    }

    // Add to savedForLater if not already present
    const alreadySaved = cart.savedForLater.some(i => i.product.toString() === productId);
    if (!alreadySaved) {
      cart.savedForLater.push({
        product: item.product,
        price: item.price
      });
    }

    // Remove from active items
    cart.items = cart.items.filter(i => i.product.toString() !== productId);

    await cart.save();

    await cart.populate('items.product', 'name price originalPrice discount images brand stock rating numReviews');
    await cart.populate('savedForLater.product', 'name price originalPrice discount images brand stock rating numReviews');

    res.json({
      success: true,
      message: 'Item moved to Save for Later.',
      cart: {
        _id: cart._id,
        items: cart.items,
        savedForLater: cart.savedForLater,
        summary: calculateTotals(cart.items)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move saved-for-later item back to active cart
// @route   POST /api/cart/move-to-cart/:productId
// @access  Private
const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const savedItem = cart.savedForLater.find(i => i.product.toString() === productId);
    if (!savedItem) {
      return res.status(404).json({ success: false, message: 'Item not found in saved list.' });
    }

    const product = await Product.findById(productId);
    if (!product || product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock.' });
    }

    // Add back to active items
    const existingIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: 1,
        price: product.price
      });
    }

    // Remove from savedForLater
    cart.savedForLater = cart.savedForLater.filter(i => i.product.toString() !== productId);

    await cart.save();

    await cart.populate('items.product', 'name price originalPrice discount images brand stock rating numReviews');
    await cart.populate('savedForLater.product', 'name price originalPrice discount images brand stock rating numReviews');

    res.json({
      success: true,
      message: 'Item moved back to cart.',
      cart: {
        _id: cart._id,
        items: cart.items,
        savedForLater: cart.savedForLater,
        summary: calculateTotals(cart.items)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  saveForLater,
  moveToCart
};
