import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Eye, Share2, CreditCard, Power, Lock, 
  ExternalLink, Copy, Check, MessageSquare, AlertCircle, Sparkles, Trash2
} from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function CustomerDashboard({ currentUser, setView, onEditCard, onLogout }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [paymentCard, setPaymentCard] = useState(null);

  // New card modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cards');
      const data = await res.json();
      setCards(data.cards || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName, theme_id: 26 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create card');
      setShowCreateModal(false);
      setCompanyName('');
      fetchCards();
      // Open builder immediately
      onEditCard(data.card.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (cardId) => {
    try {
      await fetch(`/api/cards/${cardId}/toggle-status`, { method: 'POST' });
      fetchCards();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
      fetchCards();
    } catch (err) {
      alert(err.message);
    }
  };

  const copyShareLink = (slug, id) => {
    const url = `${window.location.origin}/card/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Green Header Bar matching frame_040s.png */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tight">Customer Login</h1>
            <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
              Card Management
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span>Hi! {currentUser?.name || 'User'}</span>
            <span className="opacity-40">|</span>
            <button 
              onClick={() => alert('Password Change Dialog: You can update password in user settings.')} 
              className="hover:underline flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" /> Change Password
            </button>
            <span className="opacity-40">|</span>
            <button onClick={onLogout} className="hover:text-rose-200 flex items-center gap-1">
              <Power className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Notice Banner matching frame_040s.png */}
        <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold text-center shadow-sm">
          Trial Cards are only available for 7 days. Please make payment to avoid Cancellation or Deactivation of your card.
        </div>

        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Your Digital Cards</h2>
            <p className="text-xs text-slate-500">Create, edit, switch 100 themes, and view live analytics</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Card</span>
          </button>
        </div>

        {/* Cards Table matching frame_040s.png */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold">
                  <th className="py-3.5 px-4 text-center">Card ID</th>
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4 text-center">Payment Status</th>
                  <th className="py-3.5 px-4 text-center">Card Status</th>
                  <th className="py-3.5 px-4 text-center">Date</th>
                  <th className="py-3.5 px-4 text-center">Share</th>
                  <th className="py-3.5 px-4 text-center">Edit</th>
                  <th className="py-3.5 px-4 text-center">Card Payment</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {cards.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400">
                      No cards created yet. Click "Create New Card" to get started!
                    </td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-center font-bold text-slate-900">{card.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{card.company_name}</span>
                          <button
                            onClick={() => setView('public-card', card.slug)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition"
                            title="Preview Public Card"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400">/{card.slug}</span>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          card.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {card.payment_status === 'paid' ? 'Success' : 'Trial'}
                        </span>
                      </td>

                      {/* Card Status (Active / Deactivated) */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(card.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 mx-auto ${
                            card.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${card.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {card.status === 'active' ? 'Active' : 'Deactivated'}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-center text-slate-500 text-[11px]">
                        {new Date(card.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Share Icons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my digital visiting card: ${window.location.origin}/card/${card.slug}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                            title="Share on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => copyShareLink(card.slug, card.id)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                            title="Copy Card Link"
                          >
                            {copiedId === card.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Edit Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onEditCard(card.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold transition flex items-center gap-1 mx-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </td>

                      {/* Card Payment (Pay Now button matching frame_040s) */}
                      <td className="py-3 px-4 text-center">
                        {card.payment_status === 'paid' ? (
                          <span className="text-emerald-600 font-bold text-xs">✓ Active (1 Year)</span>
                        ) : (
                          <button
                            onClick={() => setPaymentCard(card)}
                            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold shadow-sm transition"
                          >
                            Pay Now
                          </button>
                        )}
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Create Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900">Create New Digital Card</h3>
            <p className="text-xs text-slate-500">
              Enter your business or company name to generate your personalized visiting card and choose from 100 themes.
            </p>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company or Business Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Marketing Solutions"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm font-semibold focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Submit & Next →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={Boolean(paymentCard)}
        onClose={() => setPaymentCard(null)}
        card={paymentCard}
        onSuccess={fetchCards}
      />
    </div>
  );
}
