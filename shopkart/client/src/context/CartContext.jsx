import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [cart, setCart] = useState({
    items: [],
    savedForLater: [],
    summary: {
      totalMRP: 0,
      sellingTotal: 0,
      discount: 0,
      deliveryFee: 0,
      finalTotal: 0,
      totalQuantity: 0
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        savedForLater: [],
        summary: {
          totalMRP: 0,
          sellingTotal: 0,
          discount: 0,
          deliveryFee: 0,
          finalTotal: 0,
          totalQuantity: 0
        }
      });
      return;
    }

    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      info('Please sign in to add items to your cart.');
      return false;
    }

    try {
      setLoading(true);
      const res = await cartAPI.addToCart(productId, quantity);
      if (res.data.success) {
        setCart(res.data.cart);
        success('Item added to cart!');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart.';
      error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return false;

    try {
      const res = await cartAPI.updateQuantity(productId, quantity);
      if (res.data.success) {
        setCart(res.data.cart);
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update quantity.';
      error(msg);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      const res = await cartAPI.removeFromCart(productId);
      if (res.data.success) {
        setCart(res.data.cart);
        success('Item removed from cart.');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item.';
      error(msg);
      return false;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      const res = await cartAPI.clearCart();
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const saveForLater = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      const res = await cartAPI.saveForLater(productId);
      if (res.data.success) {
        setCart(res.data.cart);
        info('Item moved to Save for Later.');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save for later.';
      error(msg);
      return false;
    }
  };

  const moveToCart = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      const res = await cartAPI.moveToCart(productId);
      if (res.data.success) {
        setCart(res.data.cart);
        success('Item moved back to cart.');
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to move to cart.';
      error(msg);
      return false;
    }
  };

  const itemCount = cart.items ? cart.items.reduce((total, item) => total + (item.quantity || 1), 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items || [],
        savedForLater: cart.savedForLater || [],
        summary: cart.summary || {},
        itemCount,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        saveForLater,
        moveToCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
