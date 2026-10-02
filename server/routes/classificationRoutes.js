const express = require('express');
const router = express.Router();
const {
  classifyImage,
  saveClassification,
  getUserClassifications,
  addSpokenNotes,
  getClassificationStats,
  deleteClassification,
} = require('../controllers/classificationController');

// Optional auth token parser for classifications
const optionalProtect = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'wastewise_jwt_secret_dev_key');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Guest fallback
    }
  }
  next();
};

router.post('/ai-classify', classifyImage);
router.post('/', optionalProtect, saveClassification);
router.get('/my', optionalProtect, getUserClassifications);
router.get('/stats', optionalProtect, getClassificationStats);
router.patch('/:id/notes', addSpokenNotes);
router.delete('/:id', optionalProtect, deleteClassification);

module.exports = router;
