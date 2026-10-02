import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  RotateCcw,
  Truck,
  Star,
  MapPin,
  CheckCircle2,
  Share2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { productAPI, reviewAPI } from '../services/api';
import { formatINR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RatingStars from '../components/common/RatingStars';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { success, error, info } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Delivery check state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [prodRes, reviewsRes] = await Promise.all([
          productAPI.getProductById(id),
          reviewAPI.getProductReviews(id)
        ]);

        if (prodRes.data.success && prodRes.data.product) {
          const p = prodRes.data.product;
          setProduct(p);
          setSelectedImage(p.images?.[0] || '');
          setRelatedProducts(prodRes.data.relatedProducts || []);
        }

        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews || []);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading product details..." size="lg" />;
  }

  if (!product) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">The product you are looking for is unavailable or has been removed.</p>
        <Link to="/products" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs">
          Browse Store
        </Link>
      </div>
    );
  }

  const discount = product.discount || (
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  const handleAddToCart = async () => {
    if (product.stock < 1) return;
    await addToCart(product._id, quantity);
  };

  const handleBuyNow = async () => {
    if (product.stock < 1) return;
    const added = await addToCart(product._id, quantity);
    if (added || isAuthenticated) {
      navigate('/checkout');
    }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    // Simulation
    setPincodeStatus({
      valid: true,
      message: `Delivery available to ${pincode} by tomorrow, 8:00 PM. Cash on Delivery supported.`
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      info('Please sign in to write a review.');
      return;
    }

    if (!reviewComment.trim()) {
      error('Please write a review comment.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewAPI.createReview(product._id, {
        rating: newRating,
        title: reviewTitle,
        comment: reviewComment
      });

      if (res.data.success) {
        success('Review submitted successfully!');
        setReviewTitle('');
        setReviewComment('');
        // Refresh reviews and product rating
        const reviewsRes = await reviewAPI.getProductReviews(product._id);
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews || []);
        }
        const updatedProd = await productAPI.getProductById(product._id);
        if (updatedProd.data.success) {
          setProduct(updatedProd.data.product);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review.';
      error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        {product.category && (
          <>
            <Link
              to={`/products?category=${product.category.slug || product.category.name}`}
              className="hover:text-blue-600 capitalize"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </>
        )}
        <span className="text-gray-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[460px] scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 p-1 bg-gray-50 transition-all ${
                    selectedImage === img ? 'border-blue-600 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Main Selected Image */}
          <div className="relative flex-1 bg-gray-50 rounded-2xl p-6 flex items-center justify-center border border-gray-100 overflow-hidden min-h-[380px] sm:min-h-[460px]">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="max-h-[380px] w-auto max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />

            {/* Wishlist Button Overlay */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
                wishlisted
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/90 text-gray-400 hover:text-rose-500'
              }`}
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Brand & Title */}
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {product.brand}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-3">
            <RatingStars rating={product.rating || 0} numReviews={product.numReviews || 0} size="sm" />
            <span className="text-gray-300">|</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Verified Buyer Ratings
            </span>
          </div>

          {/* Price Box */}
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm font-medium text-gray-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-emerald-600">
                  {discount}% off
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* Bank Offers / Promotions Box */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-gray-800">Available Offers:</p>
            <div className="space-y-1.5 text-gray-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-1 rounded text-[10px] uppercase">Bank Offer</span>
                <span>5% Unlimited Cashback on ShopKart Axis Bank Credit Card.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600 bg-blue-50 px-1 rounded text-[10px] uppercase">Special Price</span>
                <span>Get extra ₹500 off on UPI transactions above ₹10,000.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-600 bg-amber-50 px-1 rounded text-[10px] uppercase">No Cost EMI</span>
                <span>Avail No Cost EMI on select credit cards.</span>
              </div>
            </div>
          </div>

          {/* Stock & Quantity */}
          <div className="flex items-center gap-6 pt-2">
            <div>
              <span className="block text-xs font-medium text-gray-500 mb-1.5">Availability</span>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({product.stock} units left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Currently Out of Stock
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1.5">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="py-3 px-6 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-gray-950 font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Delivery Options
            </span>
            <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Enter 6-digit Delivery Pincode"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-lg hover:bg-gray-800 transition whitespace-nowrap"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className={`text-xs font-medium ${pincodeStatus.valid ? 'text-emerald-600' : 'text-rose-500'}`}>
                {pincodeStatus.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Specifications & Description Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Product Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.specifications && product.specifications.length > 0 && (
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              {product.specifications.map((spec, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs text-gray-700 hover:bg-gray-50/70">
                  <span className="font-bold text-gray-500 sm:col-span-1">{spec.key}</span>
                  <span className="font-medium text-gray-900 sm:col-span-2 mt-0.5 sm:mt-0">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Customer Ratings & Reviews</h2>
            <p className="text-xs text-gray-500">Real feedback from verified purchasers</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black text-gray-900">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </div>
            <div>
              <RatingStars rating={product.rating || 0} showBadge={false} size="sm" />
              <p className="text-[11px] text-gray-500 mt-0.5">
                Based on {reviews.length} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Write a Review Box */}
        <div className="bg-blue-50/40 rounded-xl p-5 border border-blue-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Write a Customer Review</h3>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">{newRating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent sound quality and battery life!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Review</label>
                <textarea
                  rows={3}
                  placeholder="What did you like or dislike? How does it perform in daily use?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-600 mb-3">Please sign in with your account to submit a review.</p>
              <Link
                to="/login"
                className="inline-block px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700"
              >
                Sign In to Review
              </Link>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="divide-y divide-gray-100">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev._id} className="py-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <RatingStars rating={rev.rating} size="xs" />
                  <span className="text-xs font-bold text-gray-900">{rev.title || 'Verified Purchase'}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="font-semibold text-gray-600">{rev.user?.name || 'ShopKart Customer'}</span>
                  <span>•</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Certified Buyer
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 py-6 text-center italic">
              No reviews yet. Be the first to share your thoughts on this product!
            </p>
          )}
        </div>
      </div>

      {/* Similar Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Similar Products You May Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
