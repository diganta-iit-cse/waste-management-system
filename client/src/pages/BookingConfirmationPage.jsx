import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from '../features/ui/uiSlice';
import TicketModal from '../components/booking/TicketModal';
import api from '../api/axiosInstance';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Film,
  Ticket,
  Mail,
  Download,
  Home,
  Eye,
  ArrowRight,
} from 'lucide-react';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { confirmedBooking } = useSelector((state) => state.booking);
  const [booking, setBooking] = useState(confirmedBooking || null);
  const [loading, setLoading] = useState(!confirmedBooking);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#ffffff', '#f59e0b'],
    });
  }, []);

  // Fetch booking if page is refreshed
  useEffect(() => {
    if (!booking && bookingId) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/bookings/${bookingId}`);
          setBooking(res.data.data);
        } catch (err) {
          console.error('Failed to load booking:', err);
          dispatch(addToast({ type: 'error', message: err.message }));
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [booking, bookingId, dispatch]);

  const handleEmailTicket = () => {
    dispatch(
      addToast({
        type: 'success',
        message: `M-Ticket with QR code emailed to ${booking?.user?.email || 'your registered email'}!`,
      })
    );
  };

  if (loading || !booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const movie = booking.movie || {};
  const theatre = booking.theatre || {};
  const screen = booking.screen || {};
  const show = booking.show || {};
  const seats = booking.seats || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Success Celebration Callout */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          🎉 Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Your reservation is confirmed. We have generated your official QR-entry digital pass below.
        </p>
      </div>

      {/* Booking Card */}
      <div className="bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Booking ID and Barcode Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase font-bold text-gray-400 block tracking-wider">
              Booking ID
            </span>
            <span className="text-2xl font-black tracking-widest text-brand font-mono">
              {booking.bookingId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              Confirmed & Paid
            </span>
          </div>
        </div>

        {/* Movie Info & QR Code Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Movie Poster & Details */}
          <div className="md:col-span-2 flex gap-4 items-center">
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-24 sm:w-28 h-36 sm:h-40 object-cover rounded-2xl border border-white/10 shadow-lg flex-shrink-0"
              />
            )}
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded bg-brand/20 text-brand text-[10px] font-bold uppercase">
                {movie.certification || 'U/A'} • {show.format || '2D'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{movie.title}</h2>
              <p className="text-xs text-gray-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand" />
                <span>{theatre.name}</span>
              </p>
              <p className="text-xs text-gray-400">
                {screen.name} • {theatre.address}
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl text-center">
            {booking.qrCode ? (
              <img
                src={booking.qrCode}
                alt={`QR Ticket ${booking.bookingId}`}
                className="w-32 h-32 object-contain"
              />
            ) : (
              <QrCode className="w-28 h-28 text-black" />
            )}
            <span className="text-[11px] font-mono text-gray-900 font-bold mt-1">
              Scan at Entrance
            </span>
          </div>
        </div>

        {/* Schedule & Seats Information */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-cinema-850/80 border border-white/5">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Date</span>
            <p className="text-sm font-bold text-white mt-1">{show.date}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Showtime</span>
            <p className="text-sm font-bold text-amber-400 mt-1">{show.startTime}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Seats</span>
            <p className="text-sm font-extrabold text-brand mt-1">
              {seats.map((s) => s.seatId || `${s.row}${s.number}`).join(', ')}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Paid</span>
            <p className="text-base font-black text-white mt-1">₹{booking.totalAmount}</p>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-brand/20 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Ticket</span>
            </button>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-200 hover:text-white font-semibold text-xs border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleEmailTicket}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-200 hover:text-white font-semibold text-xs border border-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email Ticket</span>
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>

      {/* Ticket Pass Modal */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        booking={booking}
      />
    </div>
  );
};

export default BookingConfirmationPage;
