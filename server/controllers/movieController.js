const Movie = require('../models/Movie');
const Review = require('../models/Review');

// @desc    Get all movies with filtering, searching, and sorting
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      language,
      format,
      status,
      minRating,
      sort,
      limit = 50,
      page = 1,
    } = req.query;

    const query = {};

    // Status filter (now_showing, coming_soon, archived)
    if (status) {
      query.status = status;
    }

    // Language filter
    if (language) {
      query.languages = { $in: [new RegExp(language, 'i')] };
    }

    // Genre filter
    if (genre) {
      query.genres = { $in: [new RegExp(genre, 'i')] };
    }

    // Format filter
    if (format) {
      query.formats = { $in: [format] };
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Text search filter (title, director, cast)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { director: searchRegex },
        { 'cast.name': searchRegex },
        { genres: { $in: [searchRegex] } },
        { languages: { $in: [searchRegex] } },
      ];
    }

    // Sorting
    let sortQuery = { rating: -1, ratingCount: -1 };
    if (sort === 'popularity') {
      sortQuery = { ratingCount: -1, rating: -1 };
    } else if (sort === 'rating') {
      sortQuery = { rating: -1 };
    } else if (sort === 'releaseDate_desc') {
      sortQuery = { releaseDate: -1 };
    } else if (sort === 'releaseDate_asc') {
      sortQuery = { releaseDate: 1 };
    } else if (sort === 'title_asc') {
      sortQuery = { title: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [movies, total] = await Promise.all([
      Movie.find(query).sort(sortQuery).skip(skip).limit(Number(limit)),
      Movie.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: movies.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured banner movies
// @route   GET /api/movies/featured
// @access  Public
const getFeaturedMovies = async (req, res, next) => {
  try {
    const featured = await Movie.find({
      status: { $in: ['now_showing', 'coming_soon'] },
    })
      .sort({ featured: -1, rating: -1 })
      .limit(6);

    res.json({
      success: true,
      data: featured,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const reviews = await Review.find({ movie: movie._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...movie.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    res.json({
      success: true,
      message: 'Movie removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getFeaturedMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
