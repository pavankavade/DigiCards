import React, { useState, useEffect } from 'react';
import { 
  Plus, Users, CreditCard, Shield, Wallet, Settings, Power, 
  Search, ExternalLink, CheckCircle2, AlertCircle, Edit3, Trash2
} from 'lucide-react';

export default function AdminDashboard({ currentUser, setView, onEditCard, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard'); // 'dashboard', 'users', 'franchisees', 'user_cards', 'recharge', 'settings'
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [settingsData, setSettingsData] = useState({});
  const [loading, setLoading] = useState(true);

  // Recharge form state matching frame_135s.png
  const [rechargeEmail, setRechargeEmail] = useState('franchise@example.com');
  const [rechargeAmount, setRechargeAmount] = useState('1000');
  const [rechargeComment, setRechargeComment] = useState('Promotional Amount');
  const [rechargeMsg, setRechargeMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, usersRes, cardsRes, setRes] = useState ? await Promise.all([
        fetch('/api/admin/dashboard'),
        fetch('/api/admin/users'),
        fetch('/api/cards'),
        fetch('/api/admin/settings')
      ]) : [];

      const dJson = await dashRes.json();
      const uJson = await usersRes.json();
      const cJson = await cardsRes.json();
      const sJson = await setRes.json();

      setSummary(dJson.summary);
      setUsers(uJson.users || []);
      setCards(cJson.cards || []);
      setSettingsData(sJson.settings || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRechargeWallet = async (e) => {
    e.preventDefault();
    setRechargeMsg('');
    try {
      const res = await fetch('/api/admin/recharge-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: rechargeEmail,
          amount: rechargeAmount,
          comment: rechargeComment
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Recharge failed');
      setRechargeMsg(`✓ ${data.message}`);
      fetchAdminData();
    } catch (err) {
      setRechargeMsg(`✗ ${err.message}`);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      if (res.ok) alert('Settings saved successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleCardStatus = async (cardId) => {
    try {
      await fetch(`/api/cards/${cardId}/toggle-status`, { method: 'POST' });
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Top Navbar matching frame_115s.png */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-wider text-slate-900">ADMIN</h1>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
              DigiCards Central Management
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <button onClick={() => setView('landing')} className="hover:text-indigo-600">
              Home
            </button>
            <span className="opacity-40">|</span>
            <span>Hi! {currentUser?.name || 'admin'}</span>
            <span className="opacity-40">|</span>
            <button onClick={() => setActiveMenu('settings')} className="hover:text-indigo-600 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Setting
            </button>
            <span className="opacity-40">|</span>
            <button onClick={onLogout} className="hover:text-rose-600 flex items-center gap-1">
              <Power className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar Menu matching frame_115s.png */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-1.5">
            <button
              onClick={() => alert('To create a card, please use the customer or franchisee portal.')}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/25 flex items-center gap-2 transition mb-3"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Card</span>
            </button>

            {[
              { id: 'dashboard', label: 'Admin Dashboard', icon: Shield },
              { id: 'users', label: 'Manage Users', icon: Users },
              { id: 'franchisees', label: 'Manage Franchisee', icon: Wallet },
              { id: 'user_cards', label: 'Manage All Cards', icon: CreditCard },
              { id: 'recharge', label: 'Recharge Wallet', icon: Wallet },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition text-left ${
                  activeMenu === menu.id
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <menu.icon className="w-4 h-4" />
                <span>{menu.label}</span>
              </button>
            ))}

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
              >
                <Power className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. DASHBOARD VIEW matching frame_115s.png */}
            {activeMenu === 'dashboard' && (
              <div className="space-y-6">
                
                {/* 5 Top Stat Cards matching frame_115s */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Total Cards', value: summary.totalCards },
                    { label: 'Franchisee Cards', value: summary.franchiseeCards },
                    { label: 'User Cards', value: summary.userCards },
                    { label: 'All Franchisee', value: summary.allFranchisees },
                    { label: 'All Users', value: summary.allUsers }
                  ].map((st, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="text-[11px] font-bold text-slate-500">{st.label}</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{st.value}</div>
                    </div>
                  ))}
                </div>

                {/* "Your Account Summary" Card matching frame_115s */}
                <div className="max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs py-2.5 px-4 text-center tracking-wider uppercase">
                    Your Account Summary
                  </div>
                  <div className="p-4 space-y-2 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between py-1 text-slate-700">
                      <span>Total Cards</span>
                      <strong className="text-slate-900 font-extrabold">{summary.totalCards}</strong>
                    </div>
                    <div className="flex justify-between py-1 text-slate-700">
                      <span>Active Cards</span>
                      <strong className="text-emerald-600 font-extrabold">{summary.activeCards}</strong>
                    </div>
                    <div className="flex justify-between py-1 text-slate-700">
                      <span>Inactive Cards</span>
                      <strong className="text-rose-600 font-extrabold">{summary.inactiveCards}</strong>
                    </div>
                    <div className="flex justify-between py-1 text-slate-700">
                      <span>Trial Cards</span>
                      <strong className="text-amber-600 font-extrabold">{summary.trialCards}</strong>
                    </div>
                    <div className="flex justify-between py-1 text-slate-700 font-bold border-t border-slate-200">
                      <span>Payment Total</span>
                      <strong className="text-slate-900 font-black">₹{summary.paymentTotal}</strong>
                    </div>
                  </div>
                </div>

                {/* Quick Cards Overview */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-sm font-black text-slate-900 mb-3">Recently Active Digital Cards</h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    {cards.slice(0, 5).map(c => (
                      <div key={c.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-900">{c.company_name}</span>
                          <span className="text-[10px] text-slate-400 ml-2">/{c.slug}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {c.status}
                          </span>
                          <button
                            onClick={() => setView('public-card', c.slug)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 2. RECHARGE WALLET VIEW matching frame_135s.png */}
            {activeMenu === 'recharge' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 max-w-lg mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-2">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">💳 Recharge Wallet</h3>
                  <p className="text-xs text-slate-500">Credit reseller wallet balance to enable client card creation</p>
                </div>

                {rechargeMsg && (
                  <div className={`p-3 rounded-xl text-xs font-bold text-center ${
                    rechargeMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {rechargeMsg}
                  </div>
                )}

                <form onSubmit={handleRechargeWallet} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Franchisee Email Id *</label>
                    <input
                      type="email"
                      required
                      value={rechargeEmail}
                      onChange={(e) => setRechargeEmail(e.target.value)}
                      placeholder="e.g. franchise@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Amount (10-100000 Rs Only) *</label>
                    <input
                      type="number"
                      required
                      min="10"
                      max="100000"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      placeholder="1000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Comment</label>
                    <input
                      type="text"
                      value={rechargeComment}
                      onChange={(e) => setRechargeComment(e.target.value)}
                      placeholder="Promotional Amount"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold shadow-md shadow-sky-500/25 transition"
                  >
                    Submit & Credit Balance
                  </button>
                </form>
              </div>
            )}

            {/* 3. MANAGE USERS VIEW */}
            {activeMenu === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">Registered Users</h3>
                  <span className="text-xs text-slate-500">{users.length} accounts</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4 text-center">Cards</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold">#{u.id}</td>
                          <td className="py-3 px-4 font-extrabold text-slate-900">{u.name}</td>
                          <td className="py-3 px-4">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold">{u.cards_count || 0}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. MANAGE ALL CARDS VIEW */}
            {activeMenu === 'user_cards' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">All Portal Visiting Cards</h3>
                  <span className="text-xs text-slate-500">{cards.length} cards total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Company Name</th>
                        <th className="py-3 px-4">Created By</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Payment</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {cards.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold">#{c.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-slate-900">{c.company_name}</div>
                            <div className="text-[10px] text-slate-400">/{c.slug}</div>
                          </td>
                          <td className="py-3 px-4 capitalize">{c.created_by_role}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleCardStatus(c.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {c.status}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                              {c.payment_status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setView('public-card', c.slug)}
                                className="p-1 text-slate-500 hover:text-indigo-600 transition"
                                title="View Card"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onEditCard(c.id)}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. SYSTEM SETTINGS VIEW */}
            {activeMenu === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Portal & Payment Gateway Settings</h3>
                  <p className="text-xs text-slate-500">Configure prices, Razorpay keys, and site metadata</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Standard Card Price (₹)</label>
                      <input
                        type="number"
                        value={settingsData.card_price || 999}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, card_price: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Franchisee Cost Per Card (₹)</label>
                      <input
                        type="number"
                        value={settingsData.franchise_card_price || 150}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, franchise_card_price: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Razorpay Key ID</label>
                      <input
                        type="text"
                        value={settingsData.razorpay_key || ''}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, razorpay_key: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Razorpay Key Secret</label>
                      <input
                        type="password"
                        value={settingsData.razorpay_secret || ''}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, razorpay_secret: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold shadow-md transition"
                  >
                    Save Settings
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
