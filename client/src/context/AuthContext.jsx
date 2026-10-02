import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('wastewise_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('wastewise_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const userData = res.data.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('wastewise_user', JSON.stringify(userData));
      localStorage.setItem('wastewise_token', userData.token);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, role) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
        phone,
        role: role || 'user',
      });
      const userData = res.data.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('wastewise_user', JSON.stringify(userData));
      localStorage.setItem('wastewise_token', userData.token);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wastewise_user');
    localStorage.removeItem('wastewise_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updatePreferences = async (settings) => {
    try {
      if (token) {
        const res = await axios.put(`${API_BASE}/auth/settings`, settings);
        const updated = { ...user, ...res.data.data };
        setUser(updated);
        localStorage.setItem('wastewise_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn('Failed to sync settings with server:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
