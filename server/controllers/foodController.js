const FoodItem = require('../models/FoodItem');

// @desc    Get all available food items
// @route   GET /api/food
// @access  Public
const getFoodItems = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    const items = await FoodItem.find(query).sort({ category: 1, price: 1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food item
// @route   POST /api/food
// @access  Private/Admin
const createFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/food/:id
// @access  Private/Admin
const updateFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    res.json({
      success: true,
      message: 'Food item updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    res.json({
      success: true,
      message: 'Food item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
};
