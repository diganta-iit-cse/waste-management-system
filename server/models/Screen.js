const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema(
  {
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Screen name is required'],
      trim: true,
    },
    screenType: {
      type: String,
      enum: ['IMAX 3D', 'Dolby Atmos', '4DX', 'Standard 2D'],
      default: 'Standard 2D',
    },
    totalRows: {
      type: Number,
      default: 8,
    },
    seatsPerRow: {
      type: Number,
      default: 12,
    },
    rowLayout: [
      {
        row: { type: String, required: true },
        category: {
          type: String,
          enum: ['VIP', 'Premium', 'Executive', 'Normal'],
          default: 'Premium',
        },
        price: { type: Number, default: 220 },
        totalSeats: { type: Number, default: 12 },
      },
    ],
    totalCapacity: {
      type: Number,
      default: 96,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Screen', screenSchema);
