import React, { useState } from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, ChevronDown, ChevronUp,
  Layers, QrCode, Image, MessageCircle
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function CompactTemplate(props) {
  const {
    cardData, products, gallery, currentTheme, activeTab, setActiveTab,
    handleCopy, copiedItem, sharePhone, setSharePhone, handleDirectShare,
    handleOrderWhatsApp, upiQrUrl, ytEmbed, setLightboxImage,
    enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone,
    enquiryEmail, setEnquiryEmail, enquiryMsg, setEnquiryMsg,
    enquirySubmitting, enquirySuccess, handleEnquirySubmit
  } = props;

  // Local collapsible drawers for the compact link-in-bio view
  const [openDrawer, setOpenDrawer] = useState("products");

  const toggleDrawer = (drawer) => {
    setOpenDrawer(openDrawer === drawer ? null : drawer);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* 1. Sleek Compact Bio Card */}
      <div className="pt-2 text-center space-y-2.5">
        {/* Rounded Avatar with Glow Ring */}
        <div className="relative inline-block">
          <div 
            className="w-20 h-20 rounded-full p-1 shadow-lg transition-transform hover:scale-105 duration-300 mx-auto"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center">
              <img
                src={cardData.logo_url || "/assets/img/demo/logo.png"}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
              />
            </div>
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Official Business
          </div>
          <h1 className="text-xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">
            {cardData.company_name}
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {cardData.personal_name} • <span className="font-mono text-slate-700 dark:text-slate-300">{cardData.designation || "Founder"}</span>
          </p>
        </div>

        {cardData.about_us && (
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
            {cardData.about_us}
          </p>
        )}
      </div>

      {/* 2. Floating iOS Action Bar */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
        <a
          href={`tel:${cardData.phone}`}
          className="flex-1 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:scale-102 transition"
        >
          <Phone className="w-3.5 h-3.5 text-blue-500" /> Call
        </a>
        <a
          href={`https://wa.me/${cardData.whatsapp ? cardData.whatsapp.replace(/\D/g, "") : cardData.phone ? cardData.phone.replace(/\D/g, "") : ""}?text=Hello%20${encodeURIComponent(cardData.company_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:scale-102 transition"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Chat
        </a>
        <a
          href={`mailto:${cardData.email}`}
          className="flex-1 py-2 px-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:scale-102 transition"
        >
          <Mail className="w-3.5 h-3.5 text-purple-500" /> Mail
        </a>
        <a
          href={`/api/cards/${cardData.slug}/vcard`}
          className="py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs font-black shadow hover:opacity-90 transition"
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 3. Link-in-Bio Bento Expandable Drawers */}
      <div className="space-y-2.5">
        {/* Products / Services Drawer */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden shadow-xs">
          <button
            onClick={() => toggleDrawer("products")}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Catalog & Products</div>
                <div className="text-[10px] text-slate-400">{products ? products.length : 0} items available</div>
              </div>
            </div>
            {openDrawer === "products" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openDrawer === "products" && (
            <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              {products && products.length > 0 ? (
                products.map((p) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {p.image_url && (
                        <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</h4>
                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">₹{p.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOrderWhatsApp(p.name, p.price)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-600 transition"
                    >
                      Order
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-center py-4 text-slate-400">No items available.</p>
              )}
            </div>
          )}
        </div>

        {/* Scan & Pay Drawer */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden shadow-xs">
          <button
            onClick={() => toggleDrawer("pay")}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Scan & Pay (UPI / Bank)</div>
                <div className="text-[10px] text-slate-400">Instant direct payments</div>
              </div>
            </div>
            {openDrawer === "pay" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openDrawer === "pay" && (
            <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
              {upiQrUrl && (
                <div className="w-36 h-36 mx-auto p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <img src={upiQrUrl} alt="UPI QR" className="w-full h-full object-contain" />
                </div>
              )}
              {cardData.upi_id && (
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{cardData.upi_id}</span>
                  <button onClick={() => handleCopy(cardData.upi_id, "upi")} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                    {copiedItem === "upi" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
              {cardData.bank_account_no && (
                <div className="text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] space-y-1">
                  <div><span className="text-slate-400">Bank:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{cardData.bank_name}</span></div>
                  <div><span className="text-slate-400">A/C:</span> <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{cardData.bank_account_no}</span></div>
                  <div><span className="text-slate-400">IFSC:</span> <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{cardData.bank_ifsc}</span></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gallery Showcase Drawer */}
        {gallery && gallery.length > 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden shadow-xs">
            <button
              onClick={() => toggleDrawer("gallery")}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Photo Portfolio</div>
                  <div className="text-[10px] text-slate-400">{gallery.length} photos</div>
                </div>
              </div>
              {openDrawer === "gallery" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openDrawer === "gallery" && (
              <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setLightboxImage && setLightboxImage(img.image_url)}
                    className="rounded-xl overflow-hidden aspect-square cursor-pointer hover:opacity-90 transition"
                  >
                    <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Message / Enquiry Drawer */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden shadow-xs">
          <button
            onClick={() => toggleDrawer("enquiry")}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Send Message / Enquiry</div>
                <div className="text-[10px] text-slate-400">Direct response from owner</div>
              </div>
            </div>
            {openDrawer === "enquiry" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openDrawer === "enquiry" && (
            <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleEnquirySubmit} className="space-y-2 text-xs pt-2">
                {enquirySuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" /> Message received!
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Your Name"
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <textarea
                  placeholder="Your Message..."
                  rows={2}
                  value={enquiryMsg}
                  onChange={(e) => setEnquiryMsg(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={enquirySubmitting}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> {enquirySubmitting ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* 4. Social Links Pill Row */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {cardData.social_instagram && (
          <a href={cardData.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-pink-600 hover:scale-110 transition">
            <InstagramIcon className="w-4 h-4" />
          </a>
        )}
        {cardData.social_linkedin && (
          <a href={cardData.social_linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-600 hover:scale-110 transition">
            <LinkedinIcon className="w-4 h-4" />
          </a>
        )}
        {cardData.social_twitter && (
          <a href={cardData.social_twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sky-500 hover:scale-110 transition">
            <TwitterIcon className="w-4 h-4" />
          </a>
        )}
        {cardData.social_youtube && (
          <a href={cardData.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-red-600 hover:scale-110 transition">
            <YoutubeIcon className="w-4 h-4" />
          </a>
        )}
        {cardData.social_facebook && (
          <a href={cardData.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 hover:scale-110 transition">
            <FacebookIcon className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Footer View Count */}
      <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
        <Eye className="w-3 h-3" /> {cardData.views_count || 0} visits recorded
      </div>
    </div>
  );
}
