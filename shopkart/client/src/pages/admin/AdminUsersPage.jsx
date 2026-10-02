import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const AdminUsersPage = () => {
  const { user: currentAdmin } = useAuth();
  const { success, error, warning } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10
      };
      if (search) params.search = search;

      const res = await adminAPI.getAllUsers(params);
      if (res.data.success) {
        setUsers(res.data.users || []);
        setTotalPages(res.data.pages || 1);
        setTotalUsers(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleRoleToggle = async (userId, currentRole) => {
    if (userId === currentAdmin?._id) {
      warning('You cannot change your own administrator role.');
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await adminAPI.updateUserRole(userId, newRole);
      if (res.data.success) {
        success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user role.';
      error(msg);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    if (userId === currentAdmin?._id) {
      warning('You cannot deactivate your own administrator account.');
      return;
    }

    try {
      const res = await adminAPI.toggleUserStatus(userId, !currentStatus);
      if (res.data.success) {
        success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user status.';
      error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        <p className="text-xs text-gray-500">Manage registered user accounts, roles, and access credentials</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
        </form>

        <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
          Total Registered Users: <strong className="text-gray-900">{totalUsers}</strong>
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading user directory..." size="lg" />
        ) : users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-400 uppercase tracking-wider font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Orders</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {users.map((u) => {
                    const isSelf = u._id === currentAdmin?._id;

                    return (
                      <tr key={u._id} className="hover:bg-gray-50/60 transition">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 flex items-center gap-1.5">
                              {u.name}
                              {isSelf && (
                                <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-gray-400">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {u.phone || 'Not provided'}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {u.orderCount || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {u.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role Toggle */}
                            <button
                              onClick={() => handleRoleToggle(u._id, u.role)}
                              disabled={isSelf}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                                u.role === 'admin'
                                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>{u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}</span>
                            </button>

                            {/* Status Toggle */}
                            <button
                              onClick={() => handleStatusToggle(u._id, u.isActive)}
                              disabled={isSelf}
                              className={`p-1.5 rounded-lg transition ${
                                u.isActive
                                  ? 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              title={u.isActive ? 'Disable User' : 'Enable User'}
                            >
                              {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </>
        ) : (
          <p className="text-xs text-gray-400 py-12 text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
