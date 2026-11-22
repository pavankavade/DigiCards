import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, Crown, Sparkles, Gem, Award
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function RoyaleTemplate(props) {
  const {
    cardData, products, gallery, currentTheme, activeTab, setActiveTab,
    handleCopy, copiedItem, sharePhone, setSharePhone, handleDirectShare,
    handleOrderWhatsApp, upiQrUrl, ytEmbed, setLightboxImage,
    enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone,
    enquiryEmail, setEnquiryEmail, enquiryMsg, setEnquiryMsg,
    enquirySubmitting, enquirySuccess, handleEnquirySubmit
  } = props;

  return (
    <div className="space-y-4 font-serif">
      {/* 1. Imperial Cover Banner with Gold Filigree */}
      <div className="relative">
        <div 
          className="h-44 sm:h-48 relative flex items-center justify-center overflow-hidden border-b-2 border-amber-500/40"
          style={{ 
            background: `radial-gradient(ellipse at top, #2d2417 0%, #0d0b08 100%)`
          }}
        >
          {/* Subtle Damask Pattern Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] bg-[size:18px_18px]" />
          
          <div className="absolute top-3 inset-x-4 flex items-center justify-between z-10 font-sans">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 backdrop-blur-md">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              ROYALE PRIVATE CLIENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-amber-200/80 border border-amber-500/20 backdrop-blur-md flex items-center gap-1">
              <Eye className="w-3 h-3 text-amber-400" /> {cardData.views_count || 0}
            </span>
          </div>

          <div className="text-center space-y-1 relative z-10 pt-2">
            <div className="w-8 h-8 rounded-full border border-amber-400/40 mx-auto flex items-center justify-center text-amber-400">
              <Gem className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-amber-300/80">
              ESTABLISHED {cardData.company_est_date || "MMXXIV"}
            </div>
          </div>
        </div>

        {/* Floating Royale Crest Avatar */}
        <div className="absolute left-1/2 -bottom-14 -translate-x-1/2 z-20">
          <div 
            className="w-24 h-24 rounded-full p-1.5 shadow-2xl transition-transform hover:scale-105 duration-300 relative group"
            style={{
              background: `linear-gradient(135deg, #d4af37, #fef08a, #92400e)`,
              boxShadow: `0 12px 35px -5px rgba(212,175,55,0.4)`
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 border-2 border-amber-200 flex items-center justify-center relative">
              <img
                src={cardData.logo_url || "/assets/img/demo/logo.png"}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
              />
            </div>
            <div className="absolute -bottom-1 right-1 p-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full text-black shadow-md">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Prestige Typography Header */}
      <div className="pt-16 px-6 text-center space-y-1.5">
        <h1 className="text-2xl font-bold tracking-wide uppercase text-slate-900 dark:text-amber-100">
          {cardData.company_name}
        </h1>
        <p className="text-xs font-sans font-semibold tracking-wider text-amber-700 dark:text-amber-300/90 uppercase">
          {cardData.personal_name} • <span className="opacity-90">{cardData.designation || "Managing Director"}</span>
        </p>

        {cardData.about_us && (
          <p className="text-xs italic text-slate-600 dark:text-amber-200/70 max-w-sm mx-auto leading-relaxed pt-1">
            "{cardData.about_us}"
          </p>
        )}
      </div>

      {/* 3. Gold Gilded Action Bar */}
      <div className="mx-4 grid grid-cols-4 gap-2 font-sans pt-1">
        <a
          href={`tel:${cardData.phone}`}
          className="p-3 rounded-2xl bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 border border-amber-500/30 hover:border-amber-500 shadow-sm transition flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-700 dark:text-amber-200 uppercase">Call</span>
        </a>

        <a
          href={`https://wa.me/${cardData.whatsapp ? cardData.whatsapp.replace(/\D/g, "") : cardData.phone ? cardData.phone.replace(/\D/g, "") : ""}?text=Hello%20${encodeURIComponent(cardData.company_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 border border-emerald-500/30 hover:border-emerald-500 shadow-sm transition flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-700 dark:text-amber-200 uppercase">Concierge</span>
        </a>

        <a
          href={`mailto:${cardData.email}`}
          className="p-3 rounded-2xl bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 border border-amber-500/30 hover:border-amber-500 shadow-sm transition flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-700 dark:text-amber-200 uppercase">Inquire</span>
        </a>

        <a
          href={`/api/cards/${cardData.slug}/vcard`}
          className="p-3 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 font-black shadow-md hover:opacity-95 transition flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-9 h-9 rounded-full bg-white/30 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Download className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase">Save VIP</span>
        </a>
      </div>

      {/* 4. Luxury Segmented Tabs */}
      <div className="mx-4 p-1 rounded-2xl bg-amber-50/50 dark:bg-slate-900 border border-amber-500/20 flex gap-1 text-[11px] font-sans">
        {["info", "products", "gallery", "pay", "enquiry"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? "bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-sm font-black"
                : "text-slate-600 dark:text-amber-200/70 hover:text-amber-500"
            }`}
          >
            {tab === "pay" ? "Settlement" : tab}
          </button>
        ))}
      </div>

      {/* 5. Content Section */}
      <div className="mx-4 pb-6 font-sans">
        {/* DETAILS */}
        {activeTab === "info" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 divide-y divide-amber-500/10 text-xs shadow-sm">
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-amber-200/70 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500" /> Private Line
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{cardData.phone}</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-amber-200/70 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" /> Direct Dispatch
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono truncate max-w-[200px]">{cardData.email}</span>
              </div>
              {cardData.website && (
                <div className="p-3.5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-amber-200/70 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-500" /> Official Portal
                  </span>
                  <a href={cardData.website} target="_blank" rel="noopener noreferrer" className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                    Visit Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {cardData.address && (
                <div className="p-3.5 flex items-start justify-between gap-4">
                  <span className="text-slate-500 dark:text-amber-200/70 flex items-center gap-2 shrink-0">
                    <MapPin className="w-4 h-4 text-amber-500" /> Headquarters
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{cardData.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 shadow-sm flex items-center justify-around">
              {cardData.social_instagram && (
                <a href={cardData.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:scale-110 transition">
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {cardData.social_linkedin && (
                <a href={cardData.social_linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:scale-110 transition">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {cardData.social_twitter && (
                <a href={cardData.social_twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:scale-110 transition">
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {cardData.social_youtube && (
                <a href={cardData.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:scale-110 transition">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {cardData.social_facebook && (
                <a href={cardData.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:scale-110 transition">
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Video embed */}
            {ytEmbed && (
              <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-black aspect-video shadow-md">
                <iframe src={ytEmbed} title="YouTube" className="w-full h-full" allowFullScreen />
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-3">
            {products && products.length > 0 ? (
              products.map((p) => (
                <div key={p.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 hover:border-amber-500/50 transition flex gap-3.5 shadow-sm">
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} className="w-18 h-18 rounded-xl object-cover border border-amber-500/30" />
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 dark:text-amber-100 text-sm font-serif">{p.name}</h4>
                        <span className="font-bold text-xs text-amber-600 dark:text-amber-400">₹{p.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{p.description}</p>
                    </div>
                    <button
                      onClick={() => handleOrderWhatsApp(p.name, p.price)}
                      className="mt-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Order via Concierge
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-amber-200/50 bg-amber-50/20 dark:bg-slate-900 rounded-2xl border border-dashed border-amber-500/20">
                No bespoke collections currently listed.
              </div>
            )}
          </div>
        )}

        {/* GALLERY */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-2 gap-2.5">
            {gallery && gallery.length > 0 ? (
              gallery.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage && setLightboxImage(img.image_url)}
                  className="rounded-2xl overflow-hidden border border-amber-500/30 aspect-square cursor-pointer group relative shadow-sm"
                >
                  <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent text-[10px] text-amber-200 font-serif truncate">
                      {img.title}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-xs text-slate-400 dark:text-amber-200/50 bg-amber-50/20 dark:bg-slate-900 rounded-2xl border border-dashed border-amber-500/20">
                No gallery photographs listed.
              </div>
            )}
          </div>
        )}

        {/* PAY / SETTLEMENT */}
        {activeTab === "pay" && (
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/30 text-center space-y-3 shadow-md">
              <span className="text-[10px] font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                Instant UPI Settlement
              </span>
              {upiQrUrl && (
                <div className="w-40 h-40 mx-auto p-2.5 rounded-2xl bg-white border-2 border-amber-400 shadow-md">
                  <img src={upiQrUrl} alt="UPI QR" className="w-full h-full object-contain" />
                </div>
              )}
              {cardData.upi_id && (
                <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-slate-950 border border-amber-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-800 dark:text-amber-200 truncate">{cardData.upi_id}</span>
                  <button onClick={() => handleCopy(cardData.upi_id, "upi")} className="text-amber-600 dark:text-amber-400">
                    {copiedItem === "upi" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
            {cardData.bank_account_no && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 text-xs space-y-1.5 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Wire Settlement</div>
                <div className="flex justify-between"><span className="text-slate-500">Bank</span><span className="font-semibold text-slate-800 dark:text-white">{cardData.bank_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Account</span><span className="font-mono font-semibold text-slate-800 dark:text-white">{cardData.bank_account_no}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">IFSC</span><span className="font-mono font-semibold text-slate-800 dark:text-white">{cardData.bank_ifsc}</span></div>
              </div>
            )}
          </div>
        )}

        {/* ENQUIRY */}
        {activeTab === "enquiry" && (
          <form onSubmit={handleEnquirySubmit} className="space-y-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/30 text-xs shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Private Dispatch</h3>
            {enquirySuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" /> Your dispatch has been delivered.
              </div>
            )}
            <input
              type="text"
              placeholder="Your Full Name"
              value={enquiryName}
              onChange={(e) => setEnquiryName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <input
              type="tel"
              placeholder="Contact Telephone"
              value={enquiryPhone}
              onChange={(e) => setEnquiryPhone(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={enquiryEmail}
              onChange={(e) => setEnquiryEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <textarea
              placeholder="Your Request / Inscription"
              rows={3}
              value={enquiryMsg}
              onChange={(e) => setEnquiryMsg(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={enquirySubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow hover:opacity-90 transition"
            >
              <Send className="w-3.5 h-3.5" /> {enquirySubmitting ? "Dispatching..." : "Transmit Dispatch"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
