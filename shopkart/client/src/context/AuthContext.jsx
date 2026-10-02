import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('shopkart_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopkart_token') || null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Load fresh user data on init if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('shopkart_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Failed to load profile:', err);
          logout(false);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('shopkart_token', receivedToken);
        localStorage.setItem('shopkart_user', JSON.stringify(receivedUser));
        success(`Welcome back, ${receivedUser.name.split(' ')[0]}!`);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      setLoading(true);
      const res = await authAPI.register(formData);
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('shopkart_token', receivedToken);
        localStorage.setItem('shopkart_user', JSON.stringify(receivedUser));
        success('Account created successfully!');
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = (notify = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('shopkart_token');
    localStorage.removeItem('shopkart_user');
    if (notify) {
      success('Logged out successfully.');
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('shopkart_user', JSON.stringify(res.data.user));
        success('Profile updated successfully.');
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const addAddress = async (data) => {
    try {
      const res = await authAPI.addAddress(data);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
        success('Address added successfully.');
        return { success: true, addresses: res.data.addresses };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add address.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const updateAddress = async (id, data) => {
    try {
      const res = await authAPI.updateAddress(id, data);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
        success('Address updated.');
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update address.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await authAPI.deleteAddress(id);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
        success('Address removed.');
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete address.';
      error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
