import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recycle, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { speakFeedback } = useVoice();

  const [email, setEmail] = useState('user@wastewise.org');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      // Requirement #54: Voice feedback after login
      speakFeedback('Welcome back to WasteWise.');
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message);
      speakFeedback('Sorry, something went wrong. Please check your credentials.');
    }
  };

  const handleQuickFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-3xl bg-gray-900/90 border border-emerald-500/30 p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Recycle size={28} />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to WasteWise</h1>
          <p className="text-xs text-gray-400">Access your waste classification and pickup portal</p>
        </div>

        {/* Demo Quick-Fill Buttons */}
        <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
            One-Click Demo Credentials:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('user@wastewise.org', 'Citizen')}
              className="py-1.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold border border-emerald-600/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <User size={13} />
              <span>Eco Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@wastewise.org', 'Admin')}
              className="py-1.5 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-semibold border border-amber-600/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={13} />
              <span>Admin HQ</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950 border border-rose-500/50 text-xs text-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Mail size={13} className="text-emerald-400" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Lock size={13} className="text-emerald-400" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-800">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
