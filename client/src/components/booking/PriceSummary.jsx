import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeCoupon } from '../../features/booking/bookingSlice';
import { Ticket, Clock, Tag, X } from 'lucide-react';

const PriceSummary = ({ onProceed, proceedLabel = 'Proceed to Checkout', loading = false }) => {
  const dispatch = useDispatch();
  const { selectedSeats, foodCart, coupon, lockSecondsRemaining } = useSelector(
    (state) => state.booking
  );

  // Calculate ticket subtotal
  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  // Convenience Fee (₹30 per ticket) & Taxes (18% GST)
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 30 : 0;
  const taxes = convenienceFee > 0 ? Math.round(convenienceFee * 0.18) : 0;

  // Food Subtotal
  const foodSubtotal = foodCart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  // Discount
  const discount = coupon ? Number(coupon.discountAmount) || 0 : 0;

  // Grand Total
  const total = Math.max(0, ticketSubtotal + convenienceFee + taxes + foodSubtotal - discount);

  // Format lock timer mm:ss
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-cinema-900 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Ticket className="w-4 h-4 text-brand" />
          <span>Booking Summary</span>
        </h3>
        {lockSecondsRemaining > 0 && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Lock: {formatTimer(lockSecondsRemaining)}</span>
          </span>
        )}
      </div>

      {/* Selected Seats Badges */}
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">
          Selected Seats ({selectedSeats.length})
        </p>
        {selectedSeats.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No seats selected yet</p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {selectedSeats.map((s) => (
              <span
                key={s.seatId}
                className="px-2.5 py-1 rounded-lg bg-brand/15 border border-brand/30 text-white text-xs font-bold"
              >
                {s.seatId} <span className="text-[10px] text-gray-400 font-normal">(₹{s.price})</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2.5 text-sm text-gray-300 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Tickets Subtotal</span>
          <span className="font-semibold text-white">₹{ticketSubtotal}</span>
        </div>

        {convenienceFee > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Convenience Fee</span>
            <span>₹{convenienceFee}</span>
          </div>
        )}

        {taxes > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">GST (18% on fee)</span>
            <span>₹{taxes}</span>
          </div>
        )}

        {foodSubtotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Food & Beverages</span>
            <span className="font-semibold text-white">₹{foodSubtotal}</span>
          </div>
        )}

        {coupon && (
          <div className="flex items-center justify-between text-emerald-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Coupon ({coupon.code})</span>
              <button
                onClick={() => dispatch(removeCoupon())}
                className="text-gray-400 hover:text-white"
                title="Remove Coupon"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
            <span>- ₹{discount}</span>
          </div>
        )}
      </div>

      {/* Total Section */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider block">
            Amount Payable
          </span>
          <span className="text-2xl font-black text-white">₹{total}</span>
        </div>

        <button
          onClick={onProceed}
          disabled={selectedSeats.length === 0 || loading}
          className={`px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all duration-200 ${
            selectedSeats.length > 0 && !loading
              ? 'bg-gradient-to-r from-rose-600 to-brand hover:from-rose-500 hover:to-rose-600 text-white shadow-brand/30 hover:scale-105 cursor-pointer'
              : 'bg-cinema-800 text-gray-500 cursor-not-allowed border border-white/5'
          }`}
        >
          {loading ? 'Processing...' : proceedLabel}
        </button>
      </div>
    </div>
  );
};

export default PriceSummary;
