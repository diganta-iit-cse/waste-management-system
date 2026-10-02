const mongoose = require('mongoose');

const classificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Recyclable', 'Organic', 'E-Waste', 'Hazardous', 'Paper', 'Metal', 'Glass', 'Other'],
      default: 'Recyclable',
    },
    confidence: {
      type: Number,
      required: true,
      default: 90,
    },
    material: {
      type: String,
      default: 'Mixed Material',
    },
    disposalInstructions: {
      type: String,
      required: true,
    },
    preparation: {
      type: String,
      default: 'Clean and segregate before disposal.',
    },
    environmentalImpact: {
      type: String,
      default: 'Prevents landfill pollution and conserves natural raw resources.',
    },
    ecoPoints: {
      type: Number,
      default: 15,
    },
    co2SavedKg: {
      type: Number,
      default: 0.15,
    },
    binColor: {
      type: String,
      default: 'Blue',
    },
    notes: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    },
    audioExplanation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Classification', classificationSchema);
