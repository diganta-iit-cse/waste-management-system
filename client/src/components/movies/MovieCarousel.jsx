import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieCarousel = ({ title, subtitle, movies = [], viewAllLink }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-2">
          {viewAllLink && (
            <a
              href={viewAllLink}
              className="text-xs sm:text-sm font-semibold text-brand hover:underline mr-2"
            >
              See All →
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-300 hover:text-white border border-white/5 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-300 hover:text-white border border-white/5 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div key={movie._id} className="min-w-[210px] sm:min-w-[240px] max-w-[240px] flex-shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieCarousel;
