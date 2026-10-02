import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { orderAPI } from '../services/api';
import { formatINR, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const getStatusBadge = (status) => {
  const styles = {
    'Order Placed': 'bg-blue-50 text-blue-700 border-blue-200',
    Confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Packed: 'bg-purple-50 text-purple-700 border-purple-200',
    Shipped: 'bg-amber-50 text-amber-700 border-amber-200',
    'Out for Delivery': 'bg-orange-50 text-orange-700 border-orange-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getMyOrders();
        if (res.data.success) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your orders..." size="lg" />;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Orders Placed Yet</h2>
        <p className="text-xs text-gray-500">
          Looks like you haven't placed any orders yet. Start exploring great deals on ShopKart!
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          My Orders ({orders.length})
        </h1>
        <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline">
          Explore More Products
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden hover:border-gray-200 transition"
          >
            {/* Order Card Header */}
            <div className="bg-gray-50/80 px-6 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">ORDER PLACED</span>
                  <span className="font-semibold text-gray-800">{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">TOTAL</span>
                  <span className="font-bold text-gray-900">{formatINR(order.totalAmount)}</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">SHIP TO</span>
                  <span className="font-semibold text-gray-800">{order.shippingAddress?.fullName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-gray-400">ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                {getStatusBadge(order.orderStatus)}
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="p-6 divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate max-w-md">{item.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Qty: <span className="font-semibold">{item.quantity}</span> • Price: <span className="font-semibold">{formatINR(item.price)}</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Track Order</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
