import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';

const validStatuses = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

const AdminOrdersPage = () => {
  const { success, error } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10
      };
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const res = await adminAPI.getAllOrders(params);
      if (res.data.success) {
        setOrders(res.data.orders || []);
        setTotalPages(res.data.pages || 1);
        setTotalOrders(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await adminAPI.updateOrderStatus(orderId, {
        orderStatus: newStatus,
        note: `Status updated to ${newStatus} via Admin Console.`
      });

      if (res.data.success) {
        success(`Order status changed to ${newStatus}!`);
        // Update local list
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.order);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update order status.';
      error(msg);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Order Management</h1>
        <p className="text-xs text-gray-500">Track shipments, manage statuses, and view customer purchases</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by customer name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {validStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching customer orders..." size="lg" />
        ) : orders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-400 uppercase tracking-wider font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Items</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Payment</th>
                    <th className="px-6 py-3">Order Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                        <span className="block text-[10px] font-sans text-gray-400">{formatDate(ord.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{ord.shippingAddress?.fullName || ord.user?.name}</p>
                        <p className="text-[11px] text-gray-400">{ord.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {ord.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatINR(ord.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">{ord.paymentMethod}</span>
                        <span
                          className={`block text-[10px] font-bold ${
                            ord.paymentStatus === 'Completed'
                              ? 'text-emerald-600'
                              : ord.paymentStatus === 'Refunded'
                              ? 'text-purple-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={ord.orderStatus}
                          disabled={statusUpdating}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          {validStatuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
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
          <p className="text-xs text-gray-400 py-12 text-center">No orders found.</p>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header badges */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Placed On</span>
                <p className="font-semibold text-gray-800">{formatDate(selectedOrder.createdAt, true)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Status</span>
                <p className="font-bold text-blue-600">{selectedOrder.orderStatus}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-3 border border-gray-100 rounded-xl space-y-1">
              <h4 className="font-bold text-gray-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Shipping Address
              </h4>
              <p className="text-gray-800 font-semibold">{selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})</p>
              <p className="text-gray-600">
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
              </p>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900">Ordered Items</h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded p-0.5 border" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-sm">{item.name}</p>
                        <p className="text-[11px] text-gray-500">Qty: {item.quantity} × {formatINR(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between font-bold text-sm">
              <span>Total Amount</span>
              <span className="text-base text-gray-900 font-black">{formatINR(selectedOrder.totalAmount)}</span>
            </div>

            {/* Quick Status Update */}
            <div className="pt-2 flex items-center justify-between">
              <span className="font-bold text-gray-700">Update Order Status:</span>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold"
              >
                {validStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrdersPage;
