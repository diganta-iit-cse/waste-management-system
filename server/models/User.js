const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    address: {
      type: String,
      default: 'Sector 14, Urban Estate, New Delhi',
    },
    city: {
      type: String,
      default: 'New Delhi',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    accessibilityMode: {
      type: Boolean,
      default: false,
    },
    voiceSettings: {
      language: {
        type: String,
        default: 'en-IN',
        enum: ['en-IN', 'hi-IN', 'bn-IN', 'pa-IN'],
      },
      speechToTextEnabled: {
        type: Boolean,
        default: true,
      },
      textToSpeechEnabled: {
        type: Boolean,
        default: true,
      },
      autoVoiceFeedback: {
        type: Boolean,
        default: true,
      },
      speechRate: {
        type: Number,
        default: 1.0,
      },
      volume: {
        type: Number,
        default: 1.0,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
