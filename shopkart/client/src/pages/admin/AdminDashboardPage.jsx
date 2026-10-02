import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getDashboardMetrics();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading administrator analytics..." size="lg" />;
  }

  const metrics = data?.metrics || {};
  const analytics = data?.analytics || {};
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Store Analytics & Overview</h1>
          <p className="text-xs text-gray-500">Live metrics from your ShopKart database</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-3 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* 6 Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 w-fit mb-2">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Revenue</span>
          <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5 truncate">
            {formatINR(metrics.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 w-fit mb-2">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
          <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
            {metrics.totalOrders || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 w-fit mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customers</span>
          <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
            {metrics.totalUsers || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 w-fit mb-2">
            <Package className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Products</span>
          <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
            {metrics.totalProducts || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600 w-fit mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">In Progress</span>
          <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
            {metrics.pendingOrders || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 w-fit mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Delivered</span>
          <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
            {metrics.deliveredOrders || 0}
          </p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Category Breakdown */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Revenue by Category
          </h2>

          <div className="space-y-3 pt-2">
            {analytics.revenueByCategory && analytics.revenueByCategory.length > 0 ? (
              analytics.revenueByCategory.map((cat, i) => {
                const total = metrics.totalRevenue || 1;
                const percentage = Math.min(100, Math.round((cat.revenue / total) * 100));

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-800">{cat.name}</span>
                      <span className="text-gray-900">{formatINR(cat.revenue)} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No category breakdown data.</p>
            )}
          </div>
        </div>

        {/* Orders by Status Distribution */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Orders by Status
          </h2>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {analytics.ordersByStatus && analytics.ordersByStatus.length > 0 ? (
              analytics.ordersByStatus.map((st) => (
                <div key={st._id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{st._id}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                    {st.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center col-span-2">No orders recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Recent Customer Orders</h2>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-400 uppercase tracking-wider font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{ord.shippingAddress?.fullName || ord.user?.name}</p>
                    <p className="text-[11px] text-gray-400">{ord.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">{formatDate(ord.createdAt)}</td>
                  <td className="px-6 py-4 font-medium">{ord.items?.length || 0} items</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatINR(ord.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/orders/${ord._id}`}
                      className="text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
