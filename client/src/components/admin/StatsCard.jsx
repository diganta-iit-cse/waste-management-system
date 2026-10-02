import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, subtitle, color = 'brand' }) => {
  const colorMap = {
    brand: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };

  const selectedColor = colorMap[color] || colorMap.brand;

  return (
    <div className="bg-cinema-900 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            {trend && <span className="text-emerald-400 font-semibold">{trend}</span>}
            <span>{subtitle}</span>
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${selectedColor}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatsCard;
