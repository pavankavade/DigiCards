import React, { useState, useEffect } from "react";
import { 
  Plus, Users, CreditCard, Shield, Wallet, Settings, Power, 
  Search, ExternalLink, CheckCircle2, AlertCircle, Edit3, Trash2,
  MessageSquare, Phone, Check, RefreshCw, Mail, Eye, Sparkles, Send,
  Copy, Key, UserX, UserCheck, CheckCircle, XCircle
} from "lucide-react";

export default function AdminDashboard({ currentUser, setView, onEditCard, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("deals"); // "deals", "dashboard", "users", "leads", "settings", "franchisees"
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [franchiseRequests, setFranchiseRequests] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [cards, setCards] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [settingsData, setSettingsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [franchises, setFranchises] = useState([]);
  const [newFranName, setNewFranName] = useState("");
  const [newFranEmail, setNewFranEmail] = useState("");
  const [newFranPhone, setNewFranPhone] = useState("");
  const [newFranPassword, setNewFranPassword] = useState("");
  const [newFranQuota, setNewFranQuota] = useState("50");
  const [appointMsg, setAppointMsg] = useState("");
  const [appointSubmitting, setAppointSubmitting] = useState(false);

  // Recharge form state (Franchisee modular)
  const [rechargeEmail, setRechargeEmail] = useState("franchise@example.com");
  const [rechargeAmount, setRechargeAmount] = useState("1000");
  const [rechargeComment, setRechargeComment] = useState("Promotional Amount");
  const [rechargeMsg, setRechargeMsg] = useState("");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, usersRes, cardsRes, setRes, enqRes, franRes, custRes, franReqRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/users"),
        fetch("/api/cards"),
        fetch("/api/admin/settings"),
        fetch("/api/admin/enquiries"),
        fetch("/api/admin/franchises"),
        fetch("/api/admin/customers"),
        fetch("/api/admin/franchise-requests")
      ]);

      const dJson = await dashRes.json();
      const uJson = await usersRes.json();
      const cJson = await cardsRes.json();
      const sJson = await setRes.json();
      const eJson = await enqRes.json();
      const fJson = await franRes.json();
      const custJson = await custRes.json();
      const franReqJson = await franReqRes.json();

      setSummary(dJson.summary);
      setUsers(uJson.users || []);
      setCards(cJson.cards || []);
      setSettingsData(sJson.settings || {});
      setEnquiries(eJson.enquiries || []);
      setFranchises(fJson.franchises || []);
      setCustomers(custJson.customers || []);
      setFranchiseRequests(franReqJson.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const copyText = (txt, label) => {
    navigator.clipboard.writeText(txt);
    setCopyFeedback(`${label} copied!`);
    setTimeout(() => setCopyFeedback(""), 2000);
  };

  // Franchise Approval / Rejection Handlers
  const handleApproveFranchise = async (id, name) => {
    try {
      const res = await fetch(`/api/admin/franchises/${id}/approve`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");
      alert(`✓ Approved franchise partner: ${name}`);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectFranchise = async (id, name) => {
    if (!window.confirm(`Are you sure you want to reject the application from ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/franchises/${id}/reject`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rejection failed");
      alert(`Application from ${name} rejected.`);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Remove Franchise Partner
  const handleRemoveFranchise = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove franchise partner "${name}"? Their client cards and accounts will remain safe and be managed directly by Super Admin.`)) return;
    try {
      const res = await fetch(`/api/admin/franchises/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      alert(data.message || `Franchise partner ${name} removed.`);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle Customer Status (Active vs Suspended)
  const handleToggleCustomerStatus = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/toggle-status`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle status");
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Customer Account
  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete customer account "${name}" and all their digital cards? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete customer");
      alert(data.message || "Customer deleted.");
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Super Admin Direct Card Payment & Deal Approval
  const handleUpdatePaymentStatus = async (cardId, newPayStatus, newCardStatus) => {
    try {
      const res = await fetch(`/api/admin/cards/${cardId}/payment-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: newPayStatus, status: newCardStatus })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle Active / Deactivated
  const handleToggleCardStatus = async (cardId) => {
    try {
      await fetch(`/api/cards/${cardId}/toggle-status`, { method: "POST" });
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Card
  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card? This action cannot be undone.")) return;
    try {
      await fetch(`/api/cards/${cardId}`, { method: "DELETE" });
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData)
      });
      if (res.ok) alert("Settings saved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Franchisee Recharge
  const handleRechargeWallet = async (e) => {
    e.preventDefault();
    setRechargeMsg("");
    try {
      const res = await fetch("/api/admin/recharge-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: rechargeEmail,
          amount: rechargeAmount,
          comment: rechargeComment
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Recharge failed");
      setRechargeMsg(`✓ ${data.message}`);
      fetchAdminData();
    } catch (err) {
      setRechargeMsg(`✗ ${err.message}`);
    }
  };

  // Appoint New Franchise Partner
  const handleAppointFranchise = async (e) => {
    e.preventDefault();
    setAppointSubmitting(true);
    setAppointMsg("");
    try {
      const res = await fetch("/api/admin/franchises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFranName,
          email: newFranEmail,
          phone: newFranPhone,
          password: newFranPassword,
          card_quota: newFranQuota
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to appoint franchise");
      setAppointMsg(`✓ Franchise appointed: ${newFranName} (${newFranQuota} Card Pack)`);
      setNewFranName("");
      setNewFranEmail("");
      setNewFranPhone("");
      setNewFranPassword("");
      fetchAdminData();
    } catch (err) {
      setAppointMsg(`✕ ${err.message}`);
    } finally {
      setAppointSubmitting(false);
    }
  };

  // Recharge Franchise Quota Pack
  const handleRechargeQuota = async (franchiseId, quotaToAdd, packAmount = 0, packName = "Quota Pack") => {
    try {
      const res = await fetch(`/api/admin/franchises/${franchiseId}/recharge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          additional_quota: quotaToAdd,
          amount: packAmount,
          pack_name: packName
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Recharge failed");
      alert(data.message);
      fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Loading Super Admin Control Center...</p>
        </div>
      </div>
    );
  }

  // Filtered cards for deals management
  const filteredCards = cards.filter(c => {
    const matchesSearch = c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.phone?.includes(searchTerm);
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "trial") return matchesSearch && c.payment_status === "trial";
    if (filterStatus === "paid") return matchesSearch && c.payment_status === "paid";
    if (filterStatus === "active") return matchesSearch && c.status === "active";
    if (filterStatus === "deactivated") return matchesSearch && c.status === "deactivated";
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16 font-[Plus_Jakarta_Sans,sans-serif]">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-3.5 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black shadow-md">
              ⚡
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-none text-white">SUPER ADMIN CENTER</h1>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                Direct Deals & Platform Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
            <button onClick={() => setView("landing")} className="hover:text-white transition">
              Public Portal
            </button>
            <span className="opacity-30">|</span>
            <span className="text-emerald-400 font-mono">👑 {currentUser?.email || "admin@example.com"}</span>
            <span className="opacity-30">|</span>
            <button onClick={onLogout} className="hover:text-rose-400 flex items-center gap-1 transition">
              <Power className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-1.5">
            <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 mb-3 text-center">
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">Admin Control</span>
              <p className="text-xs text-indigo-950 font-bold mt-0.5">Direct Super Admin ↔ Customer Deals</p>
            </div>

            {[
              { id: "deals", label: "🤝 Customer Deals & Cards", badge: summary.trialCards ? `${summary.trialCards} Trial` : null, badgeColor: "bg-amber-100 text-amber-800" },
              { id: "dashboard", label: "📊 Analytics & Overview", badge: null },
              { id: "users", label: "👥 Customers & Franchise Mapping", badge: `${customers.length}`, badgeColor: "bg-indigo-100 text-indigo-700" },
              { id: "franchisees", label: "💼 Franchise Network & Requests", badge: franchiseRequests.length ? `${franchiseRequests.length} Pending` : `${franchises.length}`, badgeColor: franchiseRequests.length ? "bg-rose-500 text-white animate-pulse" : "bg-purple-100 text-purple-700" },
              { id: "leads", label: "📥 Leads & Enquiries", badge: `${enquiries.length}`, badgeColor: "bg-emerald-100 text-emerald-800" },
              { id: "settings", label: "⚙️ Pricing & Deal Settings", badge: null },
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition text-left ${
                  activeMenu === menu.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{menu.label}</span>
                {menu.badge && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${activeMenu === menu.id ? "bg-white/20 text-white" : menu.badgeColor}`}>
                    {menu.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-9 space-y-6">

            {/* TAB 1: DIRECT CUSTOMER DEALS & ACTIVATIONS */}
            {activeMenu === "deals" && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 tracking-tight">Direct Customer Deals & Cards</h2>
                      <p className="text-xs text-slate-500">Approve customer subscriptions, activate 1-year plans, or message customers on WhatsApp</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {["all", "trial", "paid", "active", "deactivated"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setFilterStatus(st)}
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                            filterStatus === st
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="mt-4 mb-4">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by company name, slug, or mobile number..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Deals Cards Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold rounded-xl">
                          <th className="py-3 px-3 text-center rounded-l-xl">ID</th>
                          <th className="py-3 px-3">Company & Slug</th>
                          <th className="py-3 px-3 text-center">Owner / Contact</th>
                          <th className="py-3 px-3 text-center">Payment Status</th>
                          <th className="py-3 px-3 text-center">Card Status</th>
                          <th className="py-3 px-3 text-center">Views</th>
                          <th className="py-3 px-3 text-center rounded-r-xl">Deal Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredCards.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="py-8 text-center text-slate-400 font-semibold">
                              No matching digital cards found.
                            </td>
                          </tr>
                        ) : (
                          filteredCards.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-3 text-center font-bold text-slate-900">#{c.id}</td>
                              <td className="py-3 px-3">
                                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                  <span>{c.company_name}</span>
                                  <button
                                    onClick={() => setView("public-card", c.slug)}
                                    className="p-0.5 text-indigo-500 hover:text-indigo-700"
                                    title="View Live Card"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">/card/{c.slug}</span>
                              </td>

                              <td className="py-3 px-3 text-center">
                                <div className="text-slate-800 font-bold">{c.owner_name || c.personal_name || "Customer"}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{c.phone || c.owner_email || "N/A"}</div>
                              </td>

                              {/* Payment Status */}
                              <td className="py-3 px-3 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  c.payment_status === "paid"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-amber-100 text-amber-800 border border-amber-300"
                                }`}>
                                  {c.payment_status === "paid" ? "Paid Deal" : "Free Trial"}
                                </span>
                              </td>

                              {/* Card Active / Inactive */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleToggleCardStatus(c.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 mx-auto ${
                                    c.status === "active"
                                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                      : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                                  }`}
                                  title="Click to toggle status"
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                                  {c.status === "active" ? "Active" : "Paused"}
                                </button>
                              </td>

                              <td className="py-3 px-3 text-center font-bold text-slate-700">
                                {c.views_count || 0}
                              </td>

                              {/* Direct Deal Actions */}
                              <td className="py-3 px-3 text-center">
                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                  {/* WhatsApp Deal Closing Button */}
                                  {c.phone && (
                                    <a
                                      href={`https://api.whatsapp.com/send?phone=${c.phone.replace(/[^0-9]/g, "").length === 10 ? "91" + c.phone.replace(/[^0-9]/g, "") : c.phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(`Hello ${c.personal_name || c.company_name}, this is DigiCards Super Admin regarding your digital visiting card (${c.company_name}). I am happy to help you activate your 1-year premium deal!`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition"
                                      title="Chat with Customer on WhatsApp to Close Deal"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </a>
                                  )}

                                  {/* Toggle Paid / Trial Deal */}
                                  {c.payment_status !== "paid" ? (
                                    <button
                                      onClick={() => handleUpdatePaymentStatus(c.id, "paid", "active")}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] shadow transition"
                                      title="Mark as Paid & Activate (1 Year)"
                                    >
                                      Approve Deal
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUpdatePaymentStatus(c.id, "trial", "active")}
                                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] transition"
                                      title="Revert to Trial"
                                    >
                                      Set Trial
                                    </button>
                                  )}

                                  {/* Edit Card */}
                                  <button
                                    onClick={() => onEditCard(c.id)}
                                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                                    title="Edit in Studio"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Card */}
                                  <button
                                    onClick={() => handleDeleteCard(c.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
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
              </div>
            )}

            {/* TAB 2: ANALYTICS & OVERVIEW */}
            {activeMenu === "dashboard" && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Digital Cards", val: summary.totalCards, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Active Live Cards", val: summary.activeCards, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Pending Trial Cards", val: summary.trialCards, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Total Platform Leads", val: enquiries.length, color: "text-rose-600", bg: "bg-rose-50" }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
                      <div className={`text-3xl font-black mt-1 ${s.color}`}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Revenue Card */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">Super Admin Revenue Tracker</span>
                    <h3 className="text-2xl font-black text-white mt-1">₹{summary.paymentTotal} Estimated Value</h3>
                    <p className="text-xs text-slate-400">Based on {summary.totalCards - summary.trialCards} paid cards at ₹{settingsData.card_price || "999"}/year</p>
                  </div>
                  <button
                    onClick={() => setActiveMenu("deals")}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg transition"
                  >
                    View Active Deals →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOMERS & FRANCHISE PARTNER MAPPING */}
            {activeMenu === "users" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-black mb-1">
                      <Users size={13} />
                      Platform Customer Accounts & Hierarchy
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Customers & Franchise Partner Mapping</h3>
                    <p className="text-xs text-slate-500">
                      Super Admin master view of all customers, their unguessable Customer Security Codes, and their mapped Franchise Partner.
                    </p>
                  </div>

                  <button 
                    onClick={fetchAdminData}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>

                {/* Quick Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Customer Accounts</span>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">{customers.length}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] font-extrabold uppercase text-purple-600 tracking-wider">Franchise-Linked Clients</span>
                    <div className="text-2xl font-black text-purple-900 mt-0.5">
                      {customers.filter(c => c.franchise_id).length}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">Direct / Self-Service</span>
                    <div className="text-2xl font-black text-emerald-900 mt-0.5">
                      {customers.filter(c => !c.franchise_id).length}
                    </div>
                  </div>
                </div>

                {/* Copy Notification Toast */}
                {copyFeedback && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-600" /> {copyFeedback}
                  </div>
                )}

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search by customer name, email, phone, customer code (CUST-...), or franchise name/code..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Customers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="py-3.5 px-3 rounded-l-xl">Customer ID</th>
                        <th className="py-3.5 px-3">Customer Identity</th>
                        <th className="py-3.5 px-3">Customer Code</th>
                        <th className="py-3.5 px-3">Assigned Franchise Partner</th>
                        <th className="py-3.5 px-3 text-center">Cards</th>
                        <th className="py-3.5 px-3 text-center">Status</th>
                        <th className="py-3.5 px-3 text-right rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {customers.filter(c => {
                        const q = customerSearch.toLowerCase();
                        return (
                          (c.name && c.name.toLowerCase().includes(q)) ||
                          (c.email && c.email.toLowerCase().includes(q)) ||
                          (c.phone && c.phone.includes(q)) ||
                          (c.customer_code && c.customer_code.toLowerCase().includes(q)) ||
                          (c.franchise_name && c.franchise_name.toLowerCase().includes(q)) ||
                          (c.franchise_code && c.franchise_code.toLowerCase().includes(q))
                        );
                      }).length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold">
                            No customer records found matching your search.
                          </td>
                        </tr>
                      ) : (
                        customers
                          .filter(c => {
                            const q = customerSearch.toLowerCase();
                            return (
                              (c.name && c.name.toLowerCase().includes(q)) ||
                              (c.email && c.email.toLowerCase().includes(q)) ||
                              (c.phone && c.phone.includes(q)) ||
                              (c.customer_code && c.customer_code.toLowerCase().includes(q)) ||
                              (c.franchise_name && c.franchise_name.toLowerCase().includes(q)) ||
                              (c.franchise_code && c.franchise_code.toLowerCase().includes(q))
                            );
                          })
                          .map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3.5 px-3 font-bold text-slate-900">#{c.id}</td>
                              <td className="py-3.5 px-3">
                                <div className="font-extrabold text-slate-900 text-sm">{c.name}</div>
                                <div className="text-[11px] text-slate-500 font-mono">{c.phone || "No phone"} • {c.email}</div>
                              </td>
                              <td className="py-3.5 px-3">
                                {c.customer_code ? (
                                  <button
                                    onClick={() => copyText(c.customer_code, "Customer Code")}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-[11px] inline-flex items-center gap-1.5 transition cursor-pointer border border-slate-300"
                                    title="Click to copy Customer Code"
                                  >
                                    <span>{c.customer_code}</span>
                                    <Copy size={11} className="text-slate-500" />
                                  </button>
                                ) : (
                                  <span className="text-slate-400 italic">None</span>
                                )}
                              </td>
                              <td className="py-3.5 px-3">
                                {c.franchise_id ? (
                                  <div className="flex flex-col items-start gap-0.5">
                                    <span className="font-bold text-purple-900 text-xs">
                                      🏢 {c.franchise_name}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                      {c.franchise_code || `FRAN-ID#${c.franchise_id}`}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Direct (Super Admin)
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-3 text-center font-black text-indigo-600 text-sm">
                                {c.cards_count || 0}
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <button
                                  onClick={() => handleToggleCustomerStatus(c.id)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition cursor-pointer ${
                                    c.status === "suspended"
                                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  }`}
                                  title="Click to toggle Active / Suspended"
                                >
                                  {c.status === "suspended" ? "Suspended" : "Active"}
                                </button>
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleToggleCustomerStatus(c.id)}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                                    title={c.status === "suspended" ? "Unsuspend account" : "Suspend account"}
                                  >
                                    {c.status === "suspended" ? <UserCheck size={14} className="text-emerald-600" /> : <UserX size={14} className="text-amber-600" />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomer(c.id, c.name)}
                                    className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                    title="Delete Customer Account"
                                  >
                                    <Trash2 size={14} />
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

            {/* TAB 4: LEADS & ENQUIRIES */}
            {activeMenu === "leads" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">All Platform Inquiries & Leads ({enquiries.length})</h3>
                    <p className="text-xs text-slate-500">Incoming inquiries submitted by visitors across all digital business cards</p>
                  </div>
                  <button onClick={fetchAdminData} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="py-3 px-3 rounded-l-xl">ID</th>
                        <th className="py-3 px-3">Card Name</th>
                        <th className="py-3 px-3">Visitor Name</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3">Message</th>
                        <th className="py-3 px-3 text-center rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {enquiries.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-400">
                            No inquiries recorded yet.
                          </td>
                        </tr>
                      ) : (
                        enquiries.map((e) => (
                          <tr key={e.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-bold text-slate-900">#{e.id}</td>
                            <td className="py-3 px-3 font-extrabold text-slate-900">
                              <div>{e.company_name}</div>
                              <span className="text-[10px] text-slate-400 font-mono">/card/{e.slug}</span>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">{e.name}</td>
                            <td className="py-3 px-3 font-mono">
                              <div>{e.phone}</div>
                              <span className="text-[10px] text-slate-400">{e.email}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-600 max-w-xs">{e.message || "N/A"}</td>
                            <td className="py-3 px-3 text-center">
                              {e.phone && (
                                <a
                                  href={`https://api.whatsapp.com/send?phone=${e.phone.replace(/[^0-9]/g, "").length === 10 ? "91" + e.phone.replace(/[^0-9]/g, "") : e.phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(`Hello ${e.name}, regarding your inquiry on ${e.company_name} digital visiting card...`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-1 shadow-sm transition text-[10px] font-bold"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: SYSTEM & DEAL PRICING SETTINGS */}
            {activeMenu === "settings" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 max-w-xl mx-auto space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Deal Pricing & System Settings</h3>
                  <p className="text-xs text-slate-500">Configure standard pricing, contact info, and deal closing parameters</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Standard Card Annual Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={settingsData.card_price || "999"}
                      onChange={(e) => setSettingsData(prev => ({ ...prev, card_price: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Free Trial Duration (Days) *</label>
                    <input
                      type="number"
                      required
                      value={settingsData.trial_days || "7"}
                      onChange={(e) => setSettingsData(prev => ({ ...prev, trial_days: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Super Admin WhatsApp for Deals *</label>
                    <input
                      type="text"
                      required
                      value={settingsData.admin_whatsapp || "7367063161"}
                      onChange={(e) => setSettingsData(prev => ({ ...prev, admin_whatsapp: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={settingsData.contact_email || "support@digicards.com"}
                      onChange={(e) => setSettingsData(prev => ({ ...prev, contact_email: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition"
                  >
                    Save Deal & System Settings
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: FRANCHISEE PARTNER NETWORK & QUOTA MANAGEMENT */}
            {activeMenu === "franchisees" && (
              <div className="space-y-8">
                {/* Information Header Card */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold mb-3">
                        <Sparkles size={14} className="text-purple-300" />
                        Franchise Partner & Card Pack Ecosystem
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-white">Franchise Partner Network</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                        Appoint trusted franchise partners, approve incoming franchise applications, assign bulk card packs (e.g. 50 cards pack or custom packages), 
                        and supervise client card production. Franchises onboard customers and build their cards, while customers enjoy read-only access to their views, analytics, and lead inquiries.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-center">
                        <div className="text-2xl font-black text-amber-300">{franchises.length}</div>
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Active Partners</div>
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-center">
                        <div className="text-2xl font-black text-rose-300">{franchiseRequests.length}</div>
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Pending Approvals</div>
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-center">
                        <div className="text-2xl font-black text-emerald-300">
                          {franchises.reduce((sum, f) => sum + (f.card_quota || 0), 0)}
                        </div>
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Quota Pool</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION: PENDING FRANCHISE APPLICATIONS */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${franchiseRequests.length > 0 ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`} />
                      <h4 className="font-black text-slate-900 text-base">
                        Pending Franchise Applications ({franchiseRequests.length})
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500">
                      Incoming applications submitted via "Apply for Franchise" portal
                    </span>
                  </div>

                  {franchiseRequests.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>No pending franchise applications. All registrations are approved and active.</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white font-bold">
                            <th className="py-3 px-3 rounded-l-xl">Applicant ID</th>
                            <th className="py-3 px-3">Partner / Agency</th>
                            <th className="py-3 px-3">Contact</th>
                            <th className="py-3 px-3">Assigned Franchise Code & PIN</th>
                            <th className="py-3 px-3">Requested On</th>
                            <th className="py-3 px-3 text-right rounded-r-xl">Super Admin Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {franchiseRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3.5 px-3 font-bold text-slate-900">#{req.id}</td>
                              <td className="py-3.5 px-3">
                                <div className="font-extrabold text-slate-900 text-sm">{req.name}</div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                  Pending Review
                                </span>
                              </td>
                              <td className="py-3.5 px-3">
                                <div className="text-slate-800 font-medium">{req.email}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{req.phone || "No phone"}</div>
                              </td>
                              <td className="py-3.5 px-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-mono text-purple-800 font-bold text-xs">{req.franchise_code || "Auto-assign"}</span>
                                  <span className="font-mono text-slate-400 text-[10px]">PIN: {req.franchise_pin || "••••"}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                                {new Date(req.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleApproveFranchise(req.id, req.name)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check size={13} /> Approve (+50 Quota)
                                  </button>
                                  <button
                                    onClick={() => handleRejectFranchise(req.id, req.name)}
                                    className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 size={13} /> Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Appoint New Franchise Partner Form */}
                  <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                    <div>
                      <h4 className="font-black text-slate-900 text-base">Directly Appoint Partner</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Super Admin direct issuance with starter quota.</p>
                    </div>

                    {appointMsg && (
                      <div className={`p-3.5 rounded-2xl text-xs font-bold ${
                        appointMsg.startsWith("✓") ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}>
                        {appointMsg}
                      </div>
                    )}

                    <form onSubmit={handleAppointFranchise} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Partner / Agency Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pune Prime DigiWorks"
                          value={newFranName}
                          onChange={(e) => setNewFranName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Login Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="partner@agency.com"
                          value={newFranEmail}
                          onChange={(e) => setNewFranEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="+91 98765 43210"
                          value={newFranPhone}
                          onChange={(e) => setNewFranPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Temporary Password *</label>
                        <input
                          type="text"
                          required
                          placeholder="Pass@1234"
                          value={newFranPassword}
                          onChange={(e) => setNewFranPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Starter Card Pack Quota</label>
                        <select
                          value={newFranQuota}
                          onChange={(e) => setNewFranQuota(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-bold bg-white"
                        >
                          <option value="25">25 Cards Pack (Starter Partner)</option>
                          <option value="50">50 Cards Pack (Standard Franchise - ₹12,000)</option>
                          <option value="100">100 Cards Pack (Silver Franchise - ₹22,000)</option>
                          <option value="250">250 Cards Pack (Gold Master Partner - ₹50,000)</option>
                          <option value="500">500 Cards Pack (Mega Enterprise Hub)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={appointSubmitting}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md shadow-purple-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Users size={16} />
                        {appointSubmitting ? "Appointing..." : "Appoint & Allocate Quota"}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Appointed Franchise Partners List */}
                  <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-slate-900 text-base">Active Franchise Partners ({franchises.length})</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Manage partner quotas, security codes, and client volume</p>
                      </div>
                      <button 
                        onClick={fetchAdminData}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        title="Refresh Partners"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>

                    {franchises.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                        <Users size={36} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-600">No Franchise Partners Appointed Yet</p>
                        <p className="text-xs text-slate-400 mt-1">Use the appointment form on the left to add your first partner.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                              <th className="py-3 px-3">Partner / Agency</th>
                              <th className="py-3 px-3">Franchise Code & PIN</th>
                              <th className="py-3 px-3 text-center">Clients</th>
                              <th className="py-3 px-3 text-center">Cards</th>
                              <th className="py-3 px-3 text-center">Quota Left</th>
                              <th className="py-3 px-3 text-right">Pack / Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {franchises.map((f) => (
                              <tr key={f.id} className="hover:bg-slate-50/70 transition">
                                <td className="py-3 px-3">
                                  <div className="font-black text-slate-900">{f.name}</div>
                                  <div className="text-[11px] text-slate-500">{f.email}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{f.phone || "—"}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex flex-col items-start gap-1">
                                    <button
                                      onClick={() => copyText(f.franchise_code, "Franchise Code")}
                                      className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono font-bold text-[10px] border border-purple-200 inline-flex items-center gap-1 cursor-pointer"
                                      title="Copy Franchise Code"
                                    >
                                      <span>{f.franchise_code || `FRAN-ID#${f.id}`}</span>
                                      <Copy size={10} />
                                    </button>
                                    <span className="text-[10px] font-mono text-slate-500">
                                      PIN: <strong>{f.franchise_pin || "—"}</strong>
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-slate-700">
                                  {f.customers_count || 0}
                                </td>
                                <td className="py-3 px-3 text-center font-black text-slate-900">
                                  {f.cards_created || 0}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${
                                    (f.card_quota || 0) > 10
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : (f.card_quota || 0) > 0
                                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                                      : "bg-rose-100 text-rose-800 border border-rose-300"
                                  }`}>
                                    {f.card_quota || 0}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleRechargeQuota(f.id, 25, 6000, "25 Cards Pack")}
                                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-purple-900 font-bold text-[10px] transition cursor-pointer"
                                      title="Add 25 Cards"
                                    >
                                      +25
                                    </button>
                                    <button
                                      onClick={() => handleRechargeQuota(f.id, 50, 11000, "50 Cards Pack")}
                                      className="px-2 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[10px] transition cursor-pointer"
                                      title="Add 50 Cards"
                                    >
                                      +50
                                    </button>
                                    <button
                                      onClick={() => handleRemoveFranchise(f.id, f.name)}
                                      className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                      title="Remove Franchise Partner"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
