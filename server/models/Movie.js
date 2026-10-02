const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    posterUrl: {
      type: String,
      required: [true, 'Movie poster URL is required'],
    },
    backdropUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    genres: {
      type: [String],
      required: true,
      index: true,
    },
    languages: {
      type: [String],
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
    },
    releaseDate: {
      type: Date,
      required: true,
      index: true,
    },
    certification: {
      type: String,
      enum: ['U', 'U/A', 'A'],
      default: 'U/A',
    },
    director: {
      type: String,
      default: 'Director',
    },
    cast: [
      {
        name: { type: String, required: true },
        role: { type: String, default: 'Actor' },
        avatar: { type: String, default: '' },
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: ['now_showing', 'coming_soon', 'archived'],
      default: 'now_showing',
      index: true,
    },
    formats: {
      type: [String],
      default: ['2D', '3D', 'IMAX 3D'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.index({ title: 'text', description: 'text', director: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
