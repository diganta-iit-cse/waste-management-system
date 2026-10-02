import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, numReviews, size = 'sm', showBadge = true }) => {
  const numericRating = Number(rating) || 0;
  const isHighRating = numericRating >= 4.0;

  const starSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const badgeSizeClasses = {
    xs: 'text-[10px] px-1 py-0.5',
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-2.5 py-1'
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {showBadge ? (
        <span
          className={`inline-flex items-center gap-1 rounded font-semibold text-white ${
            isHighRating ? 'bg-emerald-600' : numericRating >= 3.0 ? 'bg-amber-500' : 'bg-red-500'
          } ${badgeSizeClasses[size] || badgeSizeClasses.sm}`}
        >
          <span>{numericRating.toFixed(1)}</span>
          <Star className={`${starSizeClasses[size] || starSizeClasses.sm} fill-current`} />
        </span>
      ) : (
        <div className="flex items-center text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`${starSizeClasses[size] || starSizeClasses.sm} ${
                star <= Math.round(numericRating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {numReviews !== undefined && (
        <span className="text-gray-500 text-xs">
          ({Number(numReviews).toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
