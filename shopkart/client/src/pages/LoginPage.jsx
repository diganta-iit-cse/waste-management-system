import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const { info } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  // Quick Demo Login Fillers
  const fillDemoAdmin = () => {
    setEmail('admin@example.com');
    setPassword('Admin@123');
    info('Loaded Admin credentials. Click "Sign In" to proceed.');
  };

  const fillDemoUser = () => {
    setEmail('user@example.com');
    setPassword('User@123');
    info('Loaded Demo Customer credentials. Click "Sign In" to proceed.');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/30">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome to <span className="text-blue-600">ShopKart</span>
          </h1>
          <p className="text-xs text-gray-500">Sign in to access your orders, cart, and wishlist</p>
        </div>

        {/* Demo Account Quick-Fill Buttons */}
        <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 space-y-2">
          <span className="block text-[11px] font-bold text-blue-900 uppercase tracking-wider text-center">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-1.5 px-2 bg-white hover:bg-amber-50 text-gray-800 hover:text-amber-700 border border-gray-200 hover:border-amber-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              className="py-1.5 px-2 bg-white hover:bg-blue-50 text-gray-800 hover:text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Customer</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
