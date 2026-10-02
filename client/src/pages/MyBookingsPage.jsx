import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToast } from '../features/ui/uiSlice';
import TicketModal from '../components/booking/TicketModal';
import api from '../api/axiosInstance';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Film,
  Download,
  Eye,
  XCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/my-bookings');
      return;
    }

    const loadBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bookings/my');
        setBookings(res.data.data || []);
      } catch (err) {
        console.error('Failed to load bookings:', err);
        dispatch(addToast({ type: 'error', message: err.message }));
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [isAuthenticated, navigate, dispatch]);

  // Separate bookings into upcoming and past
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings.filter((b) => {
    const showDate = b.show?.date || b.createdAt?.slice(0, 10);
    return showDate >= todayStr && b.bookingStatus !== 'cancelled';
  });

  const pastBookings = bookings.filter((b) => {
    const showDate = b.show?.date || b.createdAt?.slice(0, 10);
    return showDate < todayStr || b.bookingStatus === 'cancelled';
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCancelBooking = async (id, bookingIdStr) => {
    if (
      !window.confirm(
        `Are you sure you want to cancel booking ${bookingIdStr}? In accordance with our refund policy, a 75% refund will be credited to your payment source.`
      )
    ) {
      return;
    }

    try {
      setCancellingId(id);
      const res = await api.post(`/bookings/${id}/cancel`, {
        reason: 'Customer cancelled via My Bookings portal',
      });
      dispatch(addToast({ type: 'success', message: res.data.message }));

      // Refresh list
      const updated = await api.get('/bookings/my');
      setBookings(updated.data.data || []);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Page Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Ticket className="w-7 h-7 text-brand" />
            <span>My Bookings</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Access your active movie tickets, QR passes, and booking history
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-cinema-900 border border-white/10 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'past'
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past & Cancelled ({pastBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-cinema-900 rounded-3xl h-44 animate-pulse"></div>
          ))}
        </div>
      ) : displayedBookings.length > 0 ? (
        <div className="space-y-6">
          {displayedBookings.map((b) => {
            const movie = b.movie || {};
            const theatre = b.theatre || {};
            const screen = b.screen || {};
            const show = b.show || {};
            const isCancelled = b.bookingStatus === 'cancelled';

            return (
              <div
                key={b._id}
                className="bg-cinema-900 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-white/20 transition-all"
              >
                {/* Poster & Details */}
                <div className="flex gap-4 items-center flex-1">
                  <img
                    src={movie.posterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80'}
                    alt={movie.title}
                    className="w-20 h-28 object-cover rounded-2xl border border-white/10 flex-shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand">
                        {b.bookingId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isCancelled
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isCancelled ? 'Cancelled' : 'Confirmed'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand" />
                      <span>{theatre.name} • {screen.name}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{show.date || b.createdAt?.slice(0, 10)}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{show.startTime || '7:00 PM'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      Seats: <strong className="text-white">{b.seats?.map((s) => s.seatId).join(', ')}</strong>
                    </p>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Total Paid
                    </span>
                    <span className="text-2xl font-black text-white">₹{b.totalAmount}</span>
                    {isCancelled && b.refundAmount && (
                      <span className="text-[11px] text-rose-400 block">
                        Refund: ₹{b.refundAmount} initiated
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedBookingForModal(b)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-brand/20 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(b._id, b.bookingId)}
                        disabled={cancellingId === b._id}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cinema-850 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 font-semibold text-xs border border-white/10 hover:border-rose-500/30 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{cancellingId === b._id ? 'Cancelling...' : 'Cancel'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-cinema-900 border border-white/10 rounded-3xl p-16 text-center space-y-4">
          <Ticket className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Bookings Found</h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming shows booked right now. Check out the latest movies in theatres!"
              : 'You have no past or cancelled bookings in your history.'}
          </p>
          <button
            onClick={() => navigate('/movies')}
            className="px-6 py-2.5 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-xs transition-colors"
          >
            Explore Movies Now
          </button>
        </div>
      )}

      {/* Ticket Pass Modal */}
      <TicketModal
        isOpen={!!selectedBookingForModal}
        onClose={() => setSelectedBookingForModal(null)}
        booking={selectedBookingForModal}
      />
    </div>
  );
};

export default MyBookingsPage;
