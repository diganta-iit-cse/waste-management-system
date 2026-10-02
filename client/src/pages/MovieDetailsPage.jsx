import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovieById } from '../features/movies/movieSlice';
import { openTrailer, addToast } from '../features/ui/uiSlice';
import api from '../api/axiosInstance';
import {
  Star,
  Play,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ChevronRight,
  Shield,
  MessageSquare,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentMovie, currentLoading } = useSelector((state) => state.movies);
  const { selectedCity } = useSelector((state) => state.city);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Date selection tabs: Today, Tomorrow, +3 upcoming days
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [shows, setShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(false);

  // Review state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Generate 5 calendar dates
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      list.push({ iso, dayName, dayDate });
    }
    setDates(list);
    setSelectedDate(list[0].iso);
  }, []);

  // Fetch movie by ID
  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieById(movieId));
    }
  }, [movieId, dispatch]);

  // Fetch shows whenever date or city changes
  useEffect(() => {
    if (movieId && selectedDate) {
      const loadShows = async () => {
        try {
          setShowsLoading(true);
          const res = await api.get('/shows', {
            params: {
              movie: movieId,
              city: selectedCity,
              date: selectedDate,
            },
          });
          setShows(res.data.data || []);
        } catch (err) {
          console.error('Error fetching shows:', err);
        } finally {
          setShowsLoading(false);
        }
      };
      loadShows();
    }
  }, [movieId, selectedDate, selectedCity]);

  // Group shows by Theatre
  const theatreMap = new Map();
  shows.forEach((show) => {
    const tId = show.theatre._id;
    if (!theatreMap.has(tId)) {
      theatreMap.set(tId, {
        theatre: show.theatre,
        shows: [],
      });
    }
    theatreMap.get(tId).shows.push(show);
  });
  const groupedTheatres = Array.from(theatreMap.values());

  const handleWatchTrailer = () => {
    if (currentMovie?.trailerUrl) {
      dispatch(openTrailer({ trailerUrl: currentMovie.trailerUrl, title: currentMovie.title }));
    }
  };

  const handleSelectShow = (showId) => {
    navigate(`/booking/${showId}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      await api.post(`/movies/${movieId}/reviews`, {
        rating: newRating,
        comment: newComment,
      });
      dispatch(addToast({ type: 'success', message: 'Review submitted successfully!' }));
      setNewComment('');
      dispatch(fetchMovieById(movieId));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (currentLoading || !currentMovie) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Movie Hero Backdrop Section */}
      <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[500px] overflow-hidden bg-cinema-950">
        <img
          src={currentMovie.backdropUrl || currentMovie.posterUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-top filter blur-sm scale-105 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-950 via-cinema-950/60 to-transparent"></div>

        {/* Content Container */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end w-full">
            {/* Poster Card */}
            <div className="w-36 sm:w-52 lg:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 flex-shrink-0 bg-cinema-850">
              <img
                src={currentMovie.posterUrl}
                alt={currentMovie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-brand text-white text-xs font-bold uppercase tracking-wider">
                  {currentMovie.certification || 'U/A'}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{currentMovie.rating ? currentMovie.rating.toFixed(1) : '4.8'} / 5</span>
                  <span className="text-gray-400 font-normal">
                    ({currentMovie.ratingCount || 120} votes)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-300 text-xs bg-white/10 px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{Math.floor(currentMovie.duration / 60)}h {currentMovie.duration % 60}m</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {currentMovie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                <span>{currentMovie.genres?.join(', ')}</span>
                <span>•</span>
                <span>{currentMovie.languages?.join(', ')}</span>
                <span>•</span>
                <span className="text-brand font-semibold">{currentMovie.formats?.join(', ')}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#showtimes"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-brand hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-brand/30 hover:scale-105 transition-all duration-200"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Tickets</span>
                </a>

                {currentMovie.trailerUrl && (
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
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: About Movie, Cast, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* About */}
          <section className="bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-3">About the Movie</h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {currentMovie.description}
            </p>
            {currentMovie.director && (
              <p className="text-xs text-gray-400 mt-4">
                Director: <strong className="text-white">{currentMovie.director}</strong>
              </p>
            )}
          </section>

          {/* Cast */}
          {currentMovie.cast && currentMovie.cast.length > 0 && (
            <section className="bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Top Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentMovie.cast.map((actor, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-2 rounded-xl bg-cinema-850 border border-white/5">
                    <img
                      src={actor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={actor.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{actor.role || 'Actor'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Showtimes Section */}
          <section id="showtimes" className="bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-brand" />
                  <span>Available Shows</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Showing in <span className="text-white font-semibold">{selectedCity}</span>
                </p>
              </div>

              {/* Date Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {dates.map((d) => {
                  const active = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-2xl border text-xs font-bold transition-all ${
                        active
                          ? 'bg-brand border-brand text-white shadow-lg shadow-brand/25 scale-105'
                          : 'bg-cinema-850 border-white/5 text-gray-400 hover:text-white hover:bg-cinema-800'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold">{d.dayName}</span>
                      <span className="text-sm mt-0.5">{d.dayDate}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theatres & Showtimes Listing */}
            {showsLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : groupedTheatres.length > 0 ? (
              <div className="space-y-6">
                {groupedTheatres.map(({ theatre, shows: tShows }) => (
                  <div
                    key={theatre._id}
                    className="p-5 rounded-2xl bg-cinema-850 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand" />
                          <span>{theatre.name}</span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {theatre.address} • <span className="text-emerald-400">{theatre.distanceKm || 3} km away</span>
                        </p>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {theatre.facilities?.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Showtimes Buttons */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {tShows.map((s) => (
                        <button
                          key={s._id}
                          onClick={() => handleSelectShow(s._id)}
                          className="group flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-cinema-800 hover:bg-brand border border-white/10 hover:border-brand text-gray-200 hover:text-white transition-all duration-200 shadow-sm"
                        >
                          <span className="text-sm font-black">{s.startTime}</span>
                          <span className="text-[10px] text-gray-400 group-hover:text-white uppercase font-bold mt-0.5">
                            {s.format} • {s.language}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <Info className="w-8 h-8 mx-auto text-gray-500" />
                <p className="text-sm font-semibold text-white">No Shows Scheduled for {selectedDate}</p>
                <p className="text-xs">Try selecting another date or check back later.</p>
              </div>
            )}
          </section>

          {/* User Reviews Section */}
          <section className="bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand" />
              <span>Audience Reviews & Ratings</span>
            </h2>

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-cinema-850 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Rate this movie:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about the movie..."
                rows={3}
                required
                className="w-full bg-cinema-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {currentMovie.reviews && currentMovie.reviews.length > 0 ? (
                currentMovie.reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-xl bg-cinema-850/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-xs">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-bold text-white">{rev.user?.name || 'Verified Moviegoer'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </section>
        </div>

        {/* Right: Quick Cinema Highlights & Booking Info */}
        <div className="space-y-6">
          <div className="bg-cinema-900 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 sticky top-24">
            <h3 className="text-base font-bold text-white">Cinema Experience</h3>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>Selected formats support Dolby Atmos surround audio and 4K Laser.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Ticket className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Instant QR-code M-ticket delivery directly on your mobile device.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Seats are locked exclusively for 5 minutes during seat selection.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/10">
              <a
                href="#showtimes"
                className="w-full py-3 rounded-xl bg-brand hover:bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand/25 transition-all block text-center"
              >
                <span>Select Showtime</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetailsPage;
