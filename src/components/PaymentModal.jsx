import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Building, Sparkles } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, card, onSuccess }) {
  const [phone, setPhone] = useState(card?.phone || '7367063161');
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !card) return null;

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pay/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: card.id, amount: 999 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-200">
        {/* Header matching frame_175s.png */}
        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-blue-700 font-extrabold text-sm mb-3 shadow-md">
            DigiCards
          </div>

          <div className="text-xs uppercase tracking-widest text-blue-100 font-bold">DIGICARDS.IN</div>
          <div className="text-xs text-blue-200 mt-0.5">Total Amount</div>
          <div className="text-3xl font-extrabold mt-1 tracking-tight">₹ 999</div>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-[11px] text-blue-100 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Secured by Razorpay Standard Checkout
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500">Your digital visiting card is activated for 1 year.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Details</label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <span className="px-3 py-2.5 bg-slate-50 text-slate-500 font-semibold border-r border-slate-200 text-xs flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-1 px-3 py-2.5 outline-none text-slate-800 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Payment Options</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setMethod('upi')}
                    className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition ${
                      method === 'upi' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition ${
                      method === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('netbanking')}
                    className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition ${
                      method === 'netbanking' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    Netbanking
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>Local Demo Mode:</strong> Clicking proceed instantly simulates 100% successful payment and card activation.</span>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing Transaction...' : 'Proceed & Pay ₹999'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
