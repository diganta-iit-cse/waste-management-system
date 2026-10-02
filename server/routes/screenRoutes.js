const express = require('express');
const router = express.Router();
const {
  getScreensByTheatre,
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen,
} = require('../controllers/screenController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/theatre/:theatreId', getScreensByTheatre);
router.get('/:id', getScreenById);
router.post('/', protect, adminOnly, createScreen);
router.put('/:id', protect, adminOnly, updateScreen);
router.delete('/:id', protect, adminOnly, deleteScreen);

module.exports = router;
