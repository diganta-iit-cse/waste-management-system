import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product._id);
  const discount = product.discount || (
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setIsAdding(true);
    const success = await addToCart(product._id, 1);
    setIsAdding(false);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Wishlist Floating Button */}
      <button
        onClick={handleWishlistToggle}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-xs transition-transform transform active:scale-90 ${
          wishlisted
            ? 'bg-rose-50 text-rose-600 shadow-sm'
            : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white shadow-xs'
        }`}
      >
        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-full shadow-xs">
          {discount}% OFF
        </span>
      )}

      {/* Product Image Link */}
      <Link to={`/product/${product._id}`} className="block relative pt-[95%] overflow-hidden bg-gray-50">
        <img
          src={primaryImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
          {product.brand}
        </span>

        {/* Title */}
        <Link
          to={`/product/${product._id}`}
          className="text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 mb-2 transition-colors leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating and Reviews */}
        <div className="mb-2.5">
          <RatingStars rating={product.rating || 0} numReviews={product.numReviews || 0} size="xs" />
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold text-gray-900">
            {formatINR(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs font-semibold text-emerald-600">
              Save {formatINR(product.originalPrice - product.price)}
            </span>
          )}
        </div>

        {/* Delivery / Stock status */}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          {product.stock > 0 ? (
            <span className="text-emerald-600 font-medium">Free Delivery</span>
          ) : (
            <span className="text-rose-500 font-bold">Currently Out of Stock</span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isAdding}
          className={`mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            product.stock <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98] shadow-xs'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
