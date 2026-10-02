import React, { useState, useEffect, useRef } from 'react';
  import { Link, useNavigate, useLocation } from 'react-router-dom';
  import { useSelector, useDispatch } from 'react-redux';
  import { openLocationModal } from '../../features/city/citySlice';
  import { logout } from '../../features/auth/authSlice';
  import { addToast } from '../../features/ui/uiSlice';
  import api from '../../api/axiosInstance';
  import {
    Film,
    MapPin,
    Search,
    User as UserIcon,
    Ticket,
    LogOut,
    ChevronDown,
    Menu,
    X,
    Shield,
    Calendar,
    Sparkles,
  } from 'lucide-react';

  const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, isAuthenticated, isAdmin } = useSelector((state) => state.auth);
    const { selectedCity } = useSelector((state) => state.city);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResultsDropdown, setShowResultsDropdown] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const searchRef = useRef(null);
    const userDropdownRef = useRef(null);

    // Debounced search logic
    useEffect(() => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResultsDropdown(false);
        return;
      }

      const timer = setTimeout(async () => {
        try {
          setIsSearching(true);
          const res = await api.get('/movies', {
            params: { search: searchQuery.trim(), limit: 5 },
          });
          setSearchResults(res.data.data || []);
          setShowResultsDropdown(true);
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close popups on click outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
          setShowResultsDropdown(false);
        }
        if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
          setUserDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
      setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
      dispatch(logout());
      dispatch(addToast({ type: 'info', message: 'You have been logged out' }));
      setUserDropdownOpen(false);
      navigate('/');
    };

    const handleSelectMovie = (id) => {
      setShowResultsDropdown(false);
      setSearchQuery('');
      navigate(`/movies/${id}`);
    };

    return (
      <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 via-brand to-rose-400 flex items-center justify-center shadow-lg shadow-brand/30 group-hover:scale-105 transition-transform duration-200">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-brand transition-colors">
                    Cine<span className="text-brand">Book</span>
                  </span>
                  <span className="text-[10px] tracking-widest text-gray-400 uppercase -mt-1 font-semibold">
                    Cinema & Events
                  </span>
                </div>
              </Link>

              {/* City Selector */}
              <button
                onClick={() => dispatch(openLocationModal())}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cinema-850 hover:bg-cinema-800 text-gray-200 text-sm font-medium border border-white/5 hover:border-white/10 transition-colors"
                title="Change City"
              >
                <MapPin className="w-4 h-4 text-brand" />
                <span className="max-w-[90px] truncate">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            {/* Global Search Bar */}
            <div ref={searchRef} className="flex-1 max-w-lg relative hidden sm:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowResultsDropdown(true);
                  }}
                  placeholder="Search for Movies, Events, Plays, Sports..."
                  className="w-full bg-cinema-900/90 text-sm text-gray-200 pl-10 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-brand/80 focus:ring-1 focus:ring-brand/80 placeholder:text-gray-500 transition-all"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showResultsDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-cinema-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                    {searchResults.map((movie) => (
                      <div
                        key={movie._id}
                        onClick={() => handleSelectMovie(movie._id)}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-cinema-800 cursor-pointer transition-colors"
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <span className="text-amber-400 font-medium">★ {movie.rating}</span>
                            <span>•</span>
                            <span className="truncate">{movie.genres?.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Nav Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* City selector on mobile */}
              <button
                onClick={() => dispatch(openLocationModal())}
                className="md:hidden flex items-center space-x-1 p-2 rounded-lg bg-cinema-850 text-gray-200 text-xs border border-white/5"
              >
                <MapPin className="w-3.5 h-3.5 text-brand" />
                <span className="max-w-[70px] truncate">{selectedCity}</span>
              </button>

              {/* Admin Quick Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User Menu / Sign In */}
              {isAuthenticated ? (
                <div ref={userDropdownRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-cinema-800 transition-colors border border-transparent hover:border-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-200 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-cinema-900 border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300">
                            Administrator
                          </span>
                        )}
                      </div>

                      <Link
                        to="/my-bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-cinema-800 transition-colors"
                      >
                        <Ticket className="w-4 h-4 text-brand" />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-cinema-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span>Profile & Settings</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-purple-300 hover:text-purple-200 hover:bg-purple-950/40 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-purple-400" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <div className="border-t border-white/10 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-brand hover:from-rose-500 hover:to-rose-600 text-white text-sm font-semibold shadow-lg shadow-brand/20 transition-all duration-200"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cinema-850"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Sub Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 py-2.5 border-t border-white/5 text-sm font-medium text-gray-300">
            <Link to="/movies" className="hover:text-brand transition-colors flex items-center gap-1.5">
              <Film className="w-4 h-4 text-brand" />
              <span>Movies</span>
            </Link>
            <Link to="/movies?status=coming_soon" className="hover:text-brand transition-colors">
              Coming Soon
            </Link>
            <span className="text-gray-500 cursor-not-allowed flex items-center gap-1">
              Events
              <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded">Soon</span>
            </span>
            <span className="text-gray-500 cursor-not-allowed flex items-center gap-1">
              Plays
              <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded">Soon</span>
            </span>
            <span className="text-gray-500 cursor-not-allowed flex items-center gap-1">
              Sports
              <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded">Soon</span>
            </span>
            <Link to="/my-bookings" className="ml-auto text-xs text-brand hover:underline font-semibold flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" />
              Check Booked Tickets
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-cinema-900 p-4 space-y-3 animate-fade-in">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full bg-cinema-800 text-sm text-gray-200 pl-9 pr-4 py-2 rounded-xl border border-white/10"
              />
            </div>

            <Link
              to="/movies"
              className="block px-3 py-2 rounded-lg text-gray-200 font-medium hover:bg-cinema-800"
            >
              Movies
            </Link>
            <Link
              to="/movies?status=coming_soon"
              className="block px-3 py-2 rounded-lg text-gray-200 font-medium hover:bg-cinema-800"
            >
              Coming Soon
            </Link>
            <Link
              to="/my-bookings"
              className="block px-3 py-2 rounded-lg text-gray-200 font-medium hover:bg-cinema-800"
            >
              My Bookings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-lg text-purple-400 font-medium hover:bg-purple-950/30"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </header>
    );
  };

  export default Navbar;
