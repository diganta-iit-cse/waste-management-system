import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { addToast } from '../../features/ui/uiSlice';
import { useDispatch } from 'react-redux';
import api from '../../api/axiosInstance';
import {
  Film,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Star,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';

const AdminMoviesPage = () => {
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    genres: 'Action, Sci-Fi',
    languages: 'Hindi, English',
    duration: 150,
    releaseDate: '2026-10-01',
    certification: 'U/A',
    director: '',
    status: 'now_showing',
    formats: '2D, 3D, IMAX 3D',
  });

  const loadMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/movies', {
        params: { search: searchTerm, status: statusFilter, limit: 100 },
      });
      setMovies(res.data.data || []);
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [searchTerm, statusFilter]);

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      description: '',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
      genres: 'Action, Sci-Fi',
      languages: 'Hindi, English',
      duration: 145,
      releaseDate: '2026-10-15',
      certification: 'U/A',
      director: '',
      status: 'now_showing',
      formats: '2D, 3D, IMAX 3D',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl || '',
      trailerUrl: movie.trailerUrl || '',
      genres: movie.genres?.join(', ') || '',
      languages: movie.languages?.join(', ') || '',
      duration: movie.duration || 140,
      releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : '2026-10-01',
      certification: movie.certification || 'U/A',
      director: movie.director || '',
      status: movie.status || 'now_showing',
      formats: movie.formats?.join(', ') || '2D',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete movie "${title}"?`)) return;

    try {
      await api.delete(`/movies/${id}`);
      dispatch(addToast({ type: 'success', message: 'Movie deleted successfully' }));
      loadMovies();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        genres: formData.genres.split(',').map((s) => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
        formats: formData.formats.split(',').map((s) => s.trim()).filter(Boolean),
        duration: Number(formData.duration),
      };

      if (editingMovie) {
        await api.put(`/movies/${editingMovie._id}`, payload);
        dispatch(addToast({ type: 'success', message: 'Movie updated successfully' }));
      } else {
        await api.post('/movies', payload);
        dispatch(addToast({ type: 'success', message: 'Movie created successfully' }));
      }

      setIsModalOpen(false);
      loadMovies();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cinema-950">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-6">
        {/* Header & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Film className="w-7 h-7 text-purple-400" />
              <span>Movie Title Catalog</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Add, modify, and monitor movie metadata, posters, certifications, and exhibition statuses
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Movie</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, director, language..."
              className="w-full bg-cinema-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-cinema-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">All Statuses</option>
            <option value="now_showing">Now Showing</option>
            <option value="coming_soon">Coming Soon</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Movies Table */}
        <div className="bg-cinema-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-850 text-gray-400 uppercase border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Movie</th>
                  <th className="py-3.5 px-4">Languages</th>
                  <th className="py-3.5 px-4">Genres</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      Loading movies catalog...
                    </td>
                  </tr>
                ) : movies.length > 0 ? (
                  movies.map((m) => (
                    <tr key={m._id} className="hover:bg-cinema-850/50 transition-colors">
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{m.title}</p>
                          <span className="text-[10px] text-gray-400">{m.certification || 'U/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{m.languages?.join(', ')}</td>
                      <td className="py-3 px-4">{m.genres?.join(', ')}</td>
                      <td className="py-3 px-4">{m.duration} mins</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.status === 'now_showing'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : m.status === 'coming_soon'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {m.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-amber-400 font-bold">
                        ★ {m.rating || 4.5}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-gray-300 hover:text-white transition-colors"
                          title="Edit Movie"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id, m.title)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
                          title="Delete Movie"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No movies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Movie Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">
                  {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Theatrical Movie'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Movie Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Director
                    </label>
                    <input
                      type="text"
                      value={formData.director}
                      onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Synopsis / Description *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full bg-cinema-850 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Poster Image URL *
                    </label>
                    <input
                      type="url"
                      value={formData.posterUrl}
                      onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                      required
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Backdrop Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.backdropUrl}
                      onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Trailer URL (YouTube Embed)
                    </label>
                    <input
                      type="text"
                      value={formData.trailerUrl}
                      onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Exhibition Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="now_showing">Now Showing</option>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Genres (comma-sep)
                    </label>
                    <input
                      type="text"
                      value={formData.genres}
                      onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Languages (comma-sep)
                    </label>
                    <input
                      type="text"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Formats (comma-sep)
                    </label>
                    <input
                      type="text"
                      value={formData.formats}
                      onChange={(e) => setFormData({ ...formData, formats: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Certification
                    </label>
                    <select
                      value={formData.certification}
                      onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="U">U (Universal)</option>
                      <option value="U/A">U/A (Parental Guidance)</option>
                      <option value="A">A (Adults Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Release Date
                    </label>
                    <input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-colors"
                  >
                    {saving ? 'Saving...' : editingMovie ? 'Update Movie' : 'Save New Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMoviesPage;
