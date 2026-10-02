const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    facilities: {
      type: [String],
      default: ['Dolby Atmos', 'Food & Beverages', 'Parking', 'M-Ticket', 'Recliner Seats'],
    },
    screensCount: {
      type: Number,
      default: 3,
    },
    rating: {
      type: Number,
      default: 4.6,
      min: 0,
      max: 5,
    },
    distanceKm: {
      type: Number,
      default: 3.5,
    },
  },
  {
    timestamps: true,
  }
);

theatreSchema.index({ city: 1, name: 1 });

module.exports = mongoose.model('Theatre', theatreSchema);
