import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import RatingStars from '../components/common/RatingStars';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Loading your wishlist..." size="lg" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to view your wishlist</h2>
        <p className="text-xs text-gray-500">
          Save your favorite items here to track their prices and purchase later.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500">
          Tap the heart icon on any product to save items you love for later.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
        >
          <span>Discover Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleMoveToCart = async (product) => {
    const added = await addToCart(product._id, 1);
    if (added) {
      await removeFromWishlist(product._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
        </h1>
        <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline">
          Continue Exploring
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlist.map((product) => {
          if (!product) return null;

          const discount = product.discount || (
            product.originalPrice && product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0
          );

          return (
            <div
              key={product._id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative pt-[85%] bg-gray-50 overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-4 hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  title="Remove from wishlist"
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-gray-400 hover:text-rose-600 hover:bg-white shadow-xs transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {product.brand}
                  </span>
                  <Link
                    to={`/product/${product._id}`}
                    className="block text-xs font-bold text-gray-900 hover:text-blue-600 line-clamp-2 mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-1.5">
                    <RatingStars rating={product.rating || 0} numReviews={product.numReviews} size="xs" />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-sm font-bold text-gray-900">{formatINR(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatINR(product.originalPrice)}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-xs font-bold text-emerald-600">{discount}% off</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{product.stock > 0 ? 'Move to Cart' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
