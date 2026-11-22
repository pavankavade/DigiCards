import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, Building
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function ExecutiveTemplate(props) {
  const {
    cardData, products, gallery, currentTheme, activeTab, setActiveTab,
    handleCopy, copiedItem, sharePhone, setSharePhone, handleDirectShare,
    handleOrderWhatsApp, upiQrUrl, ytEmbed, setLightboxImage,
    enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone,
    enquiryEmail, setEnquiryEmail, enquiryMsg, setEnquiryMsg,
    enquirySubmitting, enquirySuccess, handleEnquirySubmit
  } = props;

  return (
    <div className="space-y-4">
      {/* 1. Curved Hero Header */}
      <div className="relative">
        <div 
          className="h-44 sm:h-48 relative flex items-center justify-center overflow-hidden transition-all duration-300"
          style={{ background: currentTheme.gradient }}
        >
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="absolute top-4 left-4 z-20">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/30 backdrop-blur-md text-white/90 border border-white/20">
              Est. {cardData.company_est_date || "2024"}
            </span>
          </div>
          {/* Curved Wave Bottom */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="w-full h-8" style={{ fill: currentTheme.cardBg }}>
              <path d="M0,0 C150,40 350,-20 500,20 L500,40 L0,40 Z"></path>
            </svg>
          </div>
        </div>

        {/* Floating Avatar */}
        <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 z-20">
          <div 
            className="w-24 h-24 rounded-3xl p-1 shadow-2xl transition-transform hover:scale-105 duration-300"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              boxShadow: `0 10px 25px -5px ${currentTheme.borderGlow}`
            }}
          >
            <div className="w-full h-full rounded-[22px] overflow-hidden bg-white border-2 border-white flex items-center justify-center relative">
              <img
                src={cardData.logo_url || "/assets/img/demo/logo.png"}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Identity Info */}
      <div className="pt-14 px-6 text-center space-y-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <h1 className="text-xl font-black tracking-tight" style={{ color: currentTheme.textColor }}>
            {cardData.company_name}
          </h1>
          <ShieldCheck className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
        </div>
        <p className="text-xs font-bold" style={{ color: currentTheme.primary }}>
          {cardData.personal_name} • <span className="opacity-80">{cardData.designation || "Representative"}</span>
        </p>
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Open for Business
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Executive Edition
          </span>
        </div>
      </div>

      {/* Floating Glassmorphic Action Dock */}
      <div className="px-4 py-2">
        <div 
          className="rounded-2xl p-3 shadow-xl flex items-center justify-around gap-2"
          style={{
            backgroundColor: currentTheme.glassBg,
            border: `1px solid ${currentTheme.cardBorder}`,
            backdropFilter: "blur(16px)"
          }}
        >
          <a href={`tel:${cardData.phone}`} className="flex flex-col items-center gap-1 group flex-1">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110" style={{ background: currentTheme.primary }}>
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold" style={{ color: currentTheme.textColor }}>Call</span>
          </a>
          <a href={`https://api.whatsapp.com/send?phone=${(cardData.whatsapp || cardData.phone || "").replace(/[^0-9]/g, "")}&text=Hi,%20I%20viewed%20your%20Digital%20Card.`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group flex-1">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110" style={{ background: "#25D366" }}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold" style={{ color: currentTheme.textColor }}>WhatsApp</span>
          </a>
          <a href={`mailto:${cardData.email}`} className="flex flex-col items-center gap-1 group flex-1">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110" style={{ background: "#ea4335" }}>
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold" style={{ color: currentTheme.textColor }}>Email</span>
          </a>
          <a href={cardData.location_map || `https://maps.google.com/?q=${encodeURIComponent(cardData.address || cardData.company_name)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group flex-1">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110" style={{ background: "#4285F4" }}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold" style={{ color: currentTheme.textColor }}>Directions</span>
          </a>
          <a href={`/api/cards/public/${cardData.slug}/vcard`} download className="flex flex-col items-center gap-1 group flex-1">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110" style={{ background: "#7c3aed" }}>
              <Download className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold" style={{ color: currentTheme.textColor }}>Save</span>
          </a>
        </div>
      </div>

      {/* Save to contacts CTA button */}
      <div className="px-4">
        <a
          href={`/api/cards/public/${cardData.slug}/vcard`}
          download
          className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
            color: currentTheme.buttonText
          }}
        >
          <Download className="w-4 h-4" />
          Save to Contacts (vCard)
        </a>
      </div>

      {/* Direct WhatsApp Share Input */}
      <div className="px-4">
        <form onSubmit={handleDirectShare} className="rounded-2xl p-2.5 shadow-sm flex items-center gap-2" style={{ backgroundColor: currentTheme.glassBg, border: `1px solid ${currentTheme.cardBorder}` }}>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <input
            type="tel"
            placeholder="Share card to mobile number..."
            value={sharePhone}
            onChange={(e) => setSharePhone(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold focus:outline-none placeholder:text-slate-400"
            style={{ color: currentTheme.textColor }}
          />
          <button type="submit" className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
            Share
          </button>
        </form>
      </div>

      {/* Segmented Pill Tabs */}
      <div className="px-4 pt-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: "all", label: "Overview" },
            { id: "about", label: "About" },
            { id: "products", label: `Shop (${products.length})` },
            { id: "payment", label: "Pay / UPI" },
            { id: "gallery", label: "Media" },
            { id: "enquiry", label: "Inquiry" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${activeTab === tab.id ? "shadow-md" : "opacity-70 hover:opacity-100"}`}
              style={{
                backgroundColor: activeTab === tab.id ? currentTheme.primary : "transparent",
                color: activeTab === tab.id ? currentTheme.buttonText : currentTheme.textColor,
                border: `1px solid ${activeTab === tab.id ? currentTheme.primary : currentTheme.cardBorder}`
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: About & Contact */}
      {(activeTab === "all" || activeTab === "about") && (
        <div className="px-4 space-y-3">
          <div className="rounded-2xl p-4 shadow-sm space-y-3" style={{ backgroundColor: currentTheme.glassBg, border: `1px solid ${currentTheme.cardBorder}` }}>
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
              <Building className="w-3.5 h-3.5" /> About Business
            </h3>
            <p className="text-xs leading-relaxed opacity-90" style={{ color: currentTheme.textColor }}>
              {cardData.about_us || "Providing professional services, high customer satisfaction, and modern digital solutions."}
            </p>
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: currentTheme.cardBorder }}>
              {cardData.phone && (
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold">{cardData.phone}</span>
                  <button onClick={() => handleCopy(cardData.phone, "phone")} className="p-1 text-slate-400 hover:text-indigo-400">
                    {copiedItem === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
              {cardData.email && (
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold truncate max-w-[220px]">{cardData.email}</span>
                  <button onClick={() => handleCopy(cardData.email, "email")} className="p-1 text-slate-400 hover:text-indigo-400">
                    {copiedItem === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
              {cardData.address && (
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold truncate max-w-[220px]">{cardData.address}</span>
                  <button onClick={() => handleCopy(cardData.address, "address")} className="p-1 text-slate-400 hover:text-indigo-400">
                    {copiedItem === "address" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Social Matrix */}
          <div className="rounded-2xl p-4 shadow-sm space-y-3" style={{ backgroundColor: currentTheme.glassBg, border: `1px solid ${currentTheme.cardBorder}` }}>
            <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.primary }}>Social Presence</h3>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { name: "WhatsApp", icon: MessageSquare, color: "#25D366", url: `https://api.whatsapp.com/send?phone=${cardData.whatsapp || cardData.phone}` },
                { name: "Instagram", icon: InstagramIcon, color: "#E4405F", url: cardData.social_instagram },
                { name: "LinkedIn", icon: LinkedinIcon, color: "#0A66C2", url: cardData.social_linkedin },
                { name: "YouTube", icon: YoutubeIcon, color: "#FF0000", url: cardData.social_youtube },
                { name: "Facebook", icon: FacebookIcon, color: "#1877F2", url: cardData.social_facebook },
                { name: "Twitter", icon: TwitterIcon, color: "#1DA1F2", url: cardData.social_twitter },
                { name: "Telegram", icon: Send, color: "#0088cc", url: cardData.social_telegram },
                { name: "Website", icon: Globe, color: "#6366F1", url: cardData.website }
              ].filter(item => item.url).map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:-translate-y-1" style={{ background: "rgba(0,0,0,0.04)", border: `1px solid ${currentTheme.cardBorder}` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ background: item.color }}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold truncate max-w-full" style={{ color: currentTheme.textColor }}>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Products */}
      {(activeTab === "all" || activeTab === "products") && products.length > 0 && (
        <div className="px-4 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
            <ShoppingCart className="w-3.5 h-3.5" /> Featured Offerings ({products.length})
          </h3>
          <div className="space-y-3">
            {products.map(prod => (
              <div key={prod.id} className="rounded-2xl p-3 shadow-md flex flex-col gap-2.5" style={{ backgroundColor: currentTheme.glassBg, border: `1px solid ${currentTheme.cardBorder}` }}>
                <div className="flex gap-3">
                  <img src={prod.image_url || "/assets/img/demo/prod1.png"} alt={prod.title} className="w-20 h-20 rounded-xl object-cover shrink-0" onError={(e) => { e.target.src = "/assets/img/demo/prod1.png"; }} />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black line-clamp-1" style={{ color: currentTheme.textColor }}>{prod.title}</h4>
                      <p className="text-[10px] opacity-75 line-clamp-2 mt-1">{prod.description}</p>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-black text-emerald-600">₹{prod.discount_price || prod.price}</span>
                      {prod.discount_price && <span className="text-[10px] line-through opacity-50">₹{prod.price}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleOrderWhatsApp(prod)} className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition">
                  <MessageSquare className="w-3.5 h-3.5" /> Order on WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Payment & UPI */}
      {(activeTab === "all" || activeTab === "payment") && (
        <div className="px-4 space-y-3">
          <div className="rounded-2xl p-4 shadow-sm space-y-3 text-center" style={{ backgroundColor: currentTheme.glassBg, border: `1px solid ${currentTheme.cardBorder}` }}>
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5" style={{ color: currentTheme.primary }}>
              <CreditCard className="w-3.5 h-3.5" /> Scan & Pay via UPI
            </h3>
            <div className="p-3 bg-white rounded-2xl inline-block shadow-md">
              {upiQrUrl ? <img src={upiQrUrl} alt="UPI QR" className="w-40 h-40 object-contain mx-auto" /> : <div>Generating...</div>}
              <p className="text-[10px] font-black text-slate-800 mt-2">GPay • PhonePe • Paytm</p>
            </div>
            {cardData.bank_account_no && (
              <div className="p-3 rounded-xl text-left text-xs space-y-1.5 border mt-2" style={{ borderColor: currentTheme.cardBorder }}>
                <div className="flex justify-between"><span>Bank:</span><strong>{cardData.bank_name}</strong></div>
                <div className="flex justify-between"><span>A/C:</span><strong className="font-mono">{cardData.bank_account_no}</strong></div>
                <div className="flex justify-between"><span>IFSC:</span><strong className="font-mono">{cardData.bank_ifsc}</strong></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Gallery & Video */}
      {(activeTab === "all" || activeTab === "gallery") && (
        <div className="px-4 space-y-3">
          {ytEmbed && (
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-video bg-black">
              <iframe src={ytEmbed} title="Video" className="w-full h-full" allowFullScreen />
            </div>
          )}
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map(g => (
                <div key={g.id} onClick={() => setLightboxImage(g)} className="aspect-square rounded-xl overflow-hidden cursor-pointer shadow hover:scale-105 transition-transform">
                  <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Enquiry Form */}
      {(activeTab === "all" || activeTab === "enquiry") && (
        <div className="px-4 pb-4">
          <div className="rounded-2xl p-4 shadow-md space-y-3" style={{ backgroundColor: currentTheme.glassBg, border: `1px solid ${currentTheme.cardBorder}` }}>
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
              <Send className="w-3.5 h-3.5" /> Send an Inquiry
            </h3>
            {enquirySuccess ? (
              <div className="p-3 bg-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-400">
                Inquiry Sent Successfully!
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-2.5">
                <input type="text" required placeholder="Your Name *" value={enquiryName} onChange={(e) => setEnquiryName(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900/60 border border-slate-700 text-white" />
                <input type="tel" required placeholder="Mobile Number *" value={enquiryPhone} onChange={(e) => setEnquiryPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900/60 border border-slate-700 text-white" />
                <textarea rows={2} placeholder="Your message..." value={enquiryMsg} onChange={(e) => setEnquiryMsg(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900/60 border border-slate-700 text-white resize-none" />
                <button type="submit" disabled={enquirySubmitting} className="w-full py-2.5 rounded-xl font-bold text-xs text-white" style={{ background: currentTheme.primary }}>
                  {enquirySubmitting ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
