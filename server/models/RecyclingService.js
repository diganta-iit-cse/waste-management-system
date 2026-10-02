const mongoose = require('mongoose');

const recyclingServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
      default: 'Kabadiwala / Doorstep Scrap Dealer',
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: 'contact@wastewise.org',
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      default: 'New Delhi',
    },
    pincode: {
      type: String,
      default: '110001',
    },
    location: {
      latitude: { type: Number, default: 28.6139 },
      longitude: { type: Number, default: 77.2090 },
    },
    googleMapsUrl: {
      type: String,
      default: '',
    },
    spcbRegNumber: {
      type: String,
      default: 'CPCB/EPR/2026/DL-4491',
    },
    establishedYear: {
      type: Number,
      default: 2018,
    },
    acceptedMaterials: {
      type: [String],
      default: ['Plastic', 'Paper', 'Metal'],
    },
    ratesPerKg: [
      {
        material: { type: String, required: true },
        price: { type: Number, required: true },
        unit: { type: String, default: 'kg' },
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 32,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    workingHours: {
      type: String,
      default: '09:00 AM - 07:00 PM (Mon-Sat)',
    },
    description: {
      type: String,
      default: 'Authorized eco-friendly recycling partner with doorstep scrap collection and instant digital weighing scales.',
    },
    freePickupAvailable: {
      type: Boolean,
      default: true,
    },
    minWeightKg: {
      type: Number,
      default: 5,
    },
    audioOverview: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RecyclingService', recyclingServiceSchema);
