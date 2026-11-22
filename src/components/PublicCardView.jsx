import React, { useState, useEffect } from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ChevronRight, AlertTriangle, Sparkles, Building, QrCode, Smartphone,
  Monitor, ShieldCheck, Clock, CheckCircle2, X, Eye, ArrowRight,
  ChevronDown, Award, Layers, Cpu, Zap
} from "lucide-react";
import QRCode from "qrcode";
import { THEMES, THEME_CATEGORIES, getThemeById } from "../themes";
import PaymentModal from "./PaymentModal";

// 10 Distinct Structural Layout Templates
import ExecutiveTemplate from "./card-templates/ExecutiveTemplate";
import EditorialTemplate from "./card-templates/EditorialTemplate";
import CyberTemplate from "./card-templates/CyberTemplate";
import SplitTemplate from "./card-templates/SplitTemplate";
import CompactTemplate from "./card-templates/CompactTemplate";
import RoyaleTemplate from "./card-templates/RoyaleTemplate";
import NeoGlassTemplate from "./card-templates/NeoGlassTemplate";
import BentoTemplate from "./card-templates/BentoTemplate";
import BrutalistTemplate from "./card-templates/BrutalistTemplate";
import NordicTemplate from "./card-templates/NordicTemplate";

const CARD_TEMPLATES = {
  executive: ExecutiveTemplate,
  editorial: EditorialTemplate,
  cyber: CyberTemplate,
  split: SplitTemplate,
  compact: CompactTemplate,
  royale: RoyaleTemplate,
  neoglass: NeoGlassTemplate,
  bento: BentoTemplate,
  brutalist: BrutalistTemplate,
  nordic: NordicTemplate
};

const TEMPLATE_METADATA = [
  { id: "executive", name: "Executive", desc: "Curved wave cover, centered floating badge, glass dock", badge: "Signature", icon: Sparkles },
  { id: "editorial", name: "Editorial", desc: "Clean magazine typography, monochrome layout", badge: "Minimalist", icon: Layers },
  { id: "cyber", name: "Cyber HUD", desc: "High-tech terminal, neon border glow, monospace", badge: "Futuristic", icon: Cpu },
  { id: "split", name: "Dynamic Split", desc: "Diagonal split banner, floating modern pill cards", badge: "Modern", icon: Zap },
  { id: "compact", name: "Compact Bio", desc: "iOS Bento style with expandable accordion drawers", badge: "Linktree", icon: Smartphone },
  { id: "royale", name: "Imperial Royale", desc: "Gold gilded accents, Roman serif, velvet luxury crest", badge: "Ultra Luxury", icon: Award },
  { id: "neoglass", name: "NeoGlass Prism", desc: "3D frosted glass, aurora reflections, specular depth", badge: "Glassmorphism", icon: Sparkles },
  { id: "bento", name: "Bento Grid", desc: "Modular asymmetric tiles, Apple & Linear inspired", badge: "Structured", icon: Layers },
  { id: "brutalist", name: "Neo-Brutalist", desc: "3px bold black borders, vibrant pop, retro shadows", badge: "High Impact", icon: Zap },
  { id: "nordic", name: "Nordic Minimal", desc: "Scandinavian quiet luxury, titanium accents, calm whitespace", badge: "Clean", icon: Sparkles }
];

