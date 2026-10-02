import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openTrailer } from '../../features/ui/uiSlice';
import { Star, Play, Ticket, ChevronLeft, ChevronRight, Clock, Award } from 'lucide-react';

const HeroBanner = ({ movies = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = movies.length > 0 ? movies.slice(0, 5) : [];

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[currentIndex];

  const handleWatchTrailer = () => {
    if (current.trailerUrl) {
      dispatch(openTrailer({ trailerUrl: current.trailerUrl, title: current.title }));
    }
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-white/5 my-4 sm:my-6">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={current.backdropUrl || current.posterUrl}
          alt={current.title}
          className="w-full h-full object-cover object-top transition-all duration-700 transform scale-100"
        />
        {/* Cinematic Vignette and Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16 max-w-3xl">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="px-2.5 py-1 rounded-md bg-brand text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/30">
            Featured Premiere
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-xs font-semibold text-gray-200">
            {current.certification || 'U/A'}
          </span>
          <div className="flex items-center gap-1 text-amber-400 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{current.rating ? current.rating.toFixed(1) : '4.8'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-gray-300 text-xs">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{Math.floor(current.duration / 60)}h {current.duration % 60}m</span>
          </div>
          <span className="text-xs text-gray-400">
            • {current.formats?.join(', ')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
          {current.title}
        </h1>

        {/* Genre & Languages */}
        <p className="text-sm sm:text-base text-gray-300 font-medium mt-3 flex items-center gap-2">
          <span>{current.genres?.join(' • ')}</span>
          <span>|</span>
          <span className="text-brand font-semibold">{current.languages?.join(', ')}</span>
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-400 mt-3 line-clamp-2 max-w-2xl leading-relaxed">
          {current.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <button
            onClick={() => navigate(`/movies/${current._id}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-brand hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-brand/30 hover:scale-105 transition-all duration-200"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Tickets</span>
          </button>

          {current.trailerUrl && (
            <button
              onClick={handleWatchTrailer}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition-all duration-200"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Trailer</span>
            </button>
          )}
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2">
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1))
          }
          className="p-2.5 rounded-full bg-black/50 hover:bg-brand text-white border border-white/10 backdrop-blur-md transition-colors"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="flex items-center space-x-1.5 px-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'w-6 bg-brand' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % featured.length)}
          className="p-2.5 rounded-full bg-black/50 hover:bg-brand text-white border border-white/10 backdrop-blur-md transition-colors"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
