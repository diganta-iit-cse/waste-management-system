const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  saveForLater,
  moveToCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/:productId')
  .put(updateCartItemQuantity)
  .delete(removeFromCart);

router.post('/save-for-later/:productId', saveForLater);
router.post('/move-to-cart/:productId', moveToCart);

module.exports = router;
