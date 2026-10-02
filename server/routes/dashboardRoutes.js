const express = require('express');
const router = express.Router();
const {
  getUserDashboard,
  getAdminDashboard,
  getScrapRates,
  getDatabaseStatus,
} = require('../controllers/dashboardController');
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

router.get('/user', optionalProtect, getUserDashboard);
router.get('/admin', protect, adminOnly, getAdminDashboard);
router.get('/scrap-rates', getScrapRates);
router.get('/db-status', getDatabaseStatus);

module.exports = router;
