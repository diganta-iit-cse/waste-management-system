const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
      index: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
      index: true,
    },
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      default: '2D',
    },
    language: {
      type: String,
      default: 'Hindi',
    },
    pricing: {
      VIP: { type: Number, default: 350 },
      Premium: { type: Number, default: 250 },
      Executive: { type: Number, default: 200 },
      Normal: { type: Number, default: 150 },
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    lockedSeats: [
      {
        seat: { type: String, required: true },
        lockedBy: { type: String, required: true },
        lockedUntil: { type: Date, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'running', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

showSchema.index({ theatre: 1, date: 1, screen: 1 });
showSchema.index({ movie: 1, city: 1, date: 1 });

module.exports = mongoose.model('Show', showSchema);
