const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserStatus,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/status', protect, adminOnly, toggleUserStatus);

module.exports = router;
