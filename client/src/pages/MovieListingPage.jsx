import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies, setFilter, resetFilters } from '../features/movies/movieSlice';
import FilterPanel from '../components/movies/FilterPanel';
import MovieCard from '../components/movies/MovieCard';
import { Film, Search, X, SlidersHorizontal } from 'lucide-react';

const MovieListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { movies, total, loading, filters } = useSelector((state) => state.movies);

  // Sync query params from URL (e.g. /movies?status=coming_soon)
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const genreParam = searchParams.get('genre');
    const formatParam = searchParams.get('format');
    const searchParam = searchParams.get('search');

    const initialFilters = {};
    if (statusParam) initialFilters.status = statusParam;
    if (genreParam) initialFilters.genre = genreParam;
    if (formatParam) initialFilters.format = formatParam;
    if (searchParam) initialFilters.search = searchParam;

    if (Object.keys(initialFilters).length > 0) {
      dispatch(setFilter(initialFilters));
    }
  }, [searchParams, dispatch]);

  // Fetch whenever filters change
  useEffect(() => {
    dispatch(fetchMovies(filters));
  }, [filters, dispatch]);

  const handleStatusTab = (statusVal) => {
    dispatch(setFilter({ status: statusVal }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Film className="w-7 h-7 text-brand" />
            <span>Explore Movies</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Discover the latest theatrical releases and book tickets in advance
          </p>
        </div>

        {/* Status Switcher Tabs */}
        <div className="flex items-center gap-2 bg-cinema-900 border border-white/10 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => handleStatusTab('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !filters.status
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Movies
          </button>
          <button
            onClick={() => handleStatusTab('now_showing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filters.status === 'now_showing'
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => handleStatusTab('coming_soon')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filters.status === 'coming_soon'
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Panel */}
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>

        {/* Right Movie Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filters Display */}
          {(filters.language || filters.genre || filters.format || filters.search) && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-cinema-900 border border-white/5 rounded-2xl">
              <span className="text-xs text-gray-400 font-semibold mr-1">Active Filters:</span>
              {filters.language && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand/15 border border-brand/30 text-white text-xs font-medium">
                  {filters.language}
                  <button onClick={() => dispatch(setFilter({ language: '' }))}>
                    <X className="w-3 h-3 text-gray-400 hover:text-white" />
                  </button>
                </span>
              )}
              {filters.genre && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand/15 border border-brand/30 text-white text-xs font-medium">
                  {filters.genre}
                  <button onClick={() => dispatch(setFilter({ genre: '' }))}>
                    <X className="w-3 h-3 text-gray-400 hover:text-white" />
                  </button>
                </span>
              )}
              {filters.format && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand/15 border border-brand/30 text-white text-xs font-medium">
                  {filters.format}
                  <button onClick={() => dispatch(setFilter({ format: '' }))}>
                    <X className="w-3 h-3 text-gray-400 hover:text-white" />
                  </button>
                </span>
              )}
              {filters.search && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand/15 border border-brand/30 text-white text-xs font-medium">
                  "{filters.search}"
                  <button onClick={() => dispatch(setFilter({ search: '' }))}>
                    <X className="w-3 h-3 text-gray-400 hover:text-white" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Movies Results */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-cinema-900 rounded-2xl aspect-[2/3] animate-pulse"></div>
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="bg-cinema-900 border border-white/10 rounded-3xl p-12 text-center space-y-4">
              <Film className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-xl font-bold text-white">No Movies Found</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                We couldn't find any movies matching your current filters. Try changing or resetting your filters.
              </p>
              <button
                onClick={() => dispatch(resetFilters())}
                className="px-6 py-2.5 rounded-xl bg-brand hover:bg-rose-600 text-white font-semibold text-sm transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieListingPage;
