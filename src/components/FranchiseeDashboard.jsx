import React, { useState, useEffect } from 'react';
import { 
  Wallet, Users, Plus, ExternalLink, Edit3, ArrowUpRight, 
  ArrowDownLeft, MessageSquare, Copy, Check, Power, Sparkles, AlertCircle,
  Briefcase, CheckCircle2, ShieldCheck, Clock, Layers, Trash2, Key, UserCheck
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function FranchiseeDashboard({ currentUser, setView, onEditCard, onLogout }) {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clientPersonalName, setClientPersonalName] = useState('');
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCustomerCode, setClientCustomerCode] = useState('');
  const [layoutTemplate, setLayoutTemplate] = useState('executive');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'clients'

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

  const copyText = (txt, label) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    setCopyFeedback(`${label} copied!`);
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleCreateClientCard = async (e) => {
    e.preventDefault();
    if (!clientCompanyName.trim()) return;

    if ((data.card_quota ?? 50) <= 0) {
      alert(`Card creation quota exhausted. Please contact Super Admin to recharge your franchise card quota.`);
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: clientCompanyName,
          customer_name: clientPersonalName,
          customer_email: clientEmail,
          customer_phone: clientPhone,
          customer_code: clientCustomerCode,
          layout_template: layoutTemplate,
          theme_id: 1,
          phone: clientPhone,
          email: clientEmail
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Card creation failed');

      setShowCreateModal(false);
      setClientPersonalName('');
      setClientCompanyName('');
      setClientPhone('');
      setClientEmail('');
      setClientCustomerCode('');
      fetchDashboard();
      onEditCard(resData.card.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleCardStatus = async (cardId) => {
    try {
      await fetch(`/api/cards/${cardId}/toggle-status`, { method: 'POST' });
      fetchDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTogglePaymentStatus = async (card) => {
    const nextStatus = card.payment_status === 'paid' ? 'trial' : 'paid';
    try {
      await fetch(`/api/cards/${card.id}/set-payment-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: nextStatus })
      });
      fetchDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCard = async (cardId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete card "${companyName}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to delete card');
      fetchDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenCreateForClient = (client) => {
    setClientPersonalName(client.name || '');
    setClientEmail(client.email || '');
    setClientPhone(client.phone || '');
    setClientCustomerCode(client.customer_code || '');
    setClientCompanyName('');
    setShowCreateModal(true);
  };

  const copyLink = (slug, id) => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const clientCards = data.clientCards || [];
  const clients = data.clients || [];
  const transactions = data.transactions || [];
  const cardQuota = data.card_quota ?? 50;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 pb-16 font-[Plus_Jakarta_Sans,sans-serif] transition-colors">
      {/* Franchisee Top Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">{t('franchiseHub', 'Franchise Partner Hub')}</h1>
              <span className="text-[11px] text-emerald-300 font-semibold">{currentUser?.name} • Appointed Partner</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <a
              href="https://wa.me/917367063161?text=Hi%20Super%20Admin,%20Please%20recharge%20my%20Franchisee%20Card%20Quota"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Request Quota Recharge</span>
            </a>
            <button onClick={onLogout} className="hover:text-rose-300 flex items-center gap-1 cursor-pointer">
              <Power className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Franchise Credentials Banner */}
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border border-emerald-800 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] uppercase border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Franchise Partner Credentials
              </span>
              <h3 className="font-extrabold text-sm">{currentUser?.name}</h3>
            </div>
            <p className="text-xs text-emerald-200/80 max-w-xl">
              Share your unique Franchise Code and Security PIN with clients during registration so they link directly to your franchise.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-2">
              <div>
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Franchise Code</div>
                <div className="font-mono font-black text-sm text-white tracking-wide">{data.franchise_code || "FRAN-PARTNER"}</div>
              </div>
              <button
                onClick={() => copyText(data.franchise_code, "Franchise Code")}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
                title="Copy Franchise Code"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-2">
              <div>
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Security PIN</div>
                <div className="font-mono font-black text-sm text-white tracking-widest">{data.franchise_pin || "••••"}</div>
              </div>
              <button
                onClick={() => copyText(data.franchise_pin, "Franchise PIN")}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
                title="Copy PIN"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Copy Notification Toast */}
        {copyFeedback && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" /> {copyFeedback}
          </div>
        )}
        
        {/* Metric Cards Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card Quota Balance */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Card Pack Quota</span>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black mt-2">{cardQuota} Cards</div>
            <div className="text-[11px] text-emerald-200 mt-1 font-medium">
              Remaining in your current pack
            </div>
          </div>

          {/* Total Client Cards */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Client Cards</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{clientCards.length}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">Issued by your franchise</div>
          </div>

          {/* Active Cards */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Live Cards</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {clientCards.filter(c => c.status === 'active').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Live and viewable by public</div>
          </div>

          {/* Action: Create Client Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Onboarding</span>
              <div className="text-base font-extrabold mt-1">Create Card for Customer</div>
            </div>
            <button
              onClick={() => {
                setClientPersonalName('');
                setClientCompanyName('');
                setClientPhone('');
                setClientEmail('');
                setClientCustomerCode('');
                setShowCreateModal(true);
              }}
              disabled={cardQuota <= 0}
              className="w-full mt-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{cardQuota > 0 ? "Issue New Card (-1 Quota)" : "Quota Exhausted"}</span>
            </button>
          </div>

        </div>

        {/* Tab Switching: Client Cards vs Registered Clients */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'cards'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Client Visiting Cards ({clientCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'clients'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Registered Clients ({clients.length})</span>
          </button>
        </div>

        {/* Tab 1: Client Cards Table */}
        {activeTab === 'cards' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Your Managed Client Cards</h2>
                <p className="text-xs text-slate-500">You have full control to toggle active/pause, switch trial/paid, edit designs, and delete</p>
              </div>
              <span className="text-xs font-bold text-slate-500">{clientCards.length} Client Cards</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4 text-center">ID</th>
                    <th className="py-3 px-4">Client & Business</th>
                    <th className="py-3 px-4 text-center">Architecture</th>
                    <th className="py-3 px-4 text-center">Subscription</th>
                    <th className="py-3 px-4 text-center">Card Status</th>
                    <th className="py-3 px-4 text-center">Views</th>
                    <th className="py-3 px-4 text-center">Share</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {clientCards.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-10 text-center text-slate-400">
                        You have not created any client cards yet. Click "Issue New Card" to onboard your first customer!
                      </td>
                    </tr>
                  ) : (
                    clientCards.map((card) => (
                      <tr key={card.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white">#{card.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm">{card.company_name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {card.customer_name || card.personal_name || "Client"} • {card.customer_phone || card.phone || "No phone"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">/card/{card.slug}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 capitalize border border-indigo-200 dark:border-indigo-800/40">
                            {card.layout_template || 'executive'}
                          </span>
                        </td>

                        {/* Subscription: Toggle Trial vs Paid */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleTogglePaymentStatus(card)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition cursor-pointer ${
                              card.payment_status === "paid"
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:opacity-80"
                                : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:opacity-80"
                            }`}
                            title="Click to toggle between Trial and Paid"
                          >
                            {card.payment_status === "paid" ? "Paid Active ✓" : "Trial (7 Days)"}
                          </button>
                        </td>

                        {/* Card Status: Toggle Active vs Paused */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleCardStatus(card.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer ${
                              card.status === "active"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                            }`}
                            title="Click to toggle Active / Paused"
                          >
                            <span className={`w-2 h-2 rounded-full ${card.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {card.status === "active" ? "Active" : "Paused"}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                          {card.views_count || 0}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => copyLink(card.slug, card.id)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                              title="Copy link"
                            >
                              {copiedId === card.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Here is your digital visiting card link: ${window.location.origin}/card/${card.slug}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition cursor-pointer"
                              title="Share on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setView('public-card', card.slug)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                              title="Preview Card"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditCard(card.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Edit Card in Studio"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Studio
                            </button>
                            <button
                              onClick={() => handleDeleteCard(card.id, card.company_name)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold transition cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )}

        {/* Tab 2: My Registered Clients Table */}
        {activeTab === 'clients' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Clients Registered Under Your Franchise</h2>
                <p className="text-xs text-slate-500">Clients who entered your Franchise Code & PIN during sign up</p>
              </div>
              <span className="text-xs font-bold text-slate-500">{clients.length} Registered Clients</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Customer Security Code</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4 text-center">Active Cards</th>
                    <th className="py-3 px-4 text-center">Joined Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-slate-400 font-semibold">
                        No clients registered under your franchise code yet. Share your Franchise Code <strong className="text-emerald-600 font-mono">{data.franchise_code}</strong> and PIN <strong className="text-emerald-600 font-mono">{data.franchise_pin}</strong> with your customers!
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white text-sm">
                          {client.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => copyText(client.customer_code, 'Customer Code')}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-[11px] inline-flex items-center gap-1.5 transition cursor-pointer border border-slate-300 dark:border-slate-700"
                            title="Click to copy Customer Code"
                          >
                            <span>{client.customer_code}</span>
                            <Copy size={11} className="text-slate-500" />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          <div>{client.email}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{client.phone || "—"}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-emerald-600 text-sm">
                          {client.cards_count || 0}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-500 text-[11px]">
                          {new Date(client.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenCreateForClient(client)}
                            disabled={cardQuota <= 0}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Issue Card
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Create Client Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Issue Card for Customer</h3>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              Creating this card will allocate <strong>1 card from your franchise quota</strong> ({cardQuota} cards remaining).
            </div>

            <form onSubmit={handleCreateClientCard} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Security Code (Optional)
                </label>
                <input
                  type="text"
                  value={clientCustomerCode}
                  onChange={(e) => setClientCustomerCode(e.target.value)}
                  placeholder="e.g. CUST-ALEX-7712 (Links card to customer account)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer / Client Name *</label>
                <input
                  type="text"
                  required
                  value={clientPersonalName}
                  onChange={(e) => setClientPersonalName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business / Company Name *</label>
                <input
                  type="text"
                  required
                  value={clientCompanyName}
                  onChange={(e) => setClientCompanyName(e.target.value)}
                  placeholder="e.g. Royal Gems & Textiles"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Mobile Number</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Email Address</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="customer@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Choose Initial Architecture</label>
                <select
                  value={layoutTemplate}
                  onChange={(e) => setLayoutTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:border-emerald-500"
                >
                  <option value="executive">Executive (Signature Floating Dock)</option>
                  <option value="royale">Imperial Royale (Gold Velvet Prestige)</option>
                  <option value="neoglass">NeoGlass Prism (3D Frosted Glass)</option>
                  <option value="bento">Bento Grid (Modular Tiles)</option>
                  <option value="brutalist">Neo-Brutalist (High Contrast Pop)</option>
                  <option value="nordic">Nordic Minimal (Quiet Luxury)</option>
                  <option value="editorial">Editorial (Magazine Typography)</option>
                  <option value="cyber">Cyber HUD (High-Tech Terminal)</option>
                  <option value="split">Dynamic Split (Diagonal Modern)</option>
                  <option value="compact">Compact Bio (iOS Accordion)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {creating ? 'Issuing Card...' : 'Issue Card & Open Studio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
