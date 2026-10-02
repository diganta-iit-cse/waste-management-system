import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, Headphones, RefreshCw, Smartphone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cinema-900 border-t border-white/10 text-gray-400 mt-20">
      {/* Service Highlights */}
      <div className="border-b border-white/5 bg-cinema-850/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-3">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-bold">24/7 Customer Care</h4>
            <p className="text-xs text-gray-400 mt-1">Instant support anytime for your bookings</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-bold">100% Safe Payments</h4>
            <p className="text-xs text-gray-400 mt-1">Encrypted transactions & instant refunds</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-bold">Contactless M-Tickets</h4>
            <p className="text-xs text-gray-400 mt-1">Direct entry to cinema hall via QR Code</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-bold">Easy Cancellation</h4>
            <p className="text-xs text-gray-400 mt-1">Hassle-free cancellation & refunds</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                Cine<span className="text-brand">Book</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your premier gateway for instant movie tickets, concert passes, and live theatre experiences across India. Enjoy crystal-clear IMAX and Dolby Atmos screenings with zero booking friction.
            </p>
            <p className="text-xs text-gray-500">
              Helpline: <span className="text-white font-medium">1800-246-3266</span> (Toll-Free)
            </p>
          </div>

          {/* Movies in Cities */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Top Cinema Cities
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/movies" className="hover:text-brand transition-colors">Movies in Mumbai</Link></li>
              <li><Link to="/movies" className="hover:text-brand transition-colors">Movies in Delhi-NCR</Link></li>
              <li><Link to="/movies" className="hover:text-brand transition-colors">Movies in Bengaluru</Link></li>
              <li><Link to="/movies" className="hover:text-brand transition-colors">Movies in Hyderabad</Link></li>
              <li><Link to="/movies" className="hover:text-brand transition-colors">Movies in Chennai</Link></li>
              <li><Link to="/movies" className="hover:text-brand transition-colors">Movies in Kolkata</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/movies" className="hover:text-brand transition-colors">Now Showing</Link></li>
              <li><Link to="/movies?status=coming_soon" className="hover:text-brand transition-colors">Upcoming Releases</Link></li>
              <li><Link to="/my-bookings" className="hover:text-brand transition-colors">Download Tickets</Link></li>
              <li><Link to="/profile" className="hover:text-brand transition-colors">Account Settings</Link></li>
              <li><Link to="/login" className="hover:text-brand transition-colors">Partner / Admin Login</Link></li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Policies & Help
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-brand transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-brand transition-colors">Contact Support</a></li>
              <li><a href="#terms" className="hover:text-brand transition-colors">Terms & Conditions</a></li>
              <li><a href="#privacy" className="hover:text-brand transition-colors">Privacy Policy</a></li>
              <li><a href="#refunds" className="hover:text-brand transition-colors">Ticket Refund Guidelines</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} CineBook Entertainment Ltd. All rights reserved.</p>
          <p className="text-gray-400">
            Crafted for movie lovers with React, Redux, Express, and MongoDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
