import React, { useState, useEffect } from 'react';
import { 
  Wallet, Users, Plus, ExternalLink, Edit3, ArrowUpRight, 
  ArrowDownLeft, MessageSquare, Copy, Check, Power, Sparkles, AlertCircle
} from 'lucide-react';

export default function FranchiseeDashboard({ currentUser, setView, onEditCard, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/franchise/dashboard');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateClientCard = async (e) => {
    e.preventDefault();
    if (!clientCompanyName.trim()) return;

    if (data.wallet_balance < data.franchise_card_price) {
      alert(`Insufficient wallet balance. You need ₹${data.franchise_card_price}, current balance is ₹${data.wallet_balance}. Please contact Admin to recharge.`);
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: clientCompanyName,
          theme_id: 26,
          phone: clientPhone,
          email: clientEmail
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Card creation failed');

      setShowCreateModal(false);
      setClientCompanyName('');
      setClientPhone('');
      setClientEmail('');
      fetchDashboard();
      onEditCard(resData.card.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (slug, id) => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const clientCards = data.clientCards || [];
  const transactions = data.transactions || [];
  const cardPrice = data.franchise_card_price || 150;
  const cardsRemaining = Math.floor(data.wallet_balance / cardPrice);

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Franchisee Top Navbar */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Franchisee & Reseller Portal</h1>
              <span className="text-[11px] text-emerald-300 font-semibold">{currentUser?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <a
              href="https://wa.me/917367063161?text=Hi%20Admin,%20Please%20recharge%20my%20Franchisee%20wallet"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Request Wallet Top-up</span>
            </a>
            <button onClick={onLogout} className="hover:text-rose-300 flex items-center gap-1">
              <Power className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Metric Cards Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Wallet Balance */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Wallet Balance</span>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black mt-2">₹{data.wallet_balance}</div>
            <div className="text-[11px] text-emerald-200 mt-1 font-medium">
              Can create approx. <strong>{cardsRemaining} cards</strong>
            </div>
          </div>

          {/* Rate per card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wholesale Card Rate</div>
            <div className="text-3xl font-black text-slate-900 mt-2">₹{cardPrice}</div>
            <div className="text-[11px] text-slate-500 mt-1">Deducted per created card</div>
          </div>

          {/* Total Client Cards */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Client Cards</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{clientCards.length}</div>
            <div className="text-[11px] text-emerald-600 mt-1 font-bold">100% Fully Activated</div>
          </div>

          {/* Action: Create Client Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Client</span>
              <div className="text-base font-extrabold mt-1">Create Client Card</div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full mt-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Card (₹{cardPrice})</span>
            </button>
          </div>

        </div>

        {/* Client Cards Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Your Client Cards</h2>
            <span className="text-xs font-bold text-slate-500">{clientCards.length} Active Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Client Business Name</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Views</th>
                  <th className="py-3 px-6 text-center">Share</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {clientCards.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-slate-400">
                      You have not created any client cards yet.
                    </td>
                  </tr>
                ) : (
                  clientCards.map((card) => (
                    <tr key={card.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-6 font-bold text-slate-900">#{card.id}</td>
                      <td className="py-3.5 px-6">
                        <div className="font-extrabold text-slate-900">{card.company_name}</div>
                        <div className="text-[10px] text-slate-400">/{card.slug}</div>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                          {card.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center font-bold text-slate-700">
                        {card.views_count}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => copyLink(card.slug, card.id)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                            title="Copy link"
                          >
                            {copiedId === card.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out your digital card: ${window.location.origin}/card/${card.slug}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setView('public-card', card.slug)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                            title="View Card"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditCard(card.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wallet Transactions Ledger */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600" />
            Wallet Activity Ledger
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {transactions.length === 0 ? (
              <div className="py-6 text-center text-slate-400">No wallet transactions recorded yet.</div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{tx.comment}</div>
                      <div className="text-[10px] text-slate-400">{new Date(tx.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className={`font-black text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Create Client Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900">Create Client Visiting Card</h3>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold">
              Creating this card will deduct <strong>₹{cardPrice}</strong> from your wallet balance.
            </div>

            <form onSubmit={handleCreateClientCard} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Client Business / Company Name *</label>
                <input
                  type="text"
                  required
                  value={clientCompanyName}
                  onChange={(e) => setClientCompanyName(e.target.value)}
                  placeholder="e.g. Royal Jewels & Diamonds"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Client Mobile Number</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Client Email Address</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-500"
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
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {creating ? 'Deducting & Generating...' : `Deduct ₹${cardPrice} & Create Card`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
