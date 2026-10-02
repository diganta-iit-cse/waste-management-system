import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  applyCouponSuccess,
  removeCoupon,
  setConfirmedBooking,
} from '../features/booking/bookingSlice';
import { addToast } from '../features/ui/uiSlice';
import PaymentModal from '../components/booking/PaymentModal';
import api from '../api/axiosInstance';
import {
  Ticket,
  Film,
  MapPin,
  Calendar,
  Clock,
  Tag,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  ArrowLeft,
  X,
} from 'lucide-react';

const CheckoutPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentShow,
    selectedSeats,
    foodCart,
    coupon,
    lockSessionId,
  } = useSelector((state) => state.booking);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Redirect if no seats
  useEffect(() => {
    if (!selectedSeats || selectedSeats.length === 0) {
      navigate(`/booking/${showId}`);
    }
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [selectedSeats, showId, isAuthenticated, navigate]);

  if (!currentShow || selectedSeats.length === 0) return null;

  const movie = currentShow.movie || {};
  const theatre = currentShow.theatre || {};
  const screen = currentShow.screen || {};

  // Calculations
  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const convenienceFee = selectedSeats.length * 30;
  const taxes = Math.round(convenienceFee * 0.18);
  const foodSubtotal = foodCart.reduce(
    (sum, f) => sum + (Number(f.price) || 0) * (Number(f.quantity) || 1),
    0
  );
  const discount = coupon ? Number(coupon.discountAmount) || 0 : 0;
  const totalAmount = Math.max(0, ticketSubtotal + convenienceFee + taxes + foodSubtotal - discount);

  // Apply Coupon via backend validation
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    try {
      setCouponLoading(true);
      const res = await api.post('/coupons/validate', {
        code: couponCodeInput.trim(),
        amount: ticketSubtotal + foodSubtotal,
      });

      dispatch(applyCouponSuccess(res.data.data));
      dispatch(addToast({ type: 'success', message: res.data.message }));
      setCouponCodeInput('');
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    } finally {
      setCouponLoading(false);
    }
  };

  // Payment confirmation flow
  const handleConfirmPayment = async ({ method, isMock }) => {
    try {
      setBookingLoading(true);

      // Create booking payload
      const bookingPayload = {
        showId: currentShow._id,
        seats: selectedSeats,
        foodItems: foodCart.map((f) => ({
          foodItem: f._id,
          name: f.name,
          price: f.price,
          quantity: f.quantity,
        })),
        couponCode: coupon ? coupon.code : '',
        paymentMethod: method || 'mock_card',
        isMock: isMock !== undefined ? isMock : true,
      };

      const res = await api.post('/bookings', bookingPayload);
      const confirmedBooking = res.data.data;

      dispatch(setConfirmedBooking(confirmedBooking));
      dispatch(addToast({ type: 'success', message: 'Booking successfully confirmed!' }));
      setIsPaymentModalOpen(false);

      // Navigate to confirmation page
      navigate(`/booking/confirmation/${confirmedBooking._id}`);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Payment confirmation failed' }));
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Top Bar */}
      <div className="flex items-center space-x-3 pb-6 border-b border-white/10 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-300 hover:text-white border border-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">Order Checkout & Review</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Review your movie selection, seats, and complete your reservation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Movie & Seat Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Movie Card Preview */}
          <div className="flex gap-4 p-5 rounded-3xl bg-cinema-900 border border-white/10 shadow-xl">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-24 h-34 object-cover rounded-2xl border border-white/10 flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand/20 text-brand">
                {movie.certification || 'U/A'} • {currentShow.format || '2D'}
              </span>
              <h2 className="text-xl font-black text-white">{movie.title}</h2>
              <p className="text-xs text-gray-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand" />
                <span>{theatre.name}</span>
              </p>
              <p className="text-xs text-gray-400">
                {screen.name} • {theatre.address}
              </p>
              <div className="flex items-center gap-3 text-xs text-amber-400 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentShow.date}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentShow.startTime}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Reserved Seats List */}
          <div className="p-5 rounded-3xl bg-cinema-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Selected Cinema Seats ({selectedSeats.length})
              </span>
              <span className="text-xs text-brand font-semibold">5-Min Lock Active</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((s) => (
                <div
                  key={s.seatId}
                  className="px-3.5 py-1.5 rounded-xl bg-brand/15 border border-brand/40 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>Seat {s.seatId}</span>
                  <span className="text-[10px] text-gray-400 font-normal">({s.category} - ₹{s.price})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Food & Snacks */}
          {foodCart.length > 0 && (
            <div className="p-5 rounded-3xl bg-cinema-900 border border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block pb-2 border-b border-white/5">
                Food & Concessions ({foodCart.length})
              </span>
              <div className="space-y-2">
                {foodCart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between text-xs text-gray-300 py-1"
                  >
                    <span>
                      {item.name} <strong className="text-white">x {item.quantity}</strong>
                    </span>
                    <span className="font-semibold text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Code Section */}
          <div className="p-5 rounded-3xl bg-cinema-900 border border-white/10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Promotional Coupons & Vouchers
            </span>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. WELCOME100, MOVIE50)"
                  className="w-full bg-cinema-850 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs uppercase text-white font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand"
                />
              </div>
              <button
                type="submit"
                disabled={couponLoading}
                className="px-4 py-2 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-xs transition-colors"
              >
                {couponLoading ? 'Checking...' : 'APPLY'}
              </button>
            </form>

            {/* Quick coupon chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-gray-400">
              <span>Try:</span>
              {['WELCOME100', 'MOVIE50', 'FIRSTBOOKING'].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCouponCodeInput(c)}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 font-mono hover:text-white"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Price Breakdown & Pay CTA */}
        <div className="md:col-span-1 bg-cinema-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 sticky top-24">
          <h3 className="text-base font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-brand" />
            <span>Price Breakdown</span>
          </h3>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Tickets Subtotal</span>
              <span className="font-semibold text-white">₹{ticketSubtotal}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Convenience Fee</span>
              <span>₹{convenienceFee}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Integrated GST (18%)</span>
              <span>₹{taxes}</span>
            </div>

            {foodSubtotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Snacks & Drinks</span>
                <span className="font-semibold text-white">₹{foodSubtotal}</span>
              </div>
            )}

            {coupon && (
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <span>Coupon ({coupon.code})</span>
                  <button onClick={() => dispatch(removeCoupon())}>
                    <X className="w-3 h-3 text-gray-400 hover:text-white" />
                  </button>
                </span>
                <span>- ₹{discount}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-400">
              Total Amount
            </span>
            <span className="text-3xl font-black text-white">₹{totalAmount}</span>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-brand hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm shadow-xl shadow-brand/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Proceed to Payment</span>
          </button>

          <p className="text-[11px] text-gray-500 text-center leading-relaxed">
            By proceeding, you agree to CineBook's terms of service and movie ticket cancellation policies.
          </p>
        </div>
      </div>

      {/* Payment Options Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={totalAmount}
        onConfirmPayment={handleConfirmPayment}
        loading={bookingLoading}
      />
    </div>
  );
};

export default CheckoutPage;
