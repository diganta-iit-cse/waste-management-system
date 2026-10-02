import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Package,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Zap,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productAPI } from '../../services/api';
import { formatINR } from '../../utils/formatters';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Debounced search query
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await productAPI.getProducts({ search: searchQuery, limit: 5 });
        if (res.data.success) {
          setSuggestions(res.data.products || []);
        }
      } catch (err) {
        console.error('Search suggest error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSelectSuggestion = (productId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* Top Notification Bar */}
      <div className="bg-[#0F172A] text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-gray-950 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide">
              FESTIVE OFFER
            </span>
            <span className="hidden sm:inline">Get 10% Extra Cashback with ShopKart Axis Bank Card!</span>
            <span className="sm:hidden">Special Festive Offers Live!</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <Link to="/products?discount=30" className="hover:text-amber-400 transition flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Deals of the Day</span>
            </Link>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline">24x7 Customer Support</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 leading-none">
                SHOP<span className="text-blue-600">KART</span>
              </span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wide flex items-center gap-1">
                Explore <span className="text-amber-500 font-bold italic">Plus+</span>
              </span>
            </div>
          </Link>

          {/* Search Bar with Autocomplete Suggestions */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for products, brands, electronics, fashion and more..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-11 pr-24 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="p-2 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Products
                </div>
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelectSuggestion(item._id)}
                      className="p-3 hover:bg-blue-50/60 cursor-pointer flex items-center gap-3 transition"
                    >
                      <img
                        src={item.images?.[0] || ''}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded border border-gray-100 p-0.5 bg-white flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          in <span className="text-blue-600 font-medium">{item.brand}</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-gray-900">
                        {formatINR(item.price)}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full p-2.5 text-xs text-center text-blue-600 hover:bg-gray-50 font-semibold border-t border-gray-100 block"
                >
                  View all results for "{searchQuery}" →
                </button>
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center gap-1.5 text-sm font-medium"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden lg:inline text-xs font-semibold">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition flex items-center gap-1.5 text-sm font-medium"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-800" />
              <span className="hidden lg:inline text-xs font-bold">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-gray-950 text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div ref={userDropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-white transition text-xs font-semibold text-gray-800"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs uppercase font-bold">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="max-w-[90px] truncate hidden sm:inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>My Profile & Addresses</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    >
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span>My Wishlist</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-600 bg-amber-50/50 hover:bg-amber-100/50"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 md:hidden hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 bg-gray-50 text-xs text-gray-900 rounded-lg border border-gray-200 focus:outline-hidden focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 text-white rounded text-[11px] font-bold"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
