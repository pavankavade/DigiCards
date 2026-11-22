import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, LayoutGrid, Sparkles, User, Building, QrCode
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function BentoTemplate(props) {
  const {
    cardData, products, gallery, currentTheme, activeTab, setActiveTab,
    handleCopy, copiedItem, sharePhone, setSharePhone, handleDirectShare,
    handleOrderWhatsApp, upiQrUrl, ytEmbed, setLightboxImage,
    enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone,
    enquiryEmail, setEnquiryEmail, enquiryMsg, setEnquiryMsg,
    enquirySubmitting, enquirySuccess, handleEnquirySubmit
  } = props;

  return (
    <div className="space-y-3 font-sans">
      {/* 1. Bento Top Header / Identity Tile */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 p-1 border border-white/20 shrink-0 shadow-md">
              <img
                src={cardData.logo_url || "/assets/img/demo/logo.png"}
                alt="Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-1">
                <LayoutGrid className="w-3 h-3" /> Bento Architecture
              </div>
              <h1 className="text-lg font-black tracking-tight leading-tight">{cardData.company_name}</h1>
              <p className="text-xs text-slate-400 font-medium">{cardData.personal_name} • {cardData.designation || "Executive"}</p>
            </div>
          </div>

          <div className="px-2 py-1 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1 text-[10px] font-bold text-slate-300 shrink-0">
            <Eye className="w-3 h-3 text-blue-400" /> {cardData.views_count || 0}
          </div>
        </div>

        {cardData.about_us && (
          <p className="text-xs text-slate-300/90 leading-relaxed mt-3 pt-3 border-t border-white/10">
            {cardData.about_us}
          </p>
        )}
      </div>

      {/* 2. Asymmetric Bento Grid Tiles */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Tile A: Direct Phone */}
        <a 
          href={`tel:${cardData.phone}`}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Call</span>
          </div>
          <div className="mt-3">
            <div className="text-[10px] text-slate-500">Contact</div>
            <div className="text-xs font-black text-slate-900 dark:text-white truncate">{cardData.phone}</div>
          </div>
        </a>

        {/* Tile B: WhatsApp Connect */}
        <a 
          href={`https://wa.me/${cardData.whatsapp ? cardData.whatsapp.replace(/\D/g, "") : cardData.phone ? cardData.phone.replace(/\D/g, "") : ""}?text=Hello%20${encodeURIComponent(cardData.company_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Instant</span>
          </div>
          <div className="mt-3">
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">WhatsApp Chat</div>
            <div className="text-xs font-black text-emerald-900 dark:text-emerald-200">Start Discussion →</div>
          </div>
        </a>

        {/* Tile C: Email & Web (Span 2 or 1) */}
        {cardData.email && (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <button
                onClick={() => handleCopy(cardData.email, "email")}
                className="text-[10px] font-bold text-slate-400 hover:text-purple-600 flex items-center gap-0.5"
              >
                {copiedItem === "email" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="mt-3">
              <div className="text-[10px] text-slate-500">Official Inquiries</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{cardData.email}</div>
            </div>
          </div>
        )}

        {/* Tile D: Location / Address */}
        <a 
          href={cardData.location_url || (cardData.address ? `https://maps.google.com/?q=${encodeURIComponent(cardData.address)}` : "#")}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition flex flex-col justify-between ${cardData.email ? "" : "col-span-2"}`}
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-3">
            <div className="text-[10px] text-slate-500">Office Coordinates</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{cardData.address || "HQ Location"}</div>
          </div>
        </a>
      </div>

      {/* 3. Bento Segmented Navigation */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        {[
          { id: "products", label: "Catalog" },
          { id: "gallery", label: "Gallery" },
          { id: "payment", label: "Payment" },
          { id: "enquiry", label: "Inquire" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Panels */}
      <div>
        {activeTab === "products" && (
          <div className="space-y-2.5">
            {products.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                Catalog currently in update.
              </div>
            ) : (
              products.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3.5"
                >
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h3>
                    {item.description && <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                        {item.price ? `₹${item.price}` : "Custom Quote"}
                      </span>
                      <button
                        onClick={() => handleOrderWhatsApp(item.name, item.price)}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition flex items-center gap-1"
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
          <div className="grid grid-cols-2 gap-2">
            {gallery.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-xs text-slate-400 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                No portfolio media added.
              </div>
            ) : (
              gallery.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setLightboxImage(img.image_url)}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <img src={img.image_url} alt={img.title || "Gallery"} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 text-[10px] font-medium text-white truncate">
                      {img.title}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "payment" && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Fast Settlement</h3>
            </div>

            {cardData.upi_id && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-center space-y-2 border border-slate-200 dark:border-slate-800">
                {upiQrUrl && (
                  <div className="p-2 bg-white rounded-xl inline-block shadow-sm">
                    <img src={upiQrUrl} alt="UPI QR" className="w-36 h-36 mx-auto" />
                  </div>
                )}
                <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{cardData.upi_id}</div>
                <button
                  onClick={() => handleCopy(cardData.upi_id, "upi")}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition"
                >
                  {copiedItem === "upi" ? "Copied!" : "Copy UPI ID"}
                </button>
              </div>
            )}

            {(cardData.bank_account_no || cardData.bank_ifsc) && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs space-y-1 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-[10px] uppercase text-slate-400">NEFT / RTGS Bank Coordinates</div>
                {cardData.bank_name && <div>Bank: <strong>{cardData.bank_name}</strong></div>}
                {cardData.bank_account_no && <div>Account: <strong className="font-mono">{cardData.bank_account_no}</strong></div>}
                {cardData.bank_ifsc && <div>IFSC: <strong className="font-mono">{cardData.bank_ifsc}</strong></div>}
              </div>
            )}
          </div>
        )}

        {activeTab === "enquiry" && (
          <form onSubmit={handleEnquirySubmit} className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-600" /> Send Message
            </h3>

            {enquirySuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Inquiry dispatched successfully!
              </div>
            )}

            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={enquiryName}
                onChange={(e) => setEnquiryName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                value={enquiryPhone}
                onChange={(e) => setEnquiryPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="How can we assist you?"
                rows={3}
                value={enquiryMsg}
                onChange={(e) => setEnquiryMsg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={enquirySubmitting}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                {enquirySubmitting ? "Sending..." : "Dispatch Inquiry"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 5. Bento Bottom Action: Save Contact */}
      <a
        href={`/api/cards/public/${cardData.slug}/vcard`}
        className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-md flex items-center justify-center gap-2 transition"
      >
        <Download className="w-4 h-4" /> Save Contact to Phone (vCard)
      </a>
    </div>
  );
}
