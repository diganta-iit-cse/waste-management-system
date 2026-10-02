import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Building2,
  CalendarDays,
  Ticket,
  Users,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Movies', path: '/admin/movies', icon: Film },
    { name: 'Theatres & Screens', path: '/admin/theatres', icon: Building2 },
    { name: 'Showtimes', path: '/admin/shows', icon: CalendarDays },
    { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-cinema-900 border-r border-white/10 flex flex-col justify-between p-4 min-h-screen">
      <div>
        {/* Admin Header */}
        <div className="flex items-center space-x-2.5 px-3 py-4 mb-6 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">CineBook</h2>
            <span className="text-[10px] tracking-wider font-bold text-purple-400 uppercase">
              Admin Console
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-gray-400 hover:text-white hover:bg-cinema-850'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Return to Customer Portal */}
      <div className="pt-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-cinema-850 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CineBook Portal</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
