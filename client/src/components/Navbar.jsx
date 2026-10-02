import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Recycle,
  Search,
  Mic,
  Eye,
  Sliders,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Calendar,
  History,
  LayoutDashboard,
  LogOut,
  Database,
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import VoiceInput from './VoiceInput';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessibilityMode, toggleAccessibilityMode, speakFeedback } = useVoice();
  const { user, isAdmin, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [showDbModal, setShowDbModal] = useState(false);

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const res = await axios.get('/api/dashboard/db-status');
        if (res.data.success) {
          setDbStatus(res.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch DB status:', err);
      }
    };
    fetchDbStatus();
    const interval = setInterval(fetchDbStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Classify Waste', path: '/classify' },
    { name: 'Kabadiwala Services', path: '/services' },
    { name: 'Schedule Pickup', path: '/pickup' },
    { name: 'History', path: '/history' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-gray-950/90 backdrop-blur-md border-b border-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group focus:outline-none">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all">
              <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
                <Recycle className="text-emerald-400 group-hover:rotate-180 transition-transform duration-700" size={24} />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Waste<span className="text-emerald-400">Wise</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase block -mt-1">
                AI & Circular Economy
              </span>
            </div>
          </Link>

          {/* Global Search with 🎤 STT (Requirement #43: General Search with microphone) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <div className="relative w-full">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder='Search e.g. "Find plastic recycling centers"...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 rounded-xl bg-gray-900 border border-emerald-500/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm text-white placeholder-gray-400 transition-all"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <VoiceInput
                    onTranscript={(spokenText) => {
                      setSearchQuery(spokenText);
                      navigate(`/services?query=${encodeURIComponent(spokenText)}`);
                    }}
                    size="sm"
                    label="Speak search"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  location.pathname === '/admin'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                    : 'text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                <ShieldCheck size={16} />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Controls Container */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real MongoDB Connection Status Indicator */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDbModal(!showDbModal)}
                title="MongoDB Real Database Connection Status"
                aria-label="View MongoDB database status"
                className={`p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  dbStatus?.status === 'Connected'
                    ? 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                }`}
              >
                <Database size={15} className={dbStatus?.status === 'Connected' ? 'text-emerald-400' : 'text-rose-400'} />
                <span className="hidden lg:inline">
                  {dbStatus?.status === 'Connected' ? 'MongoDB: Live' : 'MongoDB'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* Database Telemetry Popup */}
              {showDbModal && dbStatus && (
                <div
                  role="dialog"
                  className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-gray-900 border border-emerald-500/50 shadow-2xl p-4 z-50 text-xs text-gray-200 backdrop-blur-xl animate-in fade-in duration-150 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Database size={15} className="text-emerald-400" />
                      MongoDB WiredTiger
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-600/50">
                      ONLINE
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Database:</span>
                      <span className="font-mono text-emerald-300 font-semibold">{dbStatus.databaseName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Host / Port:</span>
                      <span className="font-mono text-gray-200">{dbStatus.host}:{dbStatus.port || 27017}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage Engine:</span>
                      <span className="text-gray-200">WiredTiger (Persistent)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Live Physical Documents ({dbStatus.documentCounts.totalDocuments})
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-300">
                      <div>• Classifications: <strong>{dbStatus.documentCounts.classifications}</strong></div>
                      <div>• Kabadiwalas: <strong>{dbStatus.documentCounts.recyclingServices}</strong></div>
                      <div>• Pickups: <strong>{dbStatus.documentCounts.pickupRequests}</strong></div>
                      <div>• Registered Users: <strong>{dbStatus.documentCounts.users}</strong></div>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400 text-center pt-1 border-t border-gray-800">
                    Disk Storage: <code className="text-emerald-400">server/data/db</code>
                  </div>
                </div>
              )}
            </div>

            {/* Multi-language Selector (Requirement #44) */}
            <LanguageSelector className="hidden sm:inline-block" />

            {/* Accessibility Mode Toggle (Requirement #51) */}
            <button
              type="button"
              onClick={toggleAccessibilityMode}
              title={accessibilityMode ? 'Disable Accessibility Mode' : 'Enable Accessibility Mode (High contrast, large fonts)'}
              aria-label="Toggle Accessibility Mode"
              className={`p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                accessibilityMode
                  ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/30'
                  : 'bg-gray-900/80 hover:bg-gray-800 text-gray-300 border border-emerald-500/30'
              }`}
            >
              <Eye size={17} className={accessibilityMode ? 'text-gray-950' : 'text-emerald-400'} />
              <span className="hidden md:inline">
                {accessibilityMode ? 'A11y ON' : 'A11y'}
              </span>
            </button>

            {/* Voice Settings Link (Requirement #55) */}
            <Link
              to="/settings"
              title="Voice & Accessibility Settings"
              aria-label="Voice & Accessibility Settings"
              className={`p-2 rounded-xl transition-colors border border-emerald-500/30 ${
                location.pathname === '/settings'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                  : 'bg-gray-900/80 hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Sliders size={18} />
            </Link>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                >
                  <User size={15} />
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder='Search e.g. "Find e-waste centers"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-11 py-2 rounded-xl bg-gray-900 border border-emerald-500/30 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <div className="absolute right-1">
              <VoiceInput
                onTranscript={(txt) => {
                  setSearchQuery(txt);
                  navigate(`/services?query=${encodeURIComponent(txt)}`);
                }}
                size="sm"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-150">
          <div className="pb-2">
            <LanguageSelector className="w-full" />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                location.pathname === link.path
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-bold text-amber-400 bg-amber-950/50 border border-amber-600/40"
            >
              Admin Dashboard
            </Link>
          )}

          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl font-medium text-emerald-400 bg-gray-900 border border-gray-800"
          >
            Voice & Accessibility Settings
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
