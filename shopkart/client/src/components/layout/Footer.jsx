import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  CreditCard,
  Lock
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#172337] text-gray-300 mt-16 pt-10 pb-20 md:pb-10 text-xs">
      {/* Value Proposition Highlights Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-gray-700/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Free Delivery</p>
              <p className="text-gray-400 text-xs">On orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Genuine</p>
              <p className="text-gray-400 text-xs">Direct brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">7 Days Return</p>
              <p className="text-gray-400 text-xs">Hassle-free replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">24x7 Help Center</p>
              <p className="text-gray-400 text-xs">Round-the-clock support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-[11px]">ABOUT</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/products" className="hover:underline">About ShopKart</Link></li>
              <li><Link to="/products" className="hover:underline">Careers</Link></li>
              <li><Link to="/products" className="hover:underline">ShopKart Stories</Link></li>
              <li><Link to="/products" className="hover:underline">Press & Media</Link></li>
              <li><Link to="/products" className="hover:underline">Corporate Information</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-[11px]">HELP</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/orders" className="hover:underline">Payments & Invoices</Link></li>
              <li><Link to="/orders" className="hover:underline">Shipping & Tracking</Link></li>
              <li><Link to="/orders" className="hover:underline">Cancellation & Returns</Link></li>
              <li><Link to="/orders" className="hover:underline">FAQ</Link></li>
              <li><Link to="/orders" className="hover:underline">Report Infringement</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-[11px]">CONSUMER POLICY</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#terms" className="hover:underline">Cancellation & Returns</a></li>
              <li><a href="#terms" className="hover:underline">Terms of Use</a></li>
              <li><a href="#terms" className="hover:underline">Security & Privacy</a></li>
              <li><a href="#terms" className="hover:underline">Grievance Redressal</a></li>
              <li><a href="#terms" className="hover:underline">EPR Compliance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider mb-3 text-[11px]">SOCIAL</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">Twitter (X)</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:underline">YouTube</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 pt-4 md:pt-0">
            <h4 className="text-gray-400 font-bold uppercase tracking-wider mb-2 text-[11px]">Registered Office:</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              ShopKart Internet Private Limited,<br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103, Karnataka, India<br />
              CIN: U51109KA2026PTC066107
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/60 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-gray-400 text-xs flex-wrap justify-center">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShoppingBag className="w-3.5 h-3.5" />
              Become a Seller
            </span>
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              100% Secure Checkout
            </span>
            <span>© 2026 ShopKart.com. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400">Supported Payments:</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded text-[10px]">UPI</span>
              <span className="bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded text-[10px]">VISA</span>
              <span className="bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded text-[10px]">MasterCard</span>
              <span className="bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded text-[10px]">RuPay</span>
              <span className="bg-gray-800 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
