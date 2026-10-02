const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  createProductReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Can be mounted at /api/products/:id/reviews or /api/reviews
router.route('/')
  .get(getProductReviews)
  .post(protect, createProductReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
