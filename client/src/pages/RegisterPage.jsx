import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recycle, Lock, Mail, User, Phone, ArrowRight, Mic } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';
import VoiceInput from '../components/VoiceInput';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { speakFeedback } = useVoice();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const res = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone
    );
    setLoading(false);

    if (res.success) {
      speakFeedback('Welcome to WasteWise. Your eco account has been created.');
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message);
      speakFeedback('Sorry, registration failed. Please check your information.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-3xl bg-gray-900/90 border border-emerald-500/30 p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Recycle size={28} />
          </div>
          <h1 className="text-2xl font-black text-white">Join WasteWise</h1>
          <p className="text-xs text-gray-400">Start recycling responsibly and earn Swachh credits</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950 border border-rose-500/50 text-xs text-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User size={13} className="text-emerald-400" /> Full Name
              </span>
              <span className="text-[11px] text-gray-500">Voice enabled</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rahul Sharma"
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="absolute right-1.5">
                <VoiceInput
                  onTranscript={(txt) => setFormData({ ...formData, name: txt })}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Mail size={13} className="text-emerald-400" /> Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rahul@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Phone size={13} className="text-emerald-400" /> Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
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
              minLength="6"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Create Eco Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-800">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
