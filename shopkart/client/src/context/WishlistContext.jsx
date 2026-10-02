import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist();
      if (res.data.success && res.data.wishlist) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback((productId) => {
    if (!productId || !wishlist) return false;
    return wishlist.some(item => (item._id || item) === productId);
  }, [wishlist]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      info('Please sign in to save items to your wishlist.');
      return false;
    }

    const productId = product._id || product;
    const exists = isWishlisted(productId);

    try {
      if (exists) {
        const res = await wishlistAPI.removeFromWishlist(productId);
        if (res.data.success) {
          setWishlist(res.data.wishlist);
          info('Removed from your wishlist.');
          return false;
        }
      } else {
        const res = await wishlistAPI.addToWishlist(productId);
        if (res.data.success) {
          setWishlist(res.data.wishlist);
          success('Added to your wishlist!');
          return true;
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update wishlist.';
      error(msg);
      return exists;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const res = await wishlistAPI.removeFromWishlist(productId);
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        info('Removed from wishlist.');
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        fetchWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
