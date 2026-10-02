import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import TicketModal from '../../components/booking/TicketModal';
import api from '../../api/axiosInstance';
import {
  Ticket,
  Search,
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings', {
        params: { search, status: statusFilter, limit: 100 },
      });
      setBookings(res.data.data || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [search, statusFilter]);

  return (
    <div className="flex min-h-screen bg-cinema-950">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Ticket className="w-7 h-7 text-purple-400" />
              <span>Live Reservation Stream</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Search and review box-office transactions, seat allotments, and ticket status
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Booking Reference (e.g. CB-2026) or Coupon..."
              className="w-full bg-cinema-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-cinema-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="bg-cinema-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-850 text-gray-400 uppercase border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Movie</th>
                  <th className="py-3.5 px-4">Multiplex</th>
                  <th className="py-3.5 px-4">Seats</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      Loading reservation stream...
                    </td>
                  </tr>
                ) : bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-cinema-850/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-brand">
                        {b.bookingId}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{b.user?.name || 'Customer'}</p>
                        <p className="text-[10px] text-gray-400">{b.user?.email}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {b.movie?.title}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-300">{b.theatre?.name}</p>
                        <p className="text-[10px] text-gray-500">{b.show?.date} • {b.show?.startTime}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {b.seats?.map((s) => s.seatId).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-black text-white text-sm">
                        ₹{b.totalAmount}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedBookingForModal(b)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-gray-300 hover:text-white transition-colors"
                          title="View Digital Pass"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      No bookings matching search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Modal */}
        <TicketModal
          isOpen={!!selectedBookingForModal}
          onClose={() => setSelectedBookingForModal(null)}
          booking={selectedBookingForModal}
        />
      </main>
    </div>
  );
};

export default AdminBookingsPage;
