const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      discount,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Keyword Search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Category filter (support category ObjectId, slug or name)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({
          $or: [{ slug: category.toLowerCase() }, { name: new RegExp(`^${category}$`, 'i') }]
        });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // Brand filter (supports comma-separated list e.g. "Apple,Samsung")
    if (brand && brand !== 'all') {
      const brandList = brand.split(',').map(b => new RegExp(`^${b.trim()}$`, 'i'));
      query.brand = { $in: brandList };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) query.price.$lte = Number(maxPrice);
    }

    // Rating filter (e.g. 4 for 4 stars and above)
    if (rating && !isNaN(Number(rating))) {
      query.rating = { $gte: Number(rating) };
    }

    // Discount filter (e.g. 30 for 30% and above)
    if (discount && !isNaN(Number(discount))) {
      query.discount = { $gte: Number(discount) };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    switch (sort) {
      case 'price_asc':
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
      case 'highest-rated':
        sortOption = { rating: -1, numReviews: -1 };
        break;
      case 'popular':
        sortOption = { numReviews: -1, rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'discount':
        sortOption = { discount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    // Extract available brands for facet filtering based on category or general search
    const brandQuery = query.category ? { category: query.category } : {};
    const availableBrands = await Product.distinct('brand', brandQuery);

    res.json({
      success: true,
      count: products.length,
      totalProducts,
      pages: Math.ceil(totalProducts / pageSize) || 1,
      currentPage: pageNumber,
      availableBrands: availableBrands.filter(Boolean).sort(),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products (deals of the day, trending, best sellers)
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const dealsOfTheDay = await Product.find({ isDealOfTheDay: true })
      .populate('category', 'name slug')
      .limit(8);

    const bestSellers = await Product.find({ isBestSeller: true })
      .populate('category', 'name slug')
      .limit(8);

    const trending = await Product.find({ isTrending: true })
      .populate('category', 'name slug')
      .limit(8);

    const recommended = await Product.find({ rating: { $gte: 4.2 } })
      .populate('category', 'name slug')
      .sort({ numReviews: -1 })
      .limit(8);

    res.json({
      success: true,
      dealsOfTheDay,
      bestSellers,
      trending,
      recommended
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found with the requested ID.'
      });
    }

    // Find related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id || product.category,
      _id: { $ne: product._id }
    }).limit(6);

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      originalPrice,
      discount,
      stock,
      images,
      specifications,
      isFeatured,
      isDealOfTheDay,
      isBestSeller,
      isTrending,
      tags
    } = req.body;

    if (!name || !description || !brand || !category || price === undefined || originalPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, brand, category, price, and originalPrice are required.'
      });
    }

    let parsedCategory = category;
    // Check if category passed is slug or name instead of ObjectId
    if (!category.match(/^[0-9a-fA-F]{24}$/)) {
      const catObj = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: new RegExp(`^${category}$`, 'i') }]
      });
      if (catObj) parsedCategory = catObj._id;
    }

    const product = await Product.create({
      name,
      description,
      brand,
      category: parsedCategory,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discount: discount !== undefined ? Number(discount) : Math.round(((originalPrice - price) / originalPrice) * 100),
      stock: Number(stock) || 0,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
      specifications: Array.isArray(specifications) ? specifications : [],
      isFeatured: !!isFeatured,
      isDealOfTheDay: !!isDealOfTheDay,
      isBestSeller: !!isBestSeller,
      isTrending: !!isTrending,
      tags: Array.isArray(tags) ? tags : []
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const updates = { ...req.body };

    if (updates.category && !updates.category.match(/^[0-9a-fA-F]{24}$/)) {
      const catObj = await Category.findOne({
        $or: [{ slug: updates.category.toLowerCase() }, { name: new RegExp(`^${updates.category}$`, 'i') }]
      });
      if (catObj) updates.category = catObj._id;
    }

    if (updates.price && updates.originalPrice) {
      updates.discount = Math.round(((Number(updates.originalPrice) - Number(updates.price)) / Number(updates.originalPrice)) * 100);
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
