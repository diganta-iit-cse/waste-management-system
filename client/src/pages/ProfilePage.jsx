import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile, logout } from '../features/auth/authSlice';
import { addToast } from '../features/ui/uiSlice';
import { User, Mail, Phone, MapPin, Lock, Save, LogOut, Ticket, Shield } from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const { popularCities } = useSelector((state) => state.city);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        dispatch(addToast({ type: 'error', message: 'New passwords do not match' }));
        return;
      }
      if (!currentPassword) {
        dispatch(addToast({ type: 'error', message: 'Current password is required to set new password' }));
        return;
      }
    }

    try {
      const payload = { name, phone, city };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await dispatch(updateProfile(payload)).unwrap();
      dispatch(addToast({ type: 'success', message: 'Profile details saved successfully!' }));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to update profile' }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ type: 'info', message: 'Signed out successfully' }));
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Top Header Card */}
      <div className="bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand to-rose-400 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand/30">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/my-bookings"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-200 hover:text-white font-semibold text-xs border border-white/10 transition-colors"
          >
            <Ticket className="w-4 h-4 text-brand" />
            <span>My Bookings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 hover:text-rose-200 font-semibold text-xs border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleUpdate} className="bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Personal Details</h2>
          <p className="text-xs text-gray-400">Update your account name, contact number, and city preferences</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-cinema-850 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">
              Email Address (Fixed)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-cinema-800 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-cinema-850 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">
              Primary City Preference
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-cinema-850 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
              >
                {popularCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Change Password Sub-Section */}
        <div className="pt-6 border-t border-white/10">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand" />
              <span>Change Password</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Leave blank if you do not wish to update your password</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-brand/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
