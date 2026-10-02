import React, { useState } from 'react';
import { CreditCard, QrCode, Building, ShieldCheck, X, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, amount, onConfirmPayment, loading = false }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');

  if (!isOpen) return null;

  const handlePay = (isSuccess = true) => {
    if (!isSuccess) {
      alert('Simulated payment failure: Transaction declined by bank.');
      return;
    }

    onConfirmPayment({
      method: selectedMethod === 'card' ? 'mock_card' : selectedMethod === 'upi' ? 'mock_upi' : 'mock_netbanking',
      isMock: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-cinema-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-cinema-850">
          <div>
            <span className="text-xs uppercase tracking-wider text-brand font-bold block">
              Secure Checkout Gateway
            </span>
            <h3 className="text-xl font-black text-white">Payment Options</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Amount Callout */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-cinema-800 border border-brand/20">
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Amount Payable</p>
              <p className="text-2xl font-black text-white mt-0.5">₹{amount}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit Encrypted</span>
            </div>
          </div>

          {/* Development Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <span className="font-bold uppercase tracking-wider bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px]">
              Dev Mode
            </span>
            <span>
              Mock payment simulator active. Choose a method and click "Pay Successfully" to complete booking reservation.
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                selectedMethod === 'card'
                  ? 'bg-brand/15 border-brand text-white shadow-md shadow-brand/10'
                  : 'bg-cinema-850 border-white/5 text-gray-400 hover:text-white hover:bg-cinema-800'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-1.5" />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                selectedMethod === 'upi'
                  ? 'bg-brand/15 border-brand text-white shadow-md shadow-brand/10'
                  : 'bg-cinema-850 border-white/5 text-gray-400 hover:text-white hover:bg-cinema-800'
              }`}
            >
              <QrCode className="w-5 h-5 mb-1.5" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                selectedMethod === 'netbanking'
                  ? 'bg-brand/15 border-brand text-white shadow-md shadow-brand/10'
                  : 'bg-cinema-850 border-white/5 text-gray-400 hover:text-white hover:bg-cinema-800'
              }`}
            >
              <Building className="w-5 h-5 mb-1.5" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* Form details for selected method */}
          {selectedMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-cinema-850 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    defaultValue="12/28"
                    className="w-full bg-cinema-850 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    defaultValue="889"
                    maxLength={4}
                    className="w-full bg-cinema-850 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-medium block">
                Virtual Payment Address (VPA / UPI ID)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-cinema-850 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
              />
              <p className="text-[11px] text-gray-500">
                Supports Google Pay, PhonePe, Paytm, and BHIM UPI.
              </p>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium block">
                Select Popular Bank
              </label>
              <select className="w-full bg-cinema-850 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand">
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>State Bank of India (SBI)</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handlePay(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-brand hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-brand/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying & Confirming Seats...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Pay ₹{amount} (Simulate Success)</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handlePay(false)}
              className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
            >
              Simulate Payment Failure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
