import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { orderAPI } from '../services/api';
import { formatINR, formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const trackingSteps = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getOrderById(id);
        if (res.data.success && res.data.order) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Fetching order details..." size="lg" />;
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <Link to="/orders" className="text-xs font-semibold text-blue-600 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const res = await orderAPI.cancelOrder(order._id, cancelReason);
      if (res.data.success) {
        success('Order cancelled successfully.');
        setOrder(res.data.order);
        setCancelModalOpen(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel order.';
      error(msg);
    } finally {
      setCancelling(false);
    }
  };

  const isCancelled = order.orderStatus === 'Cancelled';
  const isDelivered = order.orderStatus === 'Delivered';
  const currentStepIndex = trackingSteps.indexOf(order.orderStatus);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            to="/orders"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Orders
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
          </h1>
          <p className="text-xs text-gray-500">
            Placed on {formatDate(order.createdAt, true)}
          </p>
        </div>

        {!isCancelled && !isDelivered && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition self-start sm:self-auto"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Visual Order Tracking Timeline */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-2xs">
        <h2 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600" />
          Delivery Status & Timeline
        </h2>

        {isCancelled ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-700 text-xs">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold">This order was cancelled on {formatDate(order.cancelledAt, true)}</p>
              {order.cancelReason && <p className="text-rose-600 mt-0.5">Reason: {order.cancelReason}</p>}
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline connector bar */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="hidden md:block absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStepIndex) / (trackingSteps.length - 1)) * 100}%`
              }}
            />

            {/* Steps Nodes */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
              {trackingSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex md:flex-col items-center gap-2.5 md:gap-2 text-left md:text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          isCurrent
                            ? 'font-bold text-emerald-700'
                            : isCompleted
                            ? 'font-semibold text-gray-900'
                            : 'font-medium text-gray-400'
                        }`}
                      >
                        {step}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Timeline Events History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Status Log</h3>
            <div className="space-y-3">
              {order.statusHistory.map((hist, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{hist.status}</span>
                      <span className="text-gray-400 text-[11px]">{formatDate(hist.timestamp, true)}</span>
                    </div>
                    {hist.note && <p className="text-gray-600 text-[11px] mt-0.5">{hist.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Grid: Items and Delivery/Payment */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Ordered Items */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
            Items in this Order ({order.items.length})
          </h2>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/product/${item.product?._id || item.product}`}
                      className="text-xs font-bold text-gray-900 hover:text-blue-600 truncate block max-w-xs transition"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Qty: {item.quantity} × {formatINR(item.price)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">{formatINR(order.itemsPrice)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>- {formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-dashed border-gray-200">
              <span>Total Paid</span>
              <span>{formatINR(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Details */}
        <div className="md:col-span-5 space-y-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Delivery Address
            </h3>
            <div className="text-xs text-gray-700 space-y-1">
              <p className="font-bold text-gray-900">{order.shippingAddress?.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress?.street}</p>
              {order.shippingAddress?.landmark && <p className="text-gray-500">Landmark: {order.shippingAddress.landmark}</p>}
              <p className="text-gray-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-bold">{order.shippingAddress?.pincode}</span>
              </p>
              <p className="font-semibold text-gray-800 pt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-500" />
              Payment Information
            </h3>
            <div className="text-xs text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="font-bold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`font-bold ${
                    order.paymentStatus === 'Completed'
                      ? 'text-emerald-600'
                      : order.paymentStatus === 'Refunded'
                      ? 'text-purple-600'
                      : 'text-amber-600'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentDetails?.transactionId && (
                <div className="flex justify-between pt-1 text-[11px] text-gray-400">
                  <span>Txn ID:</span>
                  <span className="font-mono">{order.paymentDetails.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel This Order"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Are you sure you want to cancel order #{order._id.substring(order._id.length - 8).toUpperCase()}?
            This will stop dispatch and restore item quantities to inventory.
          </p>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Reason for Cancellation</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a reason</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Found a better price elsewhere">Found a better price elsewhere</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Delivery time is too long">Delivery time is too long</option>
              <option value="Incorrect shipping address">Incorrect shipping address</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;
