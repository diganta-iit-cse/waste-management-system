const Show = require('../models/Show');

// @desc    Temporarily lock seats for 5 minutes
// @route   POST /api/seats/lock
// @access  Public
const lockSeats = async (req, res, next) => {
  try {
    const { showId, seats, lockSessionId } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Show ID and seat list are required' });
    }

    if (!lockSessionId) {
      return res.status(400).json({ success: false, message: 'Lock session identifier is required' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const now = new Date();

    // 1. Evict any expired locks
    show.lockedSeats = show.lockedSeats.filter((l) => new Date(l.lockedUntil) > now);

    // 2. Check if any seat is already booked
    const alreadyBooked = seats.filter((s) => show.bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats [${alreadyBooked.join(', ')}] are already booked. Please pick different seats.`,
      });
    }

    // 3. Check if any seat is currently locked by someone else
    const lockedByOthers = show.lockedSeats.filter(
      (l) => seats.includes(l.seat) && l.lockedBy !== lockSessionId
    );

    if (lockedByOthers.length > 0) {
      const lockedSeatNames = lockedByOthers.map((l) => l.seat);
      return res.status(409).json({
        success: false,
        message: `Seats [${lockedSeatNames.join(', ')}] are temporarily reserved by another customer. Please choose different seats or try again in a few minutes.`,
      });
    }

    // 4. Lock seats for 5 minutes (300,000 ms)
    const lockUntil = new Date(Date.now() + 5 * 60 * 1000);

    // Remove existing locks by this session for clean refresh
    show.lockedSeats = show.lockedSeats.filter(
      (l) => !(seats.includes(l.seat) && l.lockedBy === lockSessionId)
    );

    seats.forEach((seat) => {
      show.lockedSeats.push({
        seat,
        lockedBy: lockSessionId,
        lockedUntil: lockUntil,
      });
    });

    await show.save();

    res.json({
      success: true,
      message: 'Seats locked successfully for 5 minutes',
      data: {
        lockedSeats: seats,
        lockedUntil: lockUntil,
        lockDurationSeconds: 300,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Explicitly release locked seats
// @route   POST /api/seats/release
// @access  Public
const releaseSeats = async (req, res, next) => {
  try {
    const { showId, seats, lockSessionId } = req.body;

    if (!showId) {
      return res.status(400).json({ success: false, message: 'Show ID is required' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    if (seats && Array.isArray(seats)) {
      show.lockedSeats = show.lockedSeats.filter(
        (l) => !(seats.includes(l.seat) && (!lockSessionId || l.lockedBy === lockSessionId))
      );
    } else if (lockSessionId) {
      show.lockedSeats = show.lockedSeats.filter((l) => l.lockedBy !== lockSessionId);
    }

    await show.save();

    res.json({
      success: true,
      message: 'Seats released successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current seat lock status for a show
// @route   GET /api/shows/:showId/seats
// @access  Public
const getShowSeatStatus = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const now = new Date();
    // Filter out expired locks
    const activeLocks = show.lockedSeats.filter((l) => new Date(l.lockedUntil) > now);

    res.json({
      success: true,
      data: {
        bookedSeats: show.bookedSeats,
        lockedSeats: activeLocks.map((l) => ({
          seat: l.seat,
          remainingSeconds: Math.max(0, Math.round((new Date(l.lockedUntil).getTime() - now.getTime()) / 1000)),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  lockSeats,
  releaseSeats,
  getShowSeatStatus,
};
