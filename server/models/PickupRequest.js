const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      default: 'New Delhi',
    },
    pincode: {
      type: String,
      default: '110001',
    },
    wasteType: {
      type: String,
      required: true,
      default: 'Mixed Recyclables',
    },
    estimatedWeight: {
      type: Number,
      required: true,
      default: 5,
    },
    preferredDate: {
      type: String,
      default: () => new Date(Date.now() + 86400000).toISOString().split('T')[0],
    },
    timeSlot: {
      type: String,
      default: 'Morning (10:00 AM - 01:00 PM)',
    },
    status: {
      type: String,
      enum: ['Pending', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
    assignedService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecyclingService',
      required: false,
    },
    assignedServiceName: {
      type: String,
      default: 'GreenScrap Kabadiwala Network',
    },
    pickupPin: {
      type: String,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);
