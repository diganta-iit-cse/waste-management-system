import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../features/ui/uiSlice';
import api from '../api/axiosInstance';
import { Film, Mail, Key, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1 = Request, 2 = Reset
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      dispatch(addToast({ type: 'success', message: res.data.message }));
      if (res.data.resetToken) {
        setToken(res.data.resetToken);
      }
      setStep(2);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) return;

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      dispatch(addToast({ type: 'success', message: res.data.message }));
      navigate('/login');
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
          <Link
            to="/login"
            className="p-1.5 rounded-lg bg-cinema-850 hover:bg-cinema-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-black text-white">Reset Account Password</h1>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              Enter your registered email address. We will generate a secure reset token for your account.
            </p>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-cinema-850 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-sm shadow-xl shadow-brand/20 transition-colors"
            >
              {loading ? 'Processing...' : 'Send Password Reset Token'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Token generated! Set your new password below.</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Security Reset Token
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="w-full bg-cinema-850 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full bg-cinema-850 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-sm shadow-xl shadow-brand/20 transition-colors"
            >
              {loading ? 'Resetting Password...' : 'Save New Password & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
