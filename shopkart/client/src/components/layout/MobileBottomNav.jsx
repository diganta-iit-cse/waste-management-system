import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, Package, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const MobileBottomNav = () => {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Explore', icon: Grid },
    { to: '/wishlist', label: 'Wishlist', icon: Heart, badge: wishlistCount },
    { to: '/orders', label: 'Orders', icon: Package },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: itemCount }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-1.5 px-3 shadow-lg flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1 px-2 text-[10px] font-semibold transition ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-gray-950 text-[9px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
