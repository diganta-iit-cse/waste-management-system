const Screen = require('../models/Screen');
const Theatre = require('../models/Theatre');

// @desc    Get screens by theatre ID
// @route   GET /api/screens/theatre/:theatreId
// @access  Public
const getScreensByTheatre = async (req, res, next) => {
  try {
    const screens = await Screen.find({ theatre: req.params.theatreId });
    res.json({
      success: true,
      count: screens.length,
      data: screens,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get screen by ID
// @route   GET /api/screens/:id
// @access  Public
const getScreenById = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id).populate('theatre');
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    res.json({
      success: true,
      data: screen,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new screen
// @route   POST /api/screens
// @access  Private/Admin
const createScreen = async (req, res, next) => {
  try {
    const { theatre, name, screenType, totalRows = 8, seatsPerRow = 12, rowLayout } = req.body;

    const theatreExists = await Theatre.findById(theatre);
    if (!theatreExists) {
      return res.status(404).json({ success: false, message: 'Theatre does not exist' });
    }

    let defaultLayout = rowLayout;
    if (!defaultLayout || defaultLayout.length === 0) {
      const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      defaultLayout = [];

      for (let i = 0; i < totalRows; i++) {
        const rowLetter = rowLetters[i] || `R${i + 1}`;
        let category = 'Normal';
        let price = 160;

        if (i < 2) {
          category = 'VIP';
          price = 350;
        } else if (i < 5) {
          category = 'Premium';
          price = 260;
        } else if (i < 7) {
          category = 'Executive';
          price = 200;
        }

        defaultLayout.push({
          row: rowLetter,
          category,
          price,
          totalSeats: seatsPerRow,
        });
      }
    }

    const totalCapacity = defaultLayout.reduce((acc, r) => acc + (r.totalSeats || seatsPerRow), 0);

    const screen = await Screen.create({
      theatre,
      name,
      screenType: screenType || 'Standard 2D',
      totalRows: defaultLayout.length,
      seatsPerRow,
      rowLayout: defaultLayout,
      totalCapacity,
    });

    // Update screen count on theatre
    const screenCount = await Screen.countDocuments({ theatre });
    await Theatre.findByIdAndUpdate(theatre, { screensCount: screenCount });

    res.status(201).json({
      success: true,
      message: 'Screen created successfully',
      data: screen,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update screen
// @route   PUT /api/screens/:id
// @access  Private/Admin
const updateScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    res.json({
      success: true,
      message: 'Screen updated successfully',
      data: screen,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete screen
// @route   DELETE /api/screens/:id
// @access  Private/Admin
const deleteScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findByIdAndDelete(req.params.id);
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    res.json({
      success: true,
      message: 'Screen deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScreensByTheatre,
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen,
};
