const crypto = require('crypto');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { generateQRCode } = require('../utils/qrGenerator');

// Generate unique booking reference: e.g. CB-2026-X8K9L2
const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CB-2026-${code}`;
};

// @desc    Create a new booking and confirm reservation
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      showId,
      seats, // Array of { seatId, row, number, category, price }
      foodItems = [], // Array of { foodItem, name, price, quantity }
      couponCode = '',
      paymentMethod = 'mock_card',
      razorpayOrderId = '',
      razorpayPaymentId = '',
      razorpaySignature = '',
      isMock = true,
    } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Show and seats are required to book' });
    }

    const show = await Show.findById(showId)
      .populate('movie')
      .populate('theatre')
      .populate('screen');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const seatIds = seats.map((s) => s.seatId);

    // 1. Verify that no seat is already booked (prevent double booking)
    const alreadyBooked = seatIds.filter((s) => show.bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats [${alreadyBooked.join(', ')}] were already confirmed by another customer. Please choose different seats.`,
      });
    }

    // 2. Calculate Ticket Subtotal
    const ticketSubtotal = seats.reduce((sum, s) => sum + (Number(s.price) || 200), 0);

    // 3. Convenience Fee (e.g. ₹30 per ticket) & Taxes (18% GST on convenience fee)
    const convenienceFee = seats.length * 30;
    const taxes = Math.round(convenienceFee * 0.18);

    // 4. Calculate Food Subtotal
    let foodSubtotal = 0;
    const processedFood = [];
    if (Array.isArray(foodItems)) {
      foodItems.forEach((f) => {
        const qty = Number(f.quantity) || 1;
        const price = Number(f.price) || 0;
        if (qty > 0 && price > 0) {
          foodSubtotal += price * qty;
          processedFood.push({
            foodItem: f.foodItem || f._id,
            name: f.name,
            price,
            quantity: qty,
          });
        }
      });
    }

    // 5. Coupon discount calculation
    let discount = 0;
    let appliedCoupon = '';
    if (couponCode && couponCode.trim() !== '') {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
      });

      if (coupon && (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date())) {
        const orderSubtotal = ticketSubtotal + foodSubtotal;
        if (orderSubtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((orderSubtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = Math.min(coupon.discountValue, orderSubtotal);
          }
          appliedCoupon = coupon.code;
        }
      }
    }

    // 6. Total Amount
    const totalAmount = Math.max(0, ticketSubtotal + convenienceFee + taxes + foodSubtotal - discount);

    // 7. Generate Booking ID & QR Code
    const bookingId = generateBookingId();
    const qrPayload = {
      bookingId,
      movie: show.movie.title,
      theatre: show.theatre.name,
      screen: show.screen.name,
      date: show.date,
      time: show.startTime,
      seats: seatIds.join(', '),
      totalAmount,
      customer: req.user.name,
    };
    const qrCode = await generateQRCode(qrPayload);

    // 8. Create Payment Record
    const payment = await Payment.create({
      user: req.user._id,
      amount: totalAmount,
      currency: 'INR',
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'success',
      isMock,
    });

    // 9. Create Booking Record
    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      screen: show.screen._id,
      seats: seats.map((s) => ({
        seatId: s.seatId,
        row: s.row || s.seatId.charAt(0),
        number: s.number || parseInt(s.seatId.slice(1), 10) || 1,
        category: s.category || 'Standard',
        price: s.price,
      })),
      ticketSubtotal,
      convenienceFee,
      taxes,
      foodItems: processedFood,
      foodSubtotal,
      discount,
      couponApplied: appliedCoupon,
      totalAmount,
      payment: payment._id,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      qrCode,
    });

    // Link booking to payment
    payment.booking = booking._id;
    await payment.save();

    // 10. Update Show: Atomically push booked seats and release any locks on them
    show.bookedSeats.push(...seatIds);
    show.lockedSeats = show.lockedSeats.filter((l) => !seatIds.includes(l.seat));
    await show.save();

    // Populate for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl backdropUrl duration certification genres languages')
      .populate('theatre', 'name city address facilities')
      .populate('screen', 'name screenType')
      .populate('show', 'date startTime endTime format language')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of the logged in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration certification genres languages')
      .populate('theatre', 'name city address')
      .populate('screen', 'name screenType')
      .populate('show', 'date startTime endTime format language')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title posterUrl backdropUrl duration certification genres languages')
      .populate('theatre', 'name city address facilities')
      .populate('screen', 'name screenType')
      .populate('show', 'date startTime endTime format language')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure only the owner or an admin can view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This booking is already cancelled' });
    }

    const { reason = 'Customer requested cancellation' } = req.body;

    // Refund policy: 75% refund
    const refundAmount = Math.round(booking.totalAmount * 0.75);

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = reason;
    booking.refundAmount = refundAmount;
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Release seats on the show
    const show = await Show.findById(booking.show);
    if (show) {
      const seatIdsToFree = booking.seats.map((s) => s.seatId);
      show.bookedSeats = show.bookedSeats.filter((s) => !seatIdsToFree.includes(s));
      await show.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund has been initiated.',
      data: {
        bookingId: booking.bookingId,
        refundAmount,
        bookingStatus: booking.bookingStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) query.bookingStatus = status;
    if (search) {
      query.$or = [
        { bookingId: new RegExp(search, 'i') },
        { couponApplied: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'name email phone')
        .populate('movie', 'title posterUrl')
        .populate('theatre', 'name city')
        .populate('screen', 'name')
        .populate('show', 'date startTime')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/bookings/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalMovies,
      totalTheatres,
      totalShows,
      totalBookings,
      confirmedBookings,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Movie.countDocuments(),
      Theatre.countDocuments(),
      Show.countDocuments({ status: { $ne: 'cancelled' } }),
      Booking.countDocuments(),
      Booking.find({ bookingStatus: 'confirmed' }),
    ]);

    // Calculate total revenue
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Revenue by last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayBookings = confirmedBookings.filter(
        (b) => b.createdAt.toISOString().split('T')[0] === dateStr
      );
      const dayRevenue = dayBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      last7Days.push({
        date: dateStr,
        day: dayName,
        revenue: dayRevenue,
        bookings: dayBookings.length,
      });
    }

    // Top movies by bookings
    const movieBookingCounts = {};
    for (const b of confirmedBookings) {
      const mId = b.movie.toString();
      movieBookingCounts[mId] = (movieBookingCounts[mId] || 0) + 1;
    }

    const topMovieIds = Object.keys(movieBookingCounts)
      .sort((a, b) => movieBookingCounts[b] - movieBookingCounts[a])
      .slice(0, 5);

    const topMovies = await Movie.find({ _id: { $in: topMovieIds } }).select('title rating posterUrl');

    const topMoviesData = topMovies.map((m) => ({
      title: m.title,
      bookings: movieBookingCounts[m._id.toString()] || 0,
      rating: m.rating,
      posterUrl: m.posterUrl,
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalMovies,
        totalTheatres,
        totalShows,
        totalBookings,
        totalRevenue,
        last7Days,
        topMovies: topMoviesData,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getAdminStats,
};
