import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, resetFilters } from '../../features/movies/movieSlice';
import { Filter, RotateCcw } from 'lucide-react';

const LANGUAGES = ['Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam'];
const GENRES = ['Action', 'Sci-Fi', 'Adventure', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Mythology'];
const FORMATS = ['2D', '3D', 'IMAX 3D', '4DX'];

const FilterPanel = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.movies.filters);

  const handleLanguageChange = (lang) => {
    dispatch(setFilter({ language: filters.language === lang ? '' : lang }));
  };

  const handleGenreChange = (genre) => {
    dispatch(setFilter({ genre: filters.genre === genre ? '' : genre }));
  };

  const handleFormatChange = (fmt) => {
    dispatch(setFilter({ format: filters.format === fmt ? '' : fmt }));
  };

  return (
    <div className="bg-cinema-900 border border-white/10 rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2 text-white font-bold text-base">
          <Filter className="w-4 h-4 text-brand" />
          <span>Filters</span>
        </div>
        <button
          onClick={() => dispatch(resetFilters())}
          className="flex items-center space-x-1 text-xs text-gray-400 hover:text-brand transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Languages */}
      <div>
        <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2.5">
          Languages
        </h4>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const active = filters.language === lang;
            return (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  active
                    ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                    : 'bg-cinema-850 text-gray-300 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Genres */}
      <div>
        <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2.5">
          Genres
        </h4>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const active = filters.genre === genre;
            return (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  active
                    ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                    : 'bg-cinema-850 text-gray-300 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div>
        <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2.5">
          Format
        </h4>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((fmt) => {
            const active = filters.format === fmt;
            return (
              <button
                key={fmt}
                onClick={() => handleFormatChange(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  active
                    ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                    : 'bg-cinema-850 text-gray-300 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2.5">
          Minimum Rating
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {['', '4.0', '4.5'].map((r) => {
            const active = filters.minRating === r;
            return (
              <button
                key={r || 'all'}
                onClick={() => dispatch(setFilter({ minRating: r }))}
                className={`py-1.5 text-center rounded-lg text-xs font-medium border transition-all ${
                  active
                    ? 'bg-brand text-white border-brand'
                    : 'bg-cinema-850 text-gray-300 border-white/5 hover:border-white/20'
                }`}
              >
                {r ? `★ ${r}+` : 'All'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2.5">
          Sort By
        </h4>
        <select
          value={filters.sort || 'popularity'}
          onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
          className="w-full bg-cinema-850 text-gray-200 text-xs rounded-xl p-2.5 border border-white/10 focus:outline-none focus:border-brand"
        >
          <option value="popularity">Popularity (Most Booked)</option>
          <option value="rating">Highest Rated</option>
          <option value="releaseDate_desc">Release Date (Newest First)</option>
          <option value="releaseDate_asc">Release Date (Oldest First)</option>
          <option value="title_asc">Title (A - Z)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
