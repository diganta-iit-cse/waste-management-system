import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSeat } from '../../features/booking/bookingSlice';

const SeatMap = ({ seatMap = [], lockedSeats = [], bookedSeats = [] }) => {
  const dispatch = useDispatch();
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);

  const isSelected = (seatId) => selectedSeats.some((s) => s.seatId === seatId);

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked' || seat.status === 'locked') return;
    dispatch(
      toggleSeat({
        seatId: seat.seatId,
        row: seat.row,
        number: seat.number,
        category: seat.category,
        price: seat.price,
      })
    );
  };

  return (
    <div className="w-full flex flex-col items-center py-6 overflow-x-auto">
      {/* Curved Screen Element */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-12">
        <div className="w-4/5 h-2.5 rounded-full bg-gradient-to-r from-brand/20 via-brand to-brand/20 screen-glow mb-3"></div>
        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
          <span>────────</span>
          <span className="text-gray-400">All Eyes This Way • Cinema Screen</span>
          <span>────────</span>
        </p>
      </div>

      {/* Seat Rows by Category */}
      <div className="min-w-[650px] space-y-6">
        {seatMap.map((rowConfig, idx) => {
          // Check if previous row had different category to show category divider
          const prevRow = idx > 0 ? seatMap[idx - 1] : null;
          const showCategoryHeader = !prevRow || prevRow.category !== rowConfig.category;

          return (
            <div key={rowConfig.row} className="space-y-2">
              {showCategoryHeader && (
                <div className="flex items-center gap-3 pt-3 pb-1 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand">
                    {rowConfig.category} Tier
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    ₹{rowConfig.price}
                  </span>
                </div>
              )}

              {/* Row Seats */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {/* Row Letter Left */}
                <span className="w-6 text-xs font-bold text-gray-400 text-center select-none">
                  {rowConfig.row}
                </span>

                {/* Seat Buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {rowConfig.seats.map((seat, seatIdx) => {
                    const selected = isSelected(seat.seatId);
                    const isBooked = seat.status === 'booked';
                    const isLocked = seat.status === 'locked';

                    // Insert middle aisle after half of row seats
                    const isAisle = seatIdx === Math.floor(rowConfig.seats.length / 2) - 1;

                    let seatClasses =
                      'w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-all duration-150 relative select-none ';

                    if (isBooked) {
                      seatClasses += 'bg-cinema-800 text-gray-600 border border-white/5 cursor-not-allowed opacity-40';
                    } else if (isLocked) {
                      seatClasses += 'bg-amber-500/10 border-2 border-amber-500/80 text-amber-400 cursor-not-allowed';
                    } else if (selected) {
                      seatClasses +=
                        'bg-brand text-white border border-brand shadow-lg shadow-brand/40 scale-105 cursor-pointer';
                    } else {
                      seatClasses +=
                        'bg-cinema-850 hover:bg-cinema-800 text-gray-300 border border-white/10 hover:border-brand/50 hover:text-white cursor-pointer';
                    }

                    return (
                      <React.Fragment key={seat.seatId}>
                        <button
                          type="button"
                          disabled={isBooked || isLocked}
                          onClick={() => handleSeatClick(seat)}
                          className={seatClasses}
                          title={`${seat.seatId} - ${seat.category} (₹${seat.price})`}
                        >
                          {seat.number}
                        </button>
                        {isAisle && <div className="w-6 sm:w-8" aria-hidden="true" />}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Letter Right */}
                <span className="w-6 text-xs font-bold text-gray-400 text-center select-none">
                  {rowConfig.row}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatMap;
