const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');

// @desc    Get all theatres (optionally filter by city)
// @route   GET /api/theatres
// @access  Public
const getTheatres = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    const query = {};

    if (city) {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    if (search) {
      query.name = new RegExp(search, 'i');
    }

    const theatres = await Theatre.find(query).sort({ rating: -1, name: 1 });

    res.json({
      success: true,
      count: theatres.length,
      data: theatres,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre by ID with its screens
// @route   GET /api/theatres/:id
// @access  Public
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const screens = await Screen.find({ theatre: theatre._id });

    res.json({
      success: true,
      data: {
        ...theatre.toObject(),
        screens,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new theatre
// @route   POST /api/theatres
// @access  Private/Admin
const createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Theatre created successfully',
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    res.json({
      success: true,
      message: 'Theatre updated successfully',
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    // Also delete associated screens
    await Screen.deleteMany({ theatre: req.params.id });

    res.json({
      success: true,
      message: 'Theatre and associated screens deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
};
