import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CartPage = () => {
  const {
    items,
    savedForLater,
    summary,
    loading,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (loading && items.length === 0) {
    return <LoadingSpinner text="Loading your shopping cart..." size="lg" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to see your cart</h2>
        <p className="text-xs text-gray-500">
          Your saved items and cart history will be securely synced with your account.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your Cart is Empty!</h2>
        <p className="text-xs text-gray-500">
          Explore our wide range of products and discover great deals today.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          My Cart ({summary.totalQuantity || items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <Link
          to="/products"
          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Cart Items + Saved For Later */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden divide-y divide-gray-100">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              const discount = product.originalPrice && product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div key={item._id || product._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${product._id}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-50 border border-gray-100 p-2 flex-shrink-0 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {product.brand}
                          </span>
                          <Link
                            to={`/product/${product._id}`}
                            className="block text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 transition leading-snug"
                          >
                            {product.name}
                          </Link>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="mt-2 flex items-baseline gap-2.5">
                        <span className="text-base font-bold text-gray-900">
                          {formatINR(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatINR(product.originalPrice)}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-xs font-bold text-emerald-600">
                            {discount}% off
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls & actions */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">Qty:</span>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQuantity(product._id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900 bg-white py-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, item.quantity + 1)}
                            disabled={product.stock && item.quantity >= product.stock}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <button
                          onClick={() => saveForLater(product._id)}
                          className="text-gray-600 hover:text-blue-600 flex items-center gap-1 transition"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save for Later</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(product._id)}
                          className="text-rose-500 hover:text-rose-700 flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saved For Later Section */}
          {savedForLater.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-500" />
                Saved For Later ({savedForLater.length})
              </h3>
              <div className="divide-y divide-gray-100">
                {savedForLater.map((sItem) => {
                  const prod = sItem.product;
                  if (!prod) return null;

                  return (
                    <div key={sItem._id || prod._id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prod.images?.[0] || ''}
                          alt={prod.name}
                          className="w-14 h-14 object-contain rounded-lg border border-gray-100 p-1 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                          <p className="text-xs font-semibold text-gray-900 mt-0.5">{formatINR(prod.price)}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => moveToCart(prod._id)}
                        className="px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg transition whitespace-nowrap"
                      >
                        Move to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Price Details Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-100">
              Price Details
            </h2>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Price ({summary.totalQuantity || items.length} items)</span>
                <span className="font-semibold text-gray-900">{formatINR(summary.totalMRP || 0)}</span>
              </div>

              <div className="flex justify-between text-emerald-600">
                <span>Discount on MRP</span>
                <span className="font-semibold">- {formatINR(summary.discount || 0)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>
                  {summary.deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">{formatINR(summary.deliveryFee)}</span>
                  )}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-sm font-bold text-gray-900">
                <span>Total Amount</span>
                <span>{formatINR(summary.finalTotal || 0)}</span>
              </div>
            </div>

            {summary.discount > 0 && (
              <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl text-xs font-bold text-center">
                You will save {formatINR(summary.discount)} on this order! 🎉
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              disabled={items.length === 0}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-gray-950 font-black rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Safe & Secure Info */}
          <div className="flex items-center gap-3 p-4 bg-white/70 rounded-xl border border-gray-100 text-xs text-gray-500">
            <ShieldCheck className="w-6 h-6 text-gray-400 flex-shrink-0" />
            <p>Safe and Secure Payments. 100% Authentic products guaranteed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
