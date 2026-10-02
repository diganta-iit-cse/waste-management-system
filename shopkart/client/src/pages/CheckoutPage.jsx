import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Plus,
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { formatINR } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, addAddress } = useAuth();
  const { items, summary, clearCart, loading: cartLoading } = useCart();
  const { success, error, warning } = useToast();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placingOrder, setPlacingOrder] = useState(false);

  // New Address Form Toggle & State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'Home'
  });

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultIdx = user.addresses.findIndex((a) => a.isDefault);
      setSelectedAddressIndex(defaultIdx !== -1 ? defaultIdx : 0);
    }
  }, [user]);

  if (cartLoading) {
    return <LoadingSpinner text="Preparing checkout..." size="lg" />;
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-lg mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Shop Now
        </Link>
      </div>
    );
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      warning('Please fill all required address fields.');
      return;
    }

    const res = await addAddress(addressForm);
    if (res.success) {
      setShowAddressForm(false);
      setSelectedAddressIndex(res.addresses.length - 1);
      setAddressForm({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        addressType: 'Home'
      });
    }
  };

  const handlePlaceOrder = async () => {
    const addresses = user?.addresses || [];
    if (addresses.length === 0 || !addresses[selectedAddressIndex]) {
      warning('Please select or add a delivery address to place your order.');
      return;
    }

    const selectedShippingAddress = addresses[selectedAddressIndex];

    try {
      setPlacingOrder(true);

      const orderPayload = {
        items: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0] || '',
          price: item.product.price,
          originalPrice: item.product.originalPrice || item.product.price,
          quantity: item.quantity
        })),
        shippingAddress: selectedShippingAddress,
        paymentMethod
      };

      const res = await orderAPI.createOrder(orderPayload);

      if (res.data.success && res.data.order) {
        clearCart();
        success('Order placed successfully! Redirecting to tracking...');
        navigate(`/orders/${res.data.order._id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      error(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  const currentAddress = user?.addresses?.[selectedAddressIndex];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-xs font-black">
                  1
                </span>
                Delivery Address
              </span>
              {currentAddress && !showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              )}
            </div>

            <div className="p-6">
              {/* Existing addresses list */}
              {user?.addresses && user.addresses.length > 0 && !showAddressForm ? (
                <div className="space-y-3">
                  {user.addresses.map((addr, idx) => (
                    <label
                      key={addr._id || idx}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition ${
                        selectedAddressIndex === idx
                          ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="addressRadio"
                          checked={selectedAddressIndex === idx}
                          onChange={() => setSelectedAddressIndex(idx)}
                          className="mt-1 text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm">{addr.fullName}</span>
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              {addr.addressType}
                            </span>
                            <span className="font-semibold text-gray-700">{addr.phone}</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {addr.street}, {addr.landmark && `${addr.landmark}, `}{addr.city}, {addr.state} -{' '}
                            <span className="font-bold text-gray-800">{addr.pincode}</span>
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Address</span>
                  </button>
                </div>
              ) : (
                /* New Address Form */
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Add New Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Recipient full name"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-1">Flat, House no., Building, Street *</label>
                      <input
                        type="text"
                        required
                        placeholder="Street address"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">City / District *</label>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">State *</label>
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-digit pincode"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Near City Hospital"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
                    >
                      Save & Deliver Here
                    </button>
                    {user?.addresses && user.addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* STEP 2: Order Summary Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-xs font-black">
                  2
                </span>
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </div>
            <div className="p-6 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item._id || item.product._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.images?.[0] || ''}
                      alt={item.product.name}
                      className="w-12 h-12 object-contain rounded-lg border border-gray-100 p-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-gray-500">
                        Qty: <span className="font-semibold text-gray-800">{item.quantity}</span> × {formatINR(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: Payment Options */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-xs font-black">
                  3
                </span>
                Payment Options
              </span>
            </div>
            <div className="p-6 space-y-3">
              <label
                className={`block p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-gray-500">Pay cash or UPI at your doorstep upon receiving the parcel</p>
                  </div>
                </div>
              </label>

              <label
                className={`block p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'Mock Online Payment'
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Mock Online Payment"
                    checked={paymentMethod === 'Mock Online Payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-gray-900">Online Payment (Card / UPI / NetBanking)</p>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">Instant</span>
                    </div>
                    <p className="text-[11px] text-gray-500">Simulate secure zero-fee payment (Stripe/Razorpay sandbox)</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Price Details & Place Order */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-100">
              Payment Summary
            </h2>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Items Total ({summary.totalQuantity} items)</span>
                <span className="font-semibold text-gray-900">{formatINR(summary.totalMRP || 0)}</span>
              </div>

              <div className="flex justify-between text-emerald-600">
                <span>Product Discounts</span>
                <span className="font-semibold">- {formatINR(summary.discount || 0)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {summary.deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">{formatINR(summary.deliveryFee)}</span>
                  )}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                <span>Amount Payable</span>
                <span>{formatINR(summary.finalTotal || 0)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{placingOrder ? 'Processing Order...' : 'Confirm & Place Order'}</span>
            </button>
          </div>

          <div className="p-4 bg-white/70 rounded-xl border border-gray-100 text-xs text-gray-500 space-y-2">
            <div className="flex items-center gap-2 font-bold text-gray-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Safe Purchase Guarantee
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              By confirming this order, you agree to ShopKart terms of sale and delivery conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
