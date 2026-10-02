import React from 'react';

const SeatLegend = ({ pricing = {} }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 bg-cinema-900 border border-white/10 rounded-2xl">
      {/* Seat States Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-300">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md border border-gray-600 bg-cinema-850"></div>
          <span>Available</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-brand border border-brand text-white shadow-sm shadow-brand/40"></div>
          <span className="font-semibold text-brand">Selected</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-cinema-700/50 border border-white/5 opacity-40 cursor-not-allowed"></div>
          <span className="text-gray-500">Booked</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md border-2 border-amber-500 bg-amber-500/10"></div>
          <span className="text-amber-400">Locked</span>
        </div>
      </div>

      {/* Category Price Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {pricing.VIP && (
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
            VIP: ₹{pricing.VIP}
          </span>
        )}
        {pricing.Premium && (
          <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold">
            Premium: ₹{pricing.Premium}
          </span>
        )}
        {pricing.Executive && (
          <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold">
            Executive: ₹{pricing.Executive}
          </span>
        )}
        {pricing.Normal && (
          <span className="px-2.5 py-1 rounded-md bg-gray-500/10 border border-gray-500/30 text-gray-300 font-semibold">
            Normal: ₹{pricing.Normal}
          </span>
        )}
      </div>
    </div>
  );
};

export default SeatLegend;
