import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, Sparkles, Layers, Compass, ArrowUpRight
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function NeoGlassTemplate(props) {
  const {
    cardData, products, gallery, currentTheme, activeTab, setActiveTab,
    handleCopy, copiedItem, sharePhone, setSharePhone, handleDirectShare,
    handleOrderWhatsApp, upiQrUrl, ytEmbed, setLightboxImage,
    enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone,
    enquiryEmail, setEnquiryEmail, enquiryMsg, setEnquiryMsg,
    enquirySubmitting, enquirySuccess, handleEnquirySubmit
  } = props;

  return (
    <div className="space-y-4 font-sans relative">
      {/* Dynamic Aurora Ambient Background Orbs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-6 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Frosted Glass Banner & Floating Avatar */}
      <div className="relative">
        <div 
          className="h-44 sm:h-48 relative flex items-center justify-center overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md"
          style={{ 
            background: `linear-gradient(135deg, rgba(56,189,248,0.25) 0%, rgba(129,140,248,0.2) 50%, rgba(236,72,153,0.15) 100%)`
          }}
        >
          {/* Glass Specular Reflection Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent pointer-events-none" />
          
          <div className="absolute top-3 inset-x-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/40 dark:bg-black/40 text-cyan-900 dark:text-cyan-200 border border-white/40 dark:border-white/10 flex items-center gap-1.5 backdrop-blur-xl shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              NEO GLASS PRISM
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/30 dark:bg-black/30 text-slate-800 dark:text-slate-200 border border-white/30 dark:border-white/10 backdrop-blur-xl flex items-center gap-1">
              <Eye className="w-3 h-3 text-cyan-500" /> {cardData.views_count || 0}
            </span>
          </div>

          <div className="text-center space-y-1 relative z-10 pt-2">
            <div className="w-9 h-9 rounded-2xl bg-white/30 dark:bg-white/10 border border-white/30 backdrop-blur-xl mx-auto flex items-center justify-center text-cyan-600 dark:text-cyan-300 shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
              {cardData.company_est_date ? `Est. ${cardData.company_est_date}` : "Digital Experience"}
            </div>
          </div>
        </div>

        {/* Floating Glass Avatar */}
        <div className="absolute left-1/2 -bottom-14 -translate-x-1/2 z-20">
          <div 
            className="w-26 h-26 rounded-3xl p-1.5 backdrop-blur-2xl shadow-2xl transition-transform hover:scale-105 duration-300 relative border border-white/40 dark:border-white/10 bg-white/20 dark:bg-slate-900/40"
            style={{
              boxShadow: `0 20px 40px -10px rgba(56,189,248,0.3)`
            }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-950/80 border border-white/40 flex items-center justify-center">
              <img
                src={cardData.logo_url || "/assets/img/demo/logo.png"}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Glass Identity Card */}
      <div className="pt-16 px-6 text-center space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {cardData.company_name}
        </h1>
        <p className="text-xs font-semibold tracking-wide text-cyan-600 dark:text-cyan-400">
          {cardData.personal_name} • <span className="opacity-90">{cardData.designation || "Creative Director"}</span>
        </p>

        {cardData.about_us && (
          <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-xl shadow-sm text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
            {cardData.about_us}
          </div>
        )}
      </div>

      {/* 3. Translucent Quick Actions */}
      <div className="mx-2 grid grid-cols-4 gap-2 pt-1">
        <a
          href={`tel:${cardData.phone}`}
          className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-white/10 shadow-sm transition flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Call</span>
        </a>

        <a
          href={`https://wa.me/${cardData.whatsapp ? cardData.whatsapp.replace(/\D/g, "") : cardData.phone ? cardData.phone.replace(/\D/g, "") : ""}?text=Hello%20${encodeURIComponent(cardData.company_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-emerald-500/20 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-white/10 shadow-sm transition flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">WhatsApp</span>
        </a>

        <a
          href={`mailto:${cardData.email}`}
          className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-white/10 shadow-sm transition flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Email</span>
        </a>

        <a
          href={cardData.location_url || (cardData.address ? `https://maps.google.com/?q=${encodeURIComponent(cardData.address)}` : "#")}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-white/10 shadow-sm transition flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Locate</span>
        </a>
      </div>

      {/* 4. Contact Pill Cards */}
      <div className="mx-2 space-y-2">
        <div className="p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Direct Phone</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cardData.phone}</div>
            </div>
          </div>
          <button 
            onClick={() => handleCopy(cardData.phone, "phone")}
            className="p-1.5 rounded-lg bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition"
          >
            {copiedItem === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {cardData.email && (
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Official Email</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cardData.email}</div>
              </div>
            </div>
            <button 
              onClick={() => handleCopy(cardData.email, "email")}
              className="p-1.5 rounded-lg bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-purple-600 transition"
            >
              {copiedItem === "email" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {cardData.website && (
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Web Portal</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cardData.website}</div>
              </div>
            </div>
            <a 
              href={cardData.website.startsWith("http") ? cardData.website : `https://${cardData.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {cardData.address && (
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl flex items-start gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Corporate Address</div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{cardData.address}</div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Frosted Glass Tab Bar */}
      <div className="mx-2 p-1.5 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-xl flex items-center gap-1 overflow-x-auto scrollbar-none shadow-sm">
        {[
          { id: "products", label: `Catalog (${products.length})` },
          { id: "gallery", label: `Gallery (${gallery.length})` },
          { id: "payment", label: "Pay" },
          { id: "enquiry", label: "Inquire" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[76px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-white/20 text-cyan-600 dark:text-cyan-300 shadow-md backdrop-blur-lg"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 6. Tab Content */}
      <div className="mx-2">
        {activeTab === "products" && (
          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20">
                No catalog items published yet.
              </div>
            ) : (
              products.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-sm hover:shadow-md transition flex gap-3.5 items-center"
                >
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-18 h-18 rounded-xl object-cover shrink-0 border border-white/30"
                    />
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</h3>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">
                        {item.price ? `₹${item.price}` : "Upon Request"}
                      </span>
                      <button
                        onClick={() => handleOrderWhatsApp(item.name, item.price)}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-1 transition"
                      >
                        <ShoppingCart className="w-3 h-3" /> Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="grid grid-cols-2 gap-2.5">
            {gallery.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-xs text-slate-500 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20">
                No showcase media added.
              </div>
            ) : (
              gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setLightboxImage(img.image_url)}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-white/30 dark:border-white/10 cursor-pointer shadow-sm"
                >
                  <img 
                    src={img.image_url} 
                    alt={img.title || "Gallery photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-[10px] font-semibold text-white truncate">
                      {img.title}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "payment" && (
          <div className="p-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Direct Payment Gateway</h3>
            </div>

            {cardData.upi_id && (
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-black/30 border border-cyan-500/20 text-center space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Scan UPI / PhonePe / GPay</div>
                {upiQrUrl && (
                  <div className="p-2 bg-white rounded-xl inline-block shadow-md">
                    <img src={upiQrUrl} alt="UPI QR" className="w-36 h-36 mx-auto" />
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{cardData.upi_id}</span>
                  <button 
                    onClick={() => handleCopy(cardData.upi_id, "upi")}
                    className="p-1 rounded bg-cyan-500/10 text-cyan-600 hover:text-cyan-800 transition"
                  >
                    {copiedItem === "upi" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}

            {(cardData.bank_account_no || cardData.bank_ifsc) && (
              <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/30 space-y-2 text-xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Direct Bank Transfer</div>
                {cardData.bank_name && <div><span className="text-slate-500">Bank:</span> <strong className="text-slate-800 dark:text-slate-200">{cardData.bank_name}</strong></div>}
                {cardData.bank_account_no && <div><span className="text-slate-500">Account:</span> <strong className="font-mono text-slate-800 dark:text-slate-200">{cardData.bank_account_no}</strong></div>}
                {cardData.bank_ifsc && <div><span className="text-slate-500">IFSC:</span> <strong className="font-mono text-slate-800 dark:text-slate-200">{cardData.bank_ifsc}</strong></div>}
              </div>
            )}
          </div>
        )}

        {activeTab === "enquiry" && (
          <form onSubmit={handleEnquirySubmit} className="p-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Send Instant Inquiry
            </h3>

            {enquirySuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Your message was received! We will connect promptly.
              </div>
            )}

            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={enquiryName}
                onChange={(e) => setEnquiryName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
              <input
                type="tel"
                placeholder="Contact Phone *"
                required
                value={enquiryPhone}
                onChange={(e) => setEnquiryPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={enquiryEmail}
                onChange={(e) => setEnquiryEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
              <textarea
                placeholder="Tell us what you are looking for..."
                rows={3}
                value={enquiryMsg}
                onChange={(e) => setEnquiryMsg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 resize-none"
              />
              <button
                type="submit"
                disabled={enquirySubmitting}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md hover:opacity-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {enquirySubmitting ? "Transmitting..." : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 7. Footer vCard Action */}
      <div className="mx-2 pt-2 pb-4">
        <a
          href={`/api/cards/public/${cardData.slug}/vcard`}
          className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-white/80 dark:bg-white/10 border border-white/50 dark:border-white/20 backdrop-blur-xl text-slate-900 dark:text-white hover:bg-white shadow-lg flex items-center justify-center gap-2 transition"
        >
          <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          Save Digital Contact (vCard)
        </a>
      </div>
    </div>
  );
}
