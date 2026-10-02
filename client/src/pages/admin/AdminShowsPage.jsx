import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { addToast } from '../../features/ui/uiSlice';
import { useDispatch } from 'react-redux';
import api from '../../api/axiosInstance';
import {
  CalendarDays,
  Plus,
  Trash2,
  X,
  Clock,
  MapPin,
  Film,
  Users,
  Search,
} from 'lucide-react';

const AdminShowsPage = () => {
  const dispatch = useDispatch();
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedTheatre, setSelectedTheatre] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('');
  const [showDate, setShowDate] = useState('2026-10-01');
  const [startTime, setStartTime] = useState('07:30 PM');
  const [endTime, setEndTime] = useState('10:30 PM');
  const [format, setFormat] = useState('2D');
  const [language, setLanguage] = useState('Hindi');
  const [priceVip, setPriceVip] = useState(350);
  const [pricePremium, setPricePremium] = useState(260);
  const [priceExecutive, setPriceExecutive] = useState(200);
  const [priceNormal, setPriceNormal] = useState(160);

  const loadData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        api.get('/shows'),
        api.get('/movies?limit=100'),
        api.get('/theatres'),
      ]);
      setShows(showsRes.data.data || []);
      setMovies(moviesRes.data.data || []);
      setTheatres(theatresRes.data.data || []);

      if (moviesRes.data.data?.length > 0) setSelectedMovie(moviesRes.data.data[0]._id);
      if (theatresRes.data.data?.length > 0) {
        setSelectedTheatre(theatresRes.data.data[0]._id);
        // Load screens for default theatre
        loadScreens(theatresRes.data.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load shows data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadScreens = async (theatreId) => {
    try {
      const res = await api.get(`/screens/theatre/${theatreId}`);
      const scList = res.data.data || [];
      setScreens(scList);
      if (scList.length > 0) setSelectedScreen(scList[0]._id);
    } catch (err) {
      console.error('Error loading screens:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTheatreChange = (tId) => {
    setSelectedTheatre(tId);
    loadScreens(tId);
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movie: selectedMovie,
        theatre: selectedTheatre,
        screen: selectedScreen,
        date: showDate,
        startTime,
        endTime,
        format,
        language,
        pricing: {
          VIP: Number(priceVip),
          Premium: Number(pricePremium),
          Executive: Number(priceExecutive),
          Normal: Number(priceNormal),
        },
      };

      await api.post('/shows', payload);
      dispatch(addToast({ type: 'success', message: 'Show scheduled successfully!' }));
      setIsModalOpen(false);

      // Refresh shows
      const res = await api.get('/shows');
      setShows(res.data.data || []);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and remove this show schedule?')) return;
    try {
      await api.delete(`/shows/${id}`);
      dispatch(addToast({ type: 'success', message: 'Show cancelled and deleted' }));
      const res = await api.get('/shows');
      setShows(res.data.data || []);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    }
  };

  return (
    <div className="flex min-h-screen bg-cinema-950">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <CalendarDays className="w-7 h-7 text-purple-400" />
              <span>Show Scheduling & Timetable</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Program theatrical screening slots, seat price tiers, and inspect live booked capacity
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Show</span>
          </button>
        </div>

        {/* Shows Table */}
        <div className="bg-cinema-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-850 text-gray-400 uppercase border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Movie</th>
                  <th className="py-3.5 px-4">Multiplex & Auditorium</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Slot</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4">Booked / Total</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      Loading show schedules...
                    </td>
                  </tr>
                ) : shows.length > 0 ? (
                  shows.map((s) => {
                    const bookedCount = s.bookedSeats?.length || 0;
                    const totalCap = s.screen?.totalCapacity || 106;
                    const occupancy = Math.round((bookedCount / totalCap) * 100);

                    return (
                      <tr key={s._id} className="hover:bg-cinema-850/50 transition-colors">
                        <td className="py-3 px-4 flex items-center space-x-2.5">
                          <img
                            src={s.movie?.posterUrl}
                            alt=""
                            className="w-8 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <span className="font-bold text-white text-sm">{s.movie?.title}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{s.theatre?.name}</p>
                          <p className="text-[11px] text-gray-400">{s.screen?.name}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">{s.date}</td>
                        <td className="py-3 px-4 text-amber-400 font-bold">{s.startTime}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-white/5 font-bold uppercase text-[10px]">
                            {s.format}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {bookedCount}/{totalCap}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              ({occupancy}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteShow(s._id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
                            title="Cancel / Delete Show"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No shows scheduled
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Show Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-xl bg-cinema-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-purple-400" />
                  <span>Program Screening Showtime</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateShow} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Select Movie *
                  </label>
                  <select
                    value={selectedMovie}
                    onChange={(e) => setSelectedMovie(e.target.value)}
                    required
                    className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {movies.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title} ({m.certification || 'U/A'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Multiplex *
                    </label>
                    <select
                      value={selectedTheatre}
                      onChange={(e) => handleTheatreChange(e.target.value)}
                      required
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      {theatres.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name} ({t.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Auditorium / Screen *
                    </label>
                    <select
                      value={selectedScreen}
                      onChange={(e) => setSelectedScreen(e.target.value)}
                      required
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      {screens.map((sc) => (
                        <option key={sc._id} value={sc._id}>
                          {sc.name} ({sc.screenType})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={showDate}
                      onChange={(e) => setShowDate(e.target.value)}
                      required
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Start Time *
                    </label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="e.g. 07:30 PM"
                      required
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="e.g. 10:30 PM"
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="2D">2D</option>
                      <option value="3D">3D</option>
                      <option value="IMAX 3D">IMAX 3D</option>
                      <option value="4DX">4DX</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Audio Language
                    </label>
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      placeholder="Hindi"
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Price Tiers */}
                <div className="p-3 bg-cinema-850 rounded-2xl space-y-2 border border-white/5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Seat Price Tiers (₹)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-amber-300 block mb-0.5">VIP</label>
                      <input
                        type="number"
                        value={priceVip}
                        onChange={(e) => setPriceVip(e.target.value)}
                        className="w-full bg-cinema-900 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-rose-300 block mb-0.5">Premium</label>
                      <input
                        type="number"
                        value={pricePremium}
                        onChange={(e) => setPricePremium(e.target.value)}
                        className="w-full bg-cinema-900 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-blue-300 block mb-0.5">Executive</label>
                      <input
                        type="number"
                        value={priceExecutive}
                        onChange={(e) => setPriceExecutive(e.target.value)}
                        className="w-full bg-cinema-900 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-300 block mb-0.5">Normal</label>
                      <input
                        type="number"
                        value={priceNormal}
                        onChange={(e) => setPriceNormal(e.target.value)}
                        className="w-full bg-cinema-900 border border-white/10 rounded-lg p-1.5 text-xs text-white text-center font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-colors"
                  >
                    Program Show
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

export default AdminShowsPage;
