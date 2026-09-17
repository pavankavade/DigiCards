import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ChevronRight, AlertTriangle, Sparkles, Building, QrCode
} from 'lucide-react';
import { THEMES, getThemeById } from '../themes';
import PaymentModal from './PaymentModal';

export default function PublicCardView({ slug = 'ABC-Marketing', overrideThemeId, onBack }) {
  const [cardData, setCardData] = useState(null);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'about', 'products', 'gallery', 'video', 'payment', 'enquiry'
  const [activeThemeId, setActiveThemeId] = useState(overrideThemeId || 26);
  const [sharePhone, setSharePhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Enquiry form state
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const fetchCard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cards/public/${slug}`);
      if (!res.ok) throw new Error('Card not found');
      const data = await res.json();
      setCardData(data.card);
      setProducts(data.products || []);
      setGallery(data.gallery || []);
      if (!overrideThemeId) {
        setActiveThemeId(data.card.theme_id || 26);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Loading digital visiting card...</p>
        </div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl text-center space-y-4 border border-slate-700">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Card Not Found</h2>
          <p className="text-xs text-slate-400">No active digital visiting card found for "{slug}".</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentTheme = getThemeById(activeThemeId);
  const isDeactivated = cardData.status === 'deactivated';

  // Quick Direct WhatsApp Share
  const handleDirectShare = (e) => {
    e.preventDefault();
    if (!sharePhone.trim()) return;
    const cleanPhone = sharePhone.replace(/[^0-9]/g, '');
    const currentUrl = window.location.origin + `/card/${cardData.slug}`;
    const message = `Hello! Please view and save my Digital Visiting Card & Mini Website:\n${cardData.company_name}\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // 1-Click WhatsApp Order
  const handleOrderWhatsApp = (product) => {
    const phone = cardData.whatsapp || cardData.phone || '7367063161';
    const message = `Hello ${cardData.company_name}, I would like to order / enquire about: *${product.title}* (₹${product.discount_price || product.price}). Please share further details.`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/card/${cardData.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Enquiry submission
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/cards/${cardData.slug}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiryName,
          phone: enquiryPhone,
          email: enquiryEmail,
          message: enquiryMsg
        })
      });
      if (!res.ok) throw new Error('Failed to send enquiry');
      setEnquirySuccess(true);
      setEnquiryName('');
      setEnquiryPhone('');
      setEnquiryEmail('');
      setEnquiryMsg('');
      setTimeout(() => setEnquirySuccess(false), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Format YouTube Embed
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const ytEmbed = getYouTubeEmbedUrl(cardData.youtube_video);

  return (
    <div className="min-h-screen bg-geometric-3d text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 relative">
      {/* Top Floating Utility Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 z-40 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              ← Back
            </button>
          )}
          <span className="font-bold text-white hidden sm:inline">{cardData.company_name}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {cardData.slug}
          </span>
        </div>

        {/* 100 Themes Switcher */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400 font-medium hidden md:inline">Theme:</span>
          <select
            value={activeThemeId}
            onChange={(e) => setActiveThemeId(parseInt(e.target.value))}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Container - Centered Mobile Smartphone Bezel */}
      <div className="w-full flex justify-center py-2">
        <div className="phone-mockup-frame shadow-2xl relative">
          
          {/* Smartphone Notch / Dynamic Island */}
          <div className="phone-notch">
            <div className="phone-speaker" />
            <div className="phone-camera" />
          </div>

          {/* Status Ribbon (Top Right) */}
          <div className="absolute top-2 right-4 z-40">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow ${
              isDeactivated ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {isDeactivated ? 'Deactivated' : 'Active'}
            </span>
          </div>

          {/* If Deactivated, show the exact alert from frame_165s.png */}
          {isDeactivated ? (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full bg-white text-slate-900 space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                Card is Deactivated.
              </div>
              <p className="text-xs text-slate-600">
                If this is your card, Click here to activate your card.
              </p>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition"
              >
                Activate Now
              </button>
            </div>
          ) : (
            /* Active Card Content Scrollable Area */
            <div 
              className="flex-1 overflow-y-auto pb-20 relative select-none"
              style={{
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textColor
              }}
            >
              {/* Header Banner */}
              <div 
                className="h-36 relative flex items-center justify-center transition-all duration-300"
                style={{ background: currentTheme.gradient }}
              >
                {/* Logo Badge matching frame_075s */}
                <div className="absolute -bottom-10 w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={cardData.logo_url || '/assets/img/demo/logo.png'}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/assets/img/demo/logo.png'; }}
                  />
                </div>
              </div>

              {/* Title & Designation */}
              <div className="pt-12 px-6 text-center space-y-1">
                <h1 className="text-xl font-extrabold tracking-tight uppercase" style={{ color: currentTheme.textColor }}>
                  {cardData.company_name}
                </h1>
                <p className="text-xs font-semibold" style={{ color: currentTheme.subtextColor }}>
                  {cardData.personal_name} • {cardData.designation || 'Business Representative'}
                </p>
              </div>

              {/* 4 Quick Action Floating Buttons matching frame_075s */}
              <div className="px-6 py-4">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-md border border-slate-100 flex items-center justify-around">
                  <a
                    href={`tel:${cardData.phone}`}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ background: currentTheme.primary }}
                    >
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Call</span>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?phone=${cardData.whatsapp || cardData.phone}&text=Hi,%20I%20visited%20your%20Digital%20Business%20Card.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ background: '#25D366' }}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${cardData.email}`}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ background: currentTheme.primary }}
                    >
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Mail</span>
                  </a>

                  <a
                    href={cardData.website || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ background: currentTheme.primary }}
                    >
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Website</span>
                  </a>
                </div>
              </div>

              {/* Primary Contact Details Card matching frame_075s */}
              <div className="px-6 space-y-2">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 text-xs">
                  <div className="flex items-center gap-3 text-slate-800">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: currentTheme.primary }}>
                      <Phone className="w-4 h-4" />
                    </div>
                    <a href={`tel:${cardData.phone}`} className="font-semibold hover:underline">
                      {cardData.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-slate-800">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: currentTheme.primary }}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <a href={`mailto:${cardData.email}`} className="font-medium hover:underline truncate">
                      {cardData.email}
                    </a>
                  </div>

                  {cardData.address && (
                    <div className="flex items-start gap-3 text-slate-800">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5" style={{ background: currentTheme.primary }}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="font-medium leading-relaxed">
                        {cardData.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Direct WhatsApp Share Bar matching frame_075s */}
              <div className="px-6 mt-4">
                <form onSubmit={handleDirectShare} className="flex rounded-xl overflow-hidden border border-slate-200 shadow-sm text-xs">
                  <span className="bg-slate-100 px-3 py-2.5 text-slate-600 font-bold border-r border-slate-200 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={sharePhone}
                    onChange={(e) => setSharePhone(e.target.value)}
                    placeholder="Enter WhatsApp No to share"
                    className="flex-1 px-3 py-2.5 text-slate-800 bg-white outline-none font-medium text-xs placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="text-white font-bold px-4 py-2.5 flex items-center gap-1 transition"
                    style={{ background: '#25D366' }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Share
                  </button>
                </form>
              </div>

              {/* 1-Click "Save to Contacts" Button */}
              <div className="px-6 mt-3">
                <a
                  href={`/api/cards/public/${cardData.slug}/vcard`}
                  download={`${cardData.slug}.vcf`}
                  className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  style={{
                    background: currentTheme.primary,
                    color: currentTheme.buttonText
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Save to Contacts (vCard)</span>
                </a>
              </div>

              {/* Social Media Links Icons */}
              <div className="px-6 py-4 flex items-center justify-center gap-3">
                {[
                  { key: 'social_facebook', label: 'FB', bg: '#1877F2' },
                  { key: 'social_whatsapp', label: 'WA', bg: '#25D366' },
                  { key: 'social_instagram', label: 'IG', bg: '#E4405F' },
                  { key: 'social_linkedin', label: 'IN', bg: '#0A66C2' },
                  { key: 'social_youtube', label: 'YT', bg: '#FF0000' }
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={cardData[s.key] || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow hover:scale-110 transition-transform"
                    style={{ background: s.bg }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>

              {/* Interactive Card Tabs / Content Body */}
              <div className="px-6 pb-6 space-y-4">
                
                {/* About Us */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                    About Us
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cardData.about_us || 'Providing exceptional digital and professional services to help businesses grow.'}
                  </p>
                  {cardData.company_est_date && (
                    <div className="text-[11px] text-slate-500 font-semibold pt-1">
                      Established: {cardData.company_est_date}
                    </div>
                  )}
                </div>

                {/* Products & Services (Mini Store) */}
                {products.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                        Products & Services
                      </h3>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Mini Store
                      </span>
                    </div>

                    <div className="space-y-3">
                      {products.map((p) => (
                        <div key={p.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
                          {p.image_url && (
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="w-full h-32 object-cover"
                              onError={(e) => { e.target.src = '/assets/img/demo/prod1.png'; }}
                            />
                          )}
                          <div className="p-3.5 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-xs text-slate-900">{p.title}</h4>
                              <div className="text-right">
                                <span className="font-black text-sm text-slate-900">₹{p.discount_price || p.price}</span>
                                {p.discount_price && (
                                  <span className="text-[10px] text-slate-400 line-through block">₹{p.price}</span>
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2">{p.description}</p>
                            <button
                              onClick={() => handleOrderWhatsApp(p)}
                              className="w-full py-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                              style={{ background: '#25D366' }}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Order on WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* YouTube Video Section matching frame_095s */}
                {ytEmbed && (
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                      Video Showcase
                    </h3>
                    <div className="rounded-xl overflow-hidden aspect-video bg-black shadow-inner">
                      <iframe
                        src={ytEmbed}
                        title="YouTube video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Payment Info Section matching frame_095s */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 text-xs">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                    Payment Info
                  </h3>

                  {/* Dynamic UPI QR Code */}
                  <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-[11px] font-bold text-slate-700 mb-2">Scan & Pay via any UPI App</p>
                    <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                      <img
                        src={cardData.payment_qr_url || '/assets/img/demo/sample-qr.png'}
                        alt="UPI QR"
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/assets/img/demo/sample-qr.png'; }}
                      />
                    </div>
                    {cardData.payment_upi_id && (
                      <div className="mt-2 text-[11px] font-bold text-slate-800">
                        UPI: <span className="text-indigo-600">{cardData.payment_upi_id}</span>
                      </div>
                    )}
                  </div>

                  {/* Bank Account Details */}
                  {cardData.bank_account_no && (
                    <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                      <div><strong>Bank:</strong> {cardData.bank_name || 'State Bank of India'}</div>
                      <div><strong>Account No:</strong> {cardData.bank_account_no}</div>
                      <div><strong>IFSC Code:</strong> {cardData.bank_ifsc}</div>
                      <div><strong>Holder:</strong> {cardData.bank_holder_name}</div>
                    </div>
                  )}
                </div>

                {/* Contact & Lead Enquiry Form matching frame_095s */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                    Contact Us
                  </h3>

                  {enquirySuccess ? (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs text-center">
                      ✓ Message Sent! We will contact you shortly.
                    </div>
                  ) : (
                    <form onSubmit={handleEnquirySubmit} className="space-y-2.5 text-xs">
                      <input
                        type="text"
                        required
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        placeholder="Enter Your Name"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-slate-800 font-medium focus:border-indigo-500"
                      />
                      <input
                        type="tel"
                        required
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        placeholder="Enter Your Mobile No"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-slate-800 font-medium focus:border-indigo-500"
                      />
                      <input
                        type="email"
                        value={enquiryEmail}
                        onChange={(e) => setEnquiryEmail(e.target.value)}
                        placeholder="Enter Your Email Address"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-slate-800 font-medium focus:border-indigo-500"
                      />
                      <textarea
                        rows="3"
                        value={enquiryMsg}
                        onChange={(e) => setEnquiryMsg(e.target.value)}
                        placeholder="Enter your Message or Query"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-slate-800 font-medium focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition"
                        style={{ background: currentTheme.primary }}
                      >
                        SEND!
                      </button>
                    </form>
                  )}
                </div>

                {/* Footer Tagline */}
                <div className="text-center pt-2 text-[10px] text-slate-400">
                  Created with <strong>DigiCards.in</strong> Digital Business Card
                </div>

              </div>
            </div>
          )}

          {/* Bottom Fixed Navigation Bar matching frame_075s */}
          {!isDeactivated && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-14 border-t flex items-center justify-around z-30 px-2"
              style={{
                background: currentTheme.primary,
                borderColor: 'rgba(255,255,255,0.1)'
              }}
            >
              {[
                { label: 'Home', icon: Building },
                { label: 'Shop', icon: ShoppingCart },
                { label: 'Payment', icon: CreditCard },
                { label: 'Share', icon: Share2 }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.label === 'Share') handleCopyLink();
                    else alert(`Navigating to ${item.label}`);
                  }}
                  className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white transition"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

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