export default function PublicCardView({ slug = "apex-studio", overrideThemeId, onBack }) {
  const [cardData, setCardData] = useState(null);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Viewing & Customization States
  const [activeTab, setActiveTab] = useState("info");
  const [activeThemeId, setActiveThemeId] = useState(overrideThemeId || 26);
  const [selectedTemplate, setSelectedTemplate] = useState("executive");
  const [viewMode, setViewMode] = useState("simulator"); // "simulator" or "expanded"
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Modals
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [structurePickerOpen, setStructurePickerOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Quick Share & Copy
  const [sharePhone, setSharePhone] = useState("");
  const [copiedItem, setCopiedItem] = useState("");

  // Dynamic QR Codes
  const [cardQrUrl, setCardQrUrl] = useState("");
  const [upiQrUrl, setUpiQrUrl] = useState("");

  // Enquiry form state
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryMsg, setEnquiryMsg] = useState("");
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const fetchCard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cards/public/${slug}`);
      if (!res.ok) throw new Error("Card not found");
      const data = await res.json();
      setCardData(data.card);
      setProducts(data.products || []);
      setGallery(data.gallery || []);

      if (data.card.layout_template && CARD_TEMPLATES[data.card.layout_template]) {
        setSelectedTemplate(data.card.layout_template);
      }
      if (!overrideThemeId && data.card.theme_id) {
        setActiveThemeId(data.card.theme_id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCard();
  }, [slug]);

  useEffect(() => {
    if (overrideThemeId) setActiveThemeId(overrideThemeId);
  }, [overrideThemeId]);

  // Generate QR codes
  useEffect(() => {
    if (cardData) {
      const cardUrl = window.location.origin + `/card/${cardData.slug}`;
      QRCode.toDataURL(cardUrl, { width: 300, margin: 2, color: { dark: "#0f172a", light: "#ffffff" } })
        .then(setCardQrUrl)
        .catch(console.error);

      const upiId = cardData.upi_id || cardData.payment_upi_id || "pay@upi";
      const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(cardData.company_name)}&cu=INR`;
      QRCode.toDataURL(upiString, { width: 300, margin: 2, color: { dark: "#0284c7", light: "#ffffff" } })
        .then(setUpiQrUrl)
        .catch(console.error);
    }
  }, [cardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Loading interactive digital card...</p>
        </div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl text-center space-y-4 border border-slate-800 shadow-2xl">
          <AlertTriangle className="w-14 h-14 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold">Card Not Found</h2>
          <p className="text-sm text-slate-400">No active digital visiting card found for "{slug}".</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition shadow-lg shadow-indigo-600/30"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentTheme = getThemeById(activeThemeId);
  const isDeactivated = cardData.status === "deactivated";

  // 1-Click Copy with feedback toast
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(""), 2200);
  };

  // Quick Direct WhatsApp Share
  const handleDirectShare = (e) => {
    e.preventDefault();
    if (!sharePhone.trim()) return;
    const cleanPhone = sharePhone.replace(/[^0-9]/g, "");
    const currentUrl = window.location.origin + `/card/${cardData.slug}`;
    const message = `Hello! Please view and save my Digital Visiting Card & Mini Website:\n*${cardData.company_name}*\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(message)}`, "_blank");
  };

  // 1-Click WhatsApp Order
  const handleOrderWhatsApp = (title, price) => {
    const phone = cardData.whatsapp || cardData.phone || "";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const message = `Hello ${cardData.company_name}, I would like to order / enquire about:\n*${title}*\nPrice: ₹${price}\n\nPlease share availability and order steps.`;
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}&text=${encodeURIComponent(message)}`, "_blank");
  };

  // Enquiry submission
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;
    setEnquirySubmitting(true);
    try {
      const res = await fetch(`/api/cards/${cardData.slug}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: enquiryName,
          phone: enquiryPhone,
          email: enquiryEmail,
          message: enquiryMsg
        })
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      setEnquirySuccess(true);
      setEnquiryName("");
      setEnquiryPhone("");
      setEnquiryEmail("");
      setEnquiryMsg("");
      setTimeout(() => setEnquirySuccess(false), 5000);
    } catch (err) {
      alert(err.message);
    } finally {
      setEnquirySubmitting(false);
    }
  };

  // YouTube Embed Formatter
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };
  const ytEmbed = getYouTubeEmbedUrl(cardData.youtube_video);

  // Filtered themes
  const filteredThemes = selectedCategory === "All" 
    ? THEMES 
    : THEMES.filter(t => t.category === selectedCategory);

  const ActiveTemplate = CARD_TEMPLATES[selectedTemplate] || ExecutiveTemplate;

  const templateProps = {
    cardData,
    products,
    gallery,
    currentTheme,
    activeTab,
    setActiveTab,
    handleCopy,
    copiedItem,
    sharePhone,
    setSharePhone,
    handleDirectShare,
    handleOrderWhatsApp,
    upiQrUrl,
    ytEmbed,
    setLightboxImage,
    enquiryName,
    setEnquiryName,
    enquiryPhone,
    setEnquiryPhone,
    enquiryEmail,
    setEnquiryEmail,
    enquiryMsg,
    setEnquiryMsg,
    enquirySubmitting,
    enquirySuccess,
    handleEnquirySubmit
  };

  return (
    <div className="min-h-screen bg-geometric-3d text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 relative">
      
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 z-40 bg-slate-900/90 backdrop-blur-xl p-3 sm:px-4 rounded-2xl border border-slate-800 text-xs shadow-2xl">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition flex items-center gap-1"
            >
              ← <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <span className="font-extrabold text-white text-sm tracking-tight">{cardData.company_name}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            Verified
          </span>
        </div>

        {/* View Mode, Structure & Theme Switcher Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Desktop Simulator Toggle */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setViewMode("simulator")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition ${
                viewMode === "simulator" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
              title="3D Smartphone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setViewMode("expanded")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition ${
                viewMode === "expanded" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
              title="Expanded Responsive View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full</span>
            </button>
          </div>

          {/* 1. Structure Selector Trigger */}
          <button
            onClick={() => setStructurePickerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-indigo-300 font-bold border border-indigo-500/40 flex items-center gap-1.5 transition shadow"
            title="Switch Card Structure"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="capitalize">{selectedTemplate} Layout</span>
          </button>

          {/* 2. Theme Selector Trigger */}
          <button
            onClick={() => setThemePickerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1.5 transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Theme #{currentTheme.id}</span>
          </button>

          {/* QR Code Modal Trigger */}
          <button
            onClick={() => setQrModalOpen(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 transition border border-slate-700"
            title="Scan Card QR Code"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">QR</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={() => handleCopy(window.location.origin + `/card/${cardData.slug}`, "link")}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition border border-slate-700"
          >
            {copiedItem === "link" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedItem === "link" ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Main Visiting Card Container */}
      <div className={`w-full flex justify-center py-2 transition-all duration-300 ${
        viewMode === "expanded" ? "max-w-2xl" : "max-w-md"
      }`}>
        <div className={`relative shadow-2xl transition-all duration-300 ${
          viewMode === "simulator" ? "phone-mockup-frame" : "w-full rounded-3xl overflow-hidden border border-slate-700/60"
        }`}
        style={{
          boxShadow: `0 25px 60px -15px ${currentTheme.borderGlow || "rgba(0,0,0,0.5)"}`
        }}
        >
          {/* Smartphone Notch (Only in simulator mode) */}
          {viewMode === "simulator" && (
            <div className="phone-notch">
              <div className="phone-speaker" />
              <div className="phone-camera" />
            </div>
          )}

          {/* Card Body */}
          {isDeactivated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-900 text-white">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold">This Digital Card is Inactive</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                The subscription for <strong>{cardData.company_name}</strong> is currently paused or pending activation.
              </p>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full max-w-xs py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition"
              >
                Activate / Renew Now
              </button>
            </div>
          ) : (
            <div 
              className="flex-1 overflow-y-auto pb-12 relative select-none scroll-smooth"
              style={{
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textColor
              }}
            >
              {/* Dynamic Structural Layout Render */}
              <ActiveTemplate {...templateProps} />

              {/* Verified Footer Branding */}
              <div className="pt-4 pb-4 text-center text-[10px] opacity-60">
                <p>Powered by <strong>DigiCards</strong> • Professional Digital Identity</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5 CARD STRUCTURES SWITCHER MODAL */}
      {structurePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-extrabold text-white text-sm">Select Card Structure</h3>
                  <p className="text-[11px] text-slate-400">Choose from 5 fundamentally distinct layout designs</p>
                </div>
              </div>
              <button
                onClick={() => setStructurePickerOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              {TEMPLATE_METADATA.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplate(tmpl.id);
                      setStructurePickerOpen(false);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition group ${
                      isSelected 
                        ? "bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/30" 
                        : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 group-hover:text-white"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{tmpl.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300 border border-indigo-500/20">
                            {tmpl.badge}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tmpl.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 100 THEMES LIVE SWITCHER DRAWER / MODAL */}
      {themePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-white text-sm">100 Handcrafted Themes</h3>
                  <p className="text-[11px] text-slate-400">Click any theme to instantly preview on your live card</p>
                </div>
              </div>
              <button
                onClick={() => setThemePickerOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2 border-b border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              {THEME_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Themes Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveThemeId(t.id);
                    setThemePickerOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-24 relative overflow-hidden group ${
                    activeThemeId === t.id
                      ? "border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                  style={{
                    background: t.cardBg
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-7"
                    style={{ background: t.gradient }}
                  />

                  <div className="relative z-10 pt-4">
                    <span 
                      className="text-xs font-black line-clamp-1 group-hover:underline"
                      style={{ color: t.textColor }}
                    >
                      #{t.id} {t.name.split(":")[1] || t.name}
                    </span>
                    <span 
                      className="text-[9px] font-bold opacity-70 block"
                      style={{ color: t.subtextColor }}
                    >
                      {t.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between relative z-10 pt-1">
                    <span 
                      className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase"
                      style={{
                        background: t.primary,
                        color: t.buttonText
                      }}
                    >
                      {t.layoutStyle}
                    </span>
                    {activeThemeId === t.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL CARD QR CODE MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-white text-base">Scan Digital Card</h3>
            <p className="text-xs text-slate-400">Scan using any phone camera to instantly open this card</p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              {cardQrUrl ? (
                <img src={cardQrUrl} alt="Card QR" className="w-56 h-56 object-contain mx-auto" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400">Generating...</div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleCopy(window.location.origin + `/card/${cardData.slug}`, "qr-link")}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                {copiedItem === "qr-link" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedItem === "qr-link" ? "Link Copied!" : "Copy Card Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY LIGHTBOX MODAL */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setLightboxImage(null)}>
          <div className="max-w-3xl w-full text-center space-y-2 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-1.5 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Preview"
              className="max-h-[80vh] w-auto mx-auto rounded-2xl shadow-2xl object-contain border border-slate-800"
            />
          </div>
        </div>
      )}

      {/* Payment Activation Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        card={cardData}
        onSuccess={fetchCard}
      />
    </div>
  );
}
