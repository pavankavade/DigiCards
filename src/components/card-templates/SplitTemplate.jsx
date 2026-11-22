import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, Sparkles, ArrowRight
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function SplitTemplate(props) {
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
      {/* 1. Dramatic Diagonal Split Header */}
      <div className="relative">
        {/* Angled background banner with polygon clip path */}
        <div 
          className="h-44 relative flex items-start justify-between p-4 overflow-hidden"
          style={{ 
            background: currentTheme.gradient,
            clipPath: "polygon(0 0, 100% 0, 100% 82%, 0 100%)"
          }}
        >
          {/* Subtle noise/pattern overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-black/40 text-white backdrop-blur-md border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" /> Premium Connect
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
            <Eye className="w-3 h-3" /> {cardData.views_count || 0}
          </div>
        </div>

        {/* Asymmetric Profile Section: Avatar offset to the left, typography flowing */}
        <div className="px-5 -mt-14 relative z-20 flex items-end gap-4">
          <div 
            className="w-24 h-24 rounded-2xl p-1 shadow-xl shrink-0 rotate-[-2deg] hover:rotate-0 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, #ffffff)`,
              boxShadow: `0 12px 28px -6px ${currentTheme.borderGlow}`
            }}
          >
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-white border border-white flex items-center justify-center">
              <img
                src={cardData.logo_url || "/assets/img/demo/logo.png"}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
              />
            </div>
          </div>

          <div className="flex-1 pb-1">
            <h1 className="text-xl font-black tracking-tight" style={{ color: currentTheme.textColor }}>
              {cardData.company_name}
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {cardData.personal_name} • <span className="text-slate-700 dark:text-slate-300 font-bold">{cardData.designation || "Executive"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bio Pill */}
      {cardData.about_us && (
        <div className="mx-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
          {cardData.about_us}
        </div>
      )}

      {/* 2. Modern High-Contrast Floating Action Pills */}
      <div className="mx-5 grid grid-cols-2 gap-2.5">
        <a
          href={`tel:${cardData.phone}`}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-sm hover:border-slate-400 dark:hover:border-slate-500 transition group"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Direct Call</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px]">{cardData.phone}</div>
          </div>
        </a>

        <a
          href={`https://wa.me/${cardData.whatsapp ? cardData.whatsapp.replace(/\D/g, "") : cardData.phone ? cardData.phone.replace(/\D/g, "") : ""}?text=Hello%20${encodeURIComponent(cardData.company_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-sm hover:border-emerald-400 transition group"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase">WhatsApp</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Chat Live</div>
          </div>
        </a>

        <a
          href={`mailto:${cardData.email}`}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-sm hover:border-purple-400 transition group"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Email</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px]">Send Mail</div>
          </div>
        </a>

        <a
          href={`/api/cards/${cardData.slug}/vcard`}
          className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center gap-3 shadow-md hover:opacity-95 transition group"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20 text-white">
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-300 uppercase">Save Contact</div>
            <div className="text-xs font-bold text-white">Add to Phone</div>
          </div>
        </a>
      </div>

      {/* 3. Segmented Pill Tabs */}
      <div className="mx-5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex gap-1 text-xs">
        {[
          { key: "info", label: "Details" },
          { key: "products", label: "Catalog" },
          { key: "gallery", label: "Showcase" },
          { key: "pay", label: "Pay" },
          { key: "enquiry", label: "Enquire" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              activeTab === tab.key
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Panels */}
      <div className="mx-5 pb-6">
        {/* DETAILS */}
        {activeTab === "info" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Contact Information</h3>
              {cardData.website && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700/40">
                  <span className="text-slate-500 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> Website</span>
                  <a href={cardData.website} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    {cardData.website.replace(/^https?:\/\//, "")} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {cardData.address && (
                <div className="flex items-start justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/40 gap-4">
                  <span className="text-slate-500 flex items-center gap-2 shrink-0"><MapPin className="w-4 h-4 text-rose-500" /> Address</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-right">{cardData.address}</span>
                </div>
              )}
            </div>

            {/* Social Grid */}
            <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Connect on Socials</h3>
              <div className="flex items-center gap-2">
                {cardData.social_instagram && (
                  <a href={cardData.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 flex items-center justify-center hover:scale-105 transition">
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                )}
                {cardData.social_linkedin && (
                  <a href={cardData.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-105 transition">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}
                {cardData.social_twitter && (
                  <a href={cardData.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 flex items-center justify-center hover:scale-105 transition">
                    <TwitterIcon className="w-5 h-5" />
                  </a>
                )}
                {cardData.social_youtube && (
                  <a href={cardData.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-105 transition">
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                )}
                {cardData.social_facebook && (
                  <a href={cardData.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:scale-105 transition">
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Video embed */}
            {ytEmbed && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm aspect-video">
                <iframe src={ytEmbed} title="YouTube" className="w-full h-full" allowFullScreen />
              </div>
            )}
          </div>
        )}

        {/* CATALOG */}
        {activeTab === "products" && (
          <div className="space-y-3">
            {products && products.length > 0 ? (
              products.map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex gap-3.5">
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h4>
                        <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">₹{p.price}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                    </div>
                    <button
                      onClick={() => handleOrderWhatsApp(p.name, p.price)}
                      className="mt-2 py-1.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Order via WhatsApp
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                No catalog items currently listed.
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
                  className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square cursor-pointer group relative shadow-sm"
                >
                  <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-white font-medium truncate">
                      {img.title}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                No gallery photos available.
              </div>
            )}
          </div>
        )}

        {/* PAY */}
        {activeTab === "pay" && (
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 shadow-sm text-center space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Scan to Pay via UPI</h3>
              {upiQrUrl && (
                <div className="w-44 h-44 mx-auto p-2.5 rounded-2xl bg-white border border-slate-200 shadow-md">
                  <img src={upiQrUrl} alt="UPI QR" className="w-full h-full object-contain" />
                </div>
              )}
              {cardData.upi_id && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{cardData.upi_id}</span>
                  <button onClick={() => handleCopy(cardData.upi_id, "upi")} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                    {copiedItem === "upi" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {cardData.bank_account_no && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 shadow-sm text-xs space-y-2">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Direct Bank Wire</h4>
                <div className="flex justify-between"><span className="text-slate-500">Bank</span><span className="font-semibold text-slate-800 dark:text-slate-200">{cardData.bank_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Account No</span><span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{cardData.bank_account_no}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">IFSC Code</span><span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{cardData.bank_ifsc}</span></div>
              </div>
            )}
          </div>
        )}

        {/* ENQUIRY */}
        {activeTab === "enquiry" && (
          <form onSubmit={handleEnquirySubmit} className="space-y-3 p-5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 shadow-sm text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Send Direct Message</h3>
            {enquirySuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" /> Your message has been sent successfully!
              </div>
            )}
            <input
              type="text"
              placeholder="Your Full Name"
              value={enquiryName}
              onChange={(e) => setEnquiryName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={enquiryPhone}
              onChange={(e) => setEnquiryPhone(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
            />
            <input
              type="email"
              placeholder="Email Address (optional)"
              value={enquiryEmail}
              onChange={(e) => setEnquiryEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
            />
            <textarea
              placeholder="How can we help you?"
              rows={3}
              value={enquiryMsg}
              onChange={(e) => setEnquiryMsg(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
            />
            <button
              type="submit"
              disabled={enquirySubmitting}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow hover:opacity-95 transition"
            >
              <Send className="w-3.5 h-3.5" /> {enquirySubmitting ? "Sending..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
