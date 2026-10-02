const Show = require('../models/Show');
const Screen = require('../models/Screen');
const Theatre = require('../models/Theatre');
const Movie = require('../models/Movie');

// @desc    Get shows by movie, city, theatre, date
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const { movie, city, theatre, date } = req.query;
    const query = { status: { $ne: 'cancelled' } };

    if (movie) query.movie = movie;
    if (theatre) query.theatre = theatre;
    if (city) query.city = new RegExp(`^${city}$`, 'i');
    if (date) query.date = date;

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration certification languages formats')
      .populate('theatre', 'name city address facilities rating distanceKm')
      .populate('screen', 'name screenType totalCapacity')
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show by ID and seats layout with real-time lock status
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre')
      .populate('screen');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Clean up expired locked seats automatically
    const now = new Date();
    const originalLockedCount = show.lockedSeats.length;
    show.lockedSeats = show.lockedSeats.filter((lock) => new Date(lock.lockedUntil) > now);

    if (show.lockedSeats.length !== originalLockedCount) {
      await show.save();
    }

    // Generate full seat map based on screen row layout
    const screen = show.screen;
    const lockedMap = new Map();
    show.lockedSeats.forEach((l) => lockedMap.set(l.seat, l.lockedBy));

    const bookedSet = new Set(show.bookedSeats);

    const seatMap = screen.rowLayout.map((rowConfig) => {
      const seats = [];
      const totalSeats = rowConfig.totalSeats || screen.seatsPerRow;

      for (let num = 1; num <= totalSeats; num++) {
        const seatId = `${rowConfig.row}${num}`;
        let status = 'available';

        if (bookedSet.has(seatId)) {
          status = 'booked';
        } else if (lockedMap.has(seatId)) {
          status = 'locked';
        }

        // Determine price by category or show pricing override
        const price =
          show.pricing && show.pricing[rowConfig.category]
            ? show.pricing[rowConfig.category]
            : rowConfig.price;

        seats.push({
          seatId,
          row: rowConfig.row,
          number: num,
          category: rowConfig.category,
          price,
          status,
          lockedBy: lockedMap.get(seatId) || null,
        });
      }

      return {
        row: rowConfig.row,
        category: rowConfig.category,
        price: show.pricing[rowConfig.category] || rowConfig.price,
        seats,
      };
    });

    res.json({
      success: true,
      data: {
        ...show.toObject(),
        seatMap,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new show (with screen schedule collision prevention)
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res, next) => {
  try {
    const { movie, theatre, screen, city, date, startTime, endTime, format, language, pricing } = req.body;

    const [movieDoc, theatreDoc, screenDoc] = await Promise.all([
      Movie.findById(movie),
      Theatre.findById(theatre),
      Screen.findById(screen),
    ]);

    if (!movieDoc || !theatreDoc || !screenDoc) {
      return res.status(400).json({ success: false, message: 'Invalid movie, theatre, or screen reference' });
    }

    // Check for overlapping show on the same screen, date, and startTime
    const conflictShow = await Show.findOne({
      screen,
      date,
      startTime,
      status: { $ne: 'cancelled' },
    });

    if (conflictShow) {
      return res.status(409).json({
        success: false,
        message: `Conflict: Screen ${screenDoc.name} already has a show scheduled at ${startTime} on ${date}`,
      });
    }

    const show = await Show.create({
      movie,
      theatre,
      screen,
      city: city || theatreDoc.city,
      date,
      startTime,
      endTime: endTime || 'TBD',
      format: format || '2D',
      language: language || (movieDoc.languages && movieDoc.languages[0]) || 'Hindi',
      pricing: pricing || {
        VIP: 350,
        Premium: 250,
        Executive: 200,
        Normal: 150,
      },
      bookedSeats: [],
      lockedSeats: [],
    });

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.json({
      success: true,
      message: 'Show updated successfully',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
};
