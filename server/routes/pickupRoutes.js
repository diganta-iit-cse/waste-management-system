const express = require('express');
const router = express.Router();
const {
  parseVoicePickup,
  createPickup,
  getMyPickups,
  getAllPickups,
  updatePickupStatus,
  cancelPickup,
} = require('../controllers/pickupController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const optionalProtect = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'wastewise_jwt_secret_dev_key');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {}
  }
  next();
};

router.post('/voice-parse', parseVoicePickup);
router.post('/', optionalProtect, createPickup);
router.get('/my', optionalProtect, getMyPickups);
router.get('/all', protect, adminOnly, getAllPickups);
router.patch('/:id/status', updatePickupStatus);
router.delete('/:id', cancelPickup);

module.exports = router;
