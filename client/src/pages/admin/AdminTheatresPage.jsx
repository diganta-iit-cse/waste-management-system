import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { addToast } from '../../features/ui/uiSlice';
import { useDispatch } from 'react-redux';
import api from '../../api/axiosInstance';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  MapPin,
  Tv,
  Check,
  ChevronRight,
} from 'lucide-react';

const AdminTheatresPage = () => {
  const dispatch = useDispatch();
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Theatre Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: 'Mumbai',
    address: '',
    facilities: 'Dolby Atmos, Parking, Food Court, M-Ticket',
    screensCount: 3,
  });

  // Screen View / Add Modal
  const [activeTheatreForScreens, setActiveTheatreForScreens] = useState(null);
  const [screensList, setScreensList] = useState([]);
  const [isAddScreenOpen, setIsAddScreenOpen] = useState(false);
  const [newScreenName, setNewScreenName] = useState('Audi 4 - IMAX Laser');
  const [newScreenType, setNewScreenType] = useState('IMAX 3D');
  const [newScreenRows, setNewScreenRows] = useState(8);
  const [newScreenSeatsPerRow, setNewScreenSeatsPerRow] = useState(12);

  const loadTheatres = async () => {
    try {
      setLoading(true);
      const res = await api.get('/theatres', { params: { search } });
      setTheatres(res.data.data || []);
    } catch (err) {
      console.error('Failed to load theatres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheatres();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingTheatre(null);
    setFormData({
      name: '',
      city: 'Mumbai',
      address: '',
      facilities: 'Dolby Atmos, Parking, Food Court, M-Ticket',
      screensCount: 3,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTheatre(t);
    setFormData({
      name: t.name,
      city: t.city,
      address: t.address,
      facilities: t.facilities?.join(', ') || '',
      screensCount: t.screensCount || 3,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/theatres/${id}`);
      dispatch(addToast({ type: 'success', message: 'Theatre deleted successfully' }));
      loadTheatres();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    }
  };

  const handleSubmitTheatre = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        facilities: formData.facilities.split(',').map((s) => s.trim()).filter(Boolean),
        screensCount: Number(formData.screensCount),
      };

      if (editingTheatre) {
        await api.put(`/theatres/${editingTheatre._id}`, payload);
        dispatch(addToast({ type: 'success', message: 'Theatre updated successfully' }));
      } else {
        await api.post('/theatres', payload);
        dispatch(addToast({ type: 'success', message: 'Theatre created successfully' }));
      }

      setIsModalOpen(false);
      loadTheatres();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    }
  };

  // Open screens inspector
  const handleInspectScreens = async (theatre) => {
    setActiveTheatreForScreens(theatre);
    try {
      const res = await api.get(`/screens/theatre/${theatre._id}`);
      setScreensList(res.data.data || []);
    } catch (err) {
      console.error('Failed to load screens:', err);
    }
  };

  const handleCreateScreen = async (e) => {
    e.preventDefault();
    if (!activeTheatreForScreens) return;

    try {
      await api.post('/screens', {
        theatre: activeTheatreForScreens._id,
        name: newScreenName,
        screenType: newScreenType,
        totalRows: Number(newScreenRows),
        seatsPerRow: Number(newScreenSeatsPerRow),
      });

      dispatch(addToast({ type: 'success', message: 'Screen added successfully' }));
      setIsAddScreenOpen(false);
      // Refresh screens
      const res = await api.get(`/screens/theatre/${activeTheatreForScreens._id}`);
      setScreensList(res.data.data || []);
      loadTheatres();
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
              <Building2 className="w-7 h-7 text-purple-400" />
              <span>Cinema Theatres & Screens</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Configure cinema properties, auditorium layouts, projection technologies, and seat tier configurations
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Multiplex</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search multiplex name or location..."
            className="w-full bg-cinema-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Theatres Table */}
        <div className="bg-cinema-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-850 text-gray-400 uppercase border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Theatre Name</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Screens</th>
                  <th className="py-3.5 px-4">Facilities</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Loading multiplexes...
                    </td>
                  </tr>
                ) : theatres.length > 0 ? (
                  theatres.map((t) => (
                    <tr key={t._id} className="hover:bg-cinema-850/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white text-sm">
                        {t.name}
                      </td>
                      <td className="py-3 px-4 text-brand font-semibold">{t.city}</td>
                      <td className="py-3 px-4 text-gray-400 max-w-xs truncate">{t.address}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleInspectScreens(t)}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                        >
                          <Tv className="w-3 h-3" />
                          <span>{t.screensCount || 3} Screens</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {t.facilities?.slice(0, 2).map((f, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-white/5 text-[10px]"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-gray-300 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id, t.name)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No theatres found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Theatre Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg bg-cinema-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingTheatre ? 'Edit Multiplex' : 'Register New Multiplex'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitTheatre} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Multiplex / Cinema Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. CineBook IMAX Forum"
                    className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      placeholder="e.g. Mumbai"
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Number of Screens
                    </label>
                    <input
                      type="number"
                      value={formData.screensCount}
                      onChange={(e) => setFormData({ ...formData, screensCount: e.target.value })}
                      className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Full Mall / Street Address *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="e.g. High Street Phoenix, Lower Parel"
                    className="w-full bg-cinema-850 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Facilities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.facilities}
                    onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                    placeholder="Dolby Atmos, Parking, Recliner Lounges, Food Court"
                    className="w-full bg-cinema-850 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
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
                    Save Multiplex
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Screens Inspector Modal */}
        {activeTheatreForScreens && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-cinema-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-purple-400" />
                    <span>Auditoriums for {activeTheatreForScreens.name}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Manage individual screens, projection specs, and row capacities
                  </p>
                </div>
                <button
                  onClick={() => setActiveTheatreForScreens(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Screens List */}
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {screensList.map((screen) => (
                  <div
                    key={screen._id}
                    className="p-4 rounded-2xl bg-cinema-850 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm">{screen.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Format: <span className="text-purple-300 font-semibold">{screen.screenType}</span> • Rows: {screen.totalRows} • Seats/Row: {screen.seatsPerRow} • Total: {screen.totalCapacity} seats
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                      Active
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Screen Trigger */}
              {!isAddScreenOpen ? (
                <button
                  onClick={() => setIsAddScreenOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-purple-500/40 text-purple-300 hover:bg-purple-950/20 text-xs font-bold transition-colors"
                >
                  + Add Screen to this Multiplex
                </button>
              ) : (
                <form onSubmit={handleCreateScreen} className="p-4 rounded-2xl bg-cinema-850 border border-purple-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase">New Screen Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newScreenName}
                      onChange={(e) => setNewScreenName(e.target.value)}
                      placeholder="Screen Name (e.g. Audi 4 IMAX)"
                      required
                      className="bg-cinema-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <select
                      value={newScreenType}
                      onChange={(e) => setNewScreenType(e.target.value)}
                      className="bg-cinema-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="IMAX 3D">IMAX 3D</option>
                      <option value="Dolby Atmos">Dolby Atmos</option>
                      <option value="4DX">4DX</option>
                      <option value="Standard 2D">Standard 2D</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Total Rows (A-H)</label>
                      <input
                        type="number"
                        value={newScreenRows}
                        onChange={(e) => setNewScreenRows(e.target.value)}
                        className="w-full bg-cinema-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Seats Per Row</label>
                      <input
                        type="number"
                        value={newScreenSeatsPerRow}
                        onChange={(e) => setNewScreenSeatsPerRow(e.target.value)}
                        className="w-full bg-cinema-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddScreenOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Create Screen
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTheatresPage;
