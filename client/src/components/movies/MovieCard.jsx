import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Play, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openTrailer } from '../../features/ui/uiSlice';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleWatchTrailer = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (movie.trailerUrl) {
      dispatch(openTrailer({ trailerUrl: movie.trailerUrl, title: movie.title }));
    }
  };

  return (
    <div
      onClick={() => navigate(`/movies/${movie._id}`)}
      className="group relative flex flex-col bg-cinema-900 border border-white/5 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 card-hover-glow cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-850">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity"></div>

        {/* Certification Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-gray-200">
          {movie.certification || 'U/A'}
        </div>

        {/* Formats Badges */}
        {movie.formats && movie.formats.length > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-md bg-brand/90 backdrop-blur-md text-[10px] font-extrabold text-white uppercase tracking-wider shadow">
              {movie.formats[0]}
            </span>
          </div>
        )}

        {/* Quick Trailer Play Button on Hover */}
        {movie.trailerUrl && (
          <button
            onClick={handleWatchTrailer}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 hover:bg-brand text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 z-10 shadow-xl"
            title="Watch Trailer"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        )}

        {/* Rating Ribbon */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating ? movie.rating.toFixed(1) : '4.5'}</span>
            <span className="text-[10px] text-gray-400 font-normal">
              ({(movie.ratingCount || 100) > 999 ? `${((movie.ratingCount || 100) / 1000).toFixed(1)}k` : movie.ratingCount || 100})
            </span>
          </div>

          {movie.status === 'coming_soon' && (
            <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
              Soon
            </span>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-brand transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            {movie.genres?.join(', ')}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">
            {movie.languages?.[0] || 'Hindi'}
          </span>
          <span className="text-xs font-semibold text-brand group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            {movie.status === 'coming_soon' ? 'Explore' : 'Book Now'} →
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
