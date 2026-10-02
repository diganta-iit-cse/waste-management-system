const Review = require('../models/Review');
const Movie = require('../models/Movie');

// @desc    Get all reviews for a movie
// @route   GET /api/movies/:movieId/reviews
// @access  Public
const getMovieReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review for a movie
// @route   POST /api/movies/:movieId/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const movieId = req.params.movieId;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      movie: movieId,
      user: req.user._id,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
    } else {
      await Review.create({
        movie: movieId,
        user: req.user._id,
        rating: Number(rating),
        comment,
      });
    }

    // Recalculate movie average rating
    const allReviews = await Review.find({ movie: movieId });
    const avgRating = (
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    ).toFixed(1);

    movie.rating = parseFloat(avgRating);
    movie.ratingCount = allReviews.length;
    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        movieRating: movie.rating,
        movieRatingCount: movie.ratingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovieReviews,
  createReview,
};
