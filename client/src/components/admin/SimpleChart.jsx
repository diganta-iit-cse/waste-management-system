import React from 'react';

const SimpleChart = ({ data = [], title, metric = 'revenue' }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d[metric] || 1), 100);

  return (
    <div className="bg-cinema-900 border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <span className="text-xs text-gray-400">Last 7 Days</span>
      </div>

      <div className="h-48 flex items-end gap-3 sm:gap-6 pt-4 px-2">
        {data.map((item, index) => {
          const val = item[metric] || 0;
          const heightPercent = Math.max(8, Math.round((val / maxValue) * 100));

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-brand bg-cinema-800 px-2 py-0.5 rounded shadow border border-white/10 pointer-events-none mb-1">
                {metric === 'revenue' ? `₹${val}` : `${val} bks`}
              </div>

              {/* Bar */}
              <div className="w-full bg-cinema-850 rounded-t-lg h-36 flex items-end overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-purple-700 to-brand rounded-t-lg group-hover:from-purple-600 group-hover:to-rose-400 transition-all duration-300"
                />
              </div>

              {/* Day label */}
              <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">
                {item.day || item.date?.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleChart;
