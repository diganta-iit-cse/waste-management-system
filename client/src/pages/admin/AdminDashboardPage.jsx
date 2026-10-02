import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import SimpleChart from '../../components/admin/SimpleChart';
import api from '../../api/axiosInstance';
import {
  IndianRupee,
  Ticket,
  Users,
  Film,
  CalendarDays,
  TrendingUp,
  Star,
  Building,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bookings/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-cinema-950">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Executive Analytics & Operations
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time box-office telemetry, occupancy metrics, and reservation traffic
          </p>
        </div>

        {/* KPI Cards Row */}
        {loading || !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-cinema-900 rounded-2xl h-28 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`}
              icon={IndianRupee}
              color="emerald"
              trend="+18.4%"
              subtitle="vs last week"
            />
            <StatsCard
              title="Total Bookings"
              value={stats.totalBookings || 0}
              icon={Ticket}
              color="brand"
              trend="+12%"
              subtitle="orders placed"
            />
            <StatsCard
              title="Active Shows"
              value={stats.totalShows || 0}
              icon={CalendarDays}
              color="amber"
              subtitle="scheduled runs"
            />
            <StatsCard
              title="Movie Catalog"
              value={stats.totalMovies || 0}
              icon={Film}
              color="purple"
              subtitle="in distribution"
            />
            <StatsCard
              title="Registered Users"
              value={stats.totalUsers || 0}
              icon={Users}
              color="blue"
              trend="+6"
              subtitle="members"
            />
          </div>
        )}

        {/* Charts Section */}
        {stats?.last7Days && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleChart
              title="Box Office Gross Revenue (₹)"
              data={stats.last7Days}
              metric="revenue"
            />
            <SimpleChart
              title="Reservation Volume (Tickets Booked)"
              data={stats.last7Days}
              metric="bookings"
            />
          </div>
        )}

        {/* Top Movies & Occupancy Overview */}
        {stats?.topMovies && (
          <div className="bg-cinema-900 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand" />
                <span>Top Performing Theatrical Titles</span>
              </h3>
              <span className="text-xs text-gray-400">Box Office Rank</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-white/5 uppercase">
                    <th className="py-3 px-4">Movie</th>
                    <th className="py-3 px-4">Audience Rating</th>
                    <th className="py-3 px-4">Confirmed Bookings</th>
                    <th className="py-3 px-4">Auditorium Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.topMovies.map((movie, index) => (
                    <tr key={index} className="hover:bg-cinema-850/50 transition-colors">
                      <td className="py-3.5 px-4 flex items-center space-x-3">
                        <img
                          src={movie.posterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=100&q=80'}
                          alt={movie.title}
                          className="w-8 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <span className="font-bold text-white text-sm">{movie.title}</span>
                      </td>
                      <td className="py-3.5 px-4 text-amber-400 font-bold">
                        ★ {movie.rating || 4.5}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white text-sm">
                        {movie.bookings || 0} reservations
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px]">
                          High Occupancy
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
