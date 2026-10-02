const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please assign a category']
  },
  price: {
    type: Number,
    required: [true, 'Please provide current selling price'],
    min: [0, 'Price must be positive']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please provide original price (MRP)'],
    min: [0, 'Original price must be positive']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please specify available stock count'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  specifications: [specificationSchema],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDealOfTheDay: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Auto-calculate discount percentage if not provided
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.price && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Full-text search index on name, brand, description, and tags
productSchema.index({
  name: 'text',
  brand: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Product', productSchema);
