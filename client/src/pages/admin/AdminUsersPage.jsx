import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { addToast } from '../../features/ui/uiSlice';
import { useDispatch } from 'react-redux';
import api from '../../api/axiosInstance';
import { Users, Search, ShieldCheck, Power, Ticket } from 'lucide-react';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users', { params: { search } });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleToggleStatus = async (user) => {
    if (user.role === 'admin') {
      alert('Administrator accounts cannot be deactivated.');
      return;
    }

    try {
      setTogglingId(user._id);
      const res = await api.put(`/users/${user._id}/status`);
      dispatch(addToast({ type: 'success', message: res.data.message }));
      loadUsers();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message }));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-cinema-950">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Users className="w-7 h-7 text-purple-400" />
              <span>User Accounts & Membership</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Audit registered customers, ticket consumption, and manage account authorization
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full bg-cinema-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Users Table */}
        <div className="bg-cinema-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cinema-850 text-gray-400 uppercase border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4">Total Bookings</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-cinema-850/50 transition-colors">
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{u.name}</p>
                          <p className="text-[10px] text-gray-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-white/5 text-gray-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {u.createdAt ? u.createdAt.slice(0, 10) : 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        <span className="flex items-center gap-1">
                          <Ticket className="w-3.5 h-3.5 text-brand" />
                          <span>{u.bookingsCount || 0}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.isActive
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={togglingId === u._id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                              u.isActive
                                ? 'bg-rose-950/30 border-rose-500/30 text-rose-300 hover:bg-rose-950/60'
                                : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60'
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              <Power className="w-3 h-3" />
                              <span>{u.isActive ? 'Deactivate' : 'Activate'}</span>
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage;
