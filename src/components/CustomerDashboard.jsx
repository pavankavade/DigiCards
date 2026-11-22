import React, { useState, useEffect } from "react";
import { 
  Edit3, Eye, Share2, CreditCard, Power, Lock, 
  ExternalLink, Copy, Check, MessageSquare, AlertCircle, Sparkles,
  Phone, Mail, Calendar, Send, ShieldCheck, UserCheck, Plus, Sparkle
} from "lucide-react";
import PaymentModal from "./PaymentModal";
import { useLanguage } from "../i18n/LanguageContext";

export default function CustomerDashboard({ currentUser, setView, onEditCard, onLogout }) {
  const { t } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [paymentCard, setPaymentCard] = useState(null);
  const [activeEnquiryCard, setActiveEnquiryCard] = useState(null);
  const [cardEnquiries, setCardEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // Self-Service Card Modal
  const [showSelfServiceModal, setShowSelfServiceModal] = useState(false);
  const [selfCompanyName, setSelfCompanyName] = useState("");
  const [selfTemplate, setSelfTemplate] = useState("executive");
  const [creatingSelfCard, setCreatingSelfCard] = useState(false);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cards");
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

  const copyShareLink = (slug, id) => {
    const url = `${window.location.origin}/card/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyCustomerCode = () => {
    if (!currentUser?.customer_code) return;
    navigator.clipboard.writeText(currentUser.customer_code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Direct Self-Service Card Creation
  const handleCreateSelfServiceCard = async (e) => {
    e.preventDefault();
    if (!selfCompanyName.trim()) return;
    setCreatingSelfCard(true);
    try {
      const res = await fetch("/api/cards/self-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: selfCompanyName,
          personal_name: currentUser?.name || "Client",
          phone: currentUser?.phone || "",
          email: currentUser?.email || "",
          layout_template: selfTemplate
        })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to create card");
      setShowSelfServiceModal(false);
      setSelfCompanyName("");
      fetchCards();
      onEditCard(d.card.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreatingSelfCard(false);
    }
  };

  // View Enquiries for a specific card
  const handleViewEnquiries = async (card) => {
    setActiveEnquiryCard(card);
    setLoadingEnquiries(true);
    try {
      const res = await fetch(`/api/cards/${card.id}/enquiries`);
      const data = await res.json();
      setCardEnquiries(data.enquiries || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading your digital cards...</span>
        </div>
      </div>
    );
  }

  const isFranchiseManaged = Boolean(currentUser?.franchise_id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 pb-16 font-[Plus_Jakarta_Sans,sans-serif] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Customer Account & Security Code Banner */}
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase border flex items-center gap-1 ${
                isFranchiseManaged
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}>
                <UserCheck className="w-3 h-3" />
                {isFranchiseManaged ? "Franchise Partner Managed" : "Direct Self-Service Account"}
              </span>
              <h3 className="font-extrabold text-base">Welcome, {currentUser?.name || "Client"}</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              {isFranchiseManaged 
                ? "Your digital cards are managed by your appointed Franchise Partner. Share your Customer Security Code with your partner to issue new cards."
                : "You are registered directly with DigiCards. You can create and customize self-service cards directly or upgrade to a 1-year plan."}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Customer Security Code Badge */}
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-3">
              <div>
                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Your Customer Security Code</div>
                <div className="font-mono font-black text-sm text-white tracking-wide">
                  {currentUser?.customer_code || "CUST-DIRECT"}
                </div>
              </div>
              <button
                onClick={copyCustomerCode}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
                title="Copy Customer Code"
              >
                {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-300" />}
              </button>
            </div>

            {isFranchiseManaged && (
              <a
                href="https://api.whatsapp.com/send?phone=917367063161&text=Hello%20Partner,%20I%20need%20assistance%20with%20my%20Digital%20Card."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Partner</span>
              </a>
            )}
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('myCards', 'Your Digital Cards')}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">View analytics, lead inquiries, download vCard, and preview your active cards</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSelfServiceModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Self-Service Card</span>
            </button>
            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              Total Cards: {cards.length}
            </div>
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                  <th className="py-3.5 px-4 text-center rounded-l-xl">Card ID</th>
                  <th className="py-3.5 px-4">Company & Identity</th>
                  <th className="py-3.5 px-4 text-center">Subscription</th>
                  <th className="py-3.5 px-4 text-center">Card Status</th>
                  <th className="py-3.5 px-4 text-center">Total Views</th>
                  <th className="py-3.5 px-4 text-center">Inquiries</th>
                  <th className="py-3.5 px-4 text-center">vCard</th>
                  <th className="py-3.5 px-4 text-center">Share</th>
                  <th className="py-3.5 px-4 text-center rounded-r-xl">Live Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {cards.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400 font-bold">
                      No cards assigned to your account yet. Contact your Franchise Partner to issue a card.
                    </td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white">#{card.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">{card.company_name}</span>
                          <button
                            onClick={() => setView("public-card", card.slug)}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                            title="Preview Public Card"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">/card/{card.slug}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 capitalize border border-indigo-200 dark:border-indigo-800/40">
                            {card.layout_template || 'executive'}
                          </span>
                        </div>
                      </td>

                      {/* Payment / Deal Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          card.payment_status === "paid"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                        }`}>
                          {card.payment_status === "paid" ? "Paid Active" : "Trial Card"}
                        </span>
                      </td>

                      {/* Card Status: Read-Only for Customer */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                            card.status === "active"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${card.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {card.status === "active" ? "Active" : "Paused"}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">Managed by Franchise</span>
                        </div>
                      </td>

                      {/* Views Count */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                        {card.views_count || 0}
                      </td>

                      {/* View Leads / Inquiries */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleViewEnquiries(card)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs inline-flex items-center gap-1 transition shadow-xs cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Leads</span>
                        </button>
                      </td>

                      {/* RFC 6350 vCard Direct Export */}
                      <td className="py-3.5 px-4 text-center">
                        <a
                          href={`/api/cards/public/${card.slug}/vcard`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                          title="Download Contact vCard"
                        >
                          <span>vCard</span>
                        </a>
                      </td>

                      {/* Share Icons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my digital visiting card: ${window.location.origin}/card/${card.slug}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                            title="Share on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => copyShareLink(card.slug, card.id)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                            title="Copy Card Link"
                          >
                            {copiedId === card.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Live View Link & Studio */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setView("public-card", card.slug)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1 shadow-sm cursor-pointer text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View
                          </button>
                          {card.is_self_service === 1 && (
                            <button
                              onClick={() => onEditCard(card.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 shadow-sm cursor-pointer text-xs"
                              title="Edit Card in Studio"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Studio
                            </button>
                          )}
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

      {/* Self-Service Card Creation Modal */}
      {showSelfServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Create Self-Service Digital Card</h3>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 text-xs font-semibold">
              Create and customize your business card directly. You can edit content, themes, and social links anytime in the Studio.
            </div>

            <form onSubmit={handleCreateSelfServiceCard} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={selfCompanyName}
                  onChange={(e) => setSelfCompanyName(e.target.value)}
                  placeholder="e.g. Apex Global Solutions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Architecture Design</label>
                <select
                  value={selfTemplate}
                  onChange={(e) => setSelfTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:border-indigo-500"
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
                  onClick={() => setShowSelfServiceModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingSelfCard}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {creatingSelfCard ? "Creating Card..." : "Create & Launch Studio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leads / Inquiries Modal */}
      {activeEnquiryCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Leads for {activeEnquiryCard.company_name}
                </h3>
                <p className="text-xs text-slate-500">Inquiries submitted by visitors directly on your digital card</p>
              </div>
              <button
                onClick={() => setActiveEnquiryCard(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {loadingEnquiries ? (
                <div className="py-8 text-center text-slate-400 text-xs">Loading inquiries...</div>
              ) : cardEnquiries.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No inquiries received yet. Share your card link to generate leads!
                </div>
              ) : (
                cardEnquiries.map((enq) => (
                  <div key={enq.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                    <div className="space-y-0.5 text-xs">
                      <div className="font-extrabold text-slate-900 dark:text-white">{enq.name}</div>
                      <div className="text-slate-600 dark:text-slate-400 font-mono flex items-center gap-2">
                        <span>📞 {enq.phone}</span>
                        {enq.email && <span>✉️ {enq.email}</span>}
                      </div>
                      {enq.message && (
                        <p className="text-slate-700 dark:text-slate-300 italic pt-1 text-[11px]">"{enq.message}"</p>
                      )}
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=${enq.phone.replace(/[^0-9]/g, "").length === 10 ? "91" + enq.phone.replace(/[^0-9]/g, "") : enq.phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(`Hello ${enq.name}, thank you for contacting ${activeEnquiryCard.company_name}. How can we assist you?`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Reply on WhatsApp
                    </a>
                  </div>
                ))
              )}
            </div>
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
