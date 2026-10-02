import React from 'react';
import { Plus, Minus } from 'lucide-react';

const FoodCard = ({ item, quantity = 0, onAdd, onRemove }) => {
  return (
    <div className="flex bg-cinema-900 border border-white/10 rounded-2xl overflow-hidden shadow-lg p-3 sm:p-4 gap-4 hover:border-white/20 transition-all">
      {/* Item Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cinema-850 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {/* Veg / Non-Veg badge */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-white/90 backdrop-blur-md rounded border flex items-center justify-center">
          <div
            className={`w-2 h-2 rounded-full ${
              item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
            {item.name}
          </h4>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
          <span className="text-base font-black text-white">₹{item.price}</span>

          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-cinema-850 border border-brand/40 rounded-xl px-2 py-1">
              <button
                type="button"
                onClick={onRemove}
                className="w-6 h-6 rounded-lg bg-cinema-800 hover:bg-brand text-white flex items-center justify-center transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-white w-5 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onAdd}
                className="w-6 h-6 rounded-lg bg-cinema-800 hover:bg-brand text-white flex items-center justify-center transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand/50 bg-brand/10 hover:bg-brand text-brand hover:text-white font-bold text-xs transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
