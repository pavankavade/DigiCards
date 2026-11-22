import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, Building, ArrowUpRight
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function EditorialTemplate(props) {
  const {
    cardData, products, gallery, currentTheme, activeTab, setActiveTab,
    handleCopy, copiedItem, sharePhone, setSharePhone, handleDirectShare,
    handleOrderWhatsApp, upiQrUrl, ytEmbed, setLightboxImage,
    enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone,
    enquiryEmail, setEnquiryEmail, enquiryMsg, setEnquiryMsg,
    enquirySubmitting, enquirySuccess, handleEnquirySubmit
  } = props;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* 1. Editorial Header (No curved banner - pure sophisticated typography & asymmetric logo) */}
      <div className="pt-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 max-w-[70%]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified Profile
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase" style={{ color: currentTheme.textColor }}>
              {cardData.company_name}
            </h1>
            <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
              {cardData.personal_name} • <span className="font-mono">{cardData.designation || "Director"}</span>
            </p>
          </div>

          {/* Square / Sharp Modern Logo */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-sm shrink-0 p-1">
            <img
              src={cardData.logo_url || "/assets/img/demo/logo.png"}
              alt="Logo"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
            />
          </div>
        </div>

        {/* Minimal Bio Quote */}
        {cardData.about_us && (
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-serif italic border-l-2 pl-3 border-slate-300 dark:border-slate-700">
            "{cardData.about_us}"
          </p>
        )}
      </div>

      {/* 2. Editorial Horizontal Action Strip (Clean outline pills) */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${cardData.phone}`}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-center justify-between text-xs font-bold hover:border-slate-400 transition"
        >
          <span className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>Call Now</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
        </a>

        <a
          href={`https://api.whatsapp.com/send?phone=${(cardData.whatsapp || cardData.phone || "").replace(/[^0-9]/g, "")}&text=Hi,%20I%20viewed%20your%20Digital%20Card.`}
          target="_blank"
          rel="noreferrer"
          className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-between text-xs font-bold hover:bg-emerald-500/20 transition"
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
        </a>

        <a
          href={`mailto:${cardData.email}`}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-center justify-between text-xs font-bold hover:border-slate-400 transition"
        >
          <span className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>Send Email</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
        </a>

        <a
          href={`/api/cards/public/${cardData.slug}/vcard`}
          download
          className="p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-between text-xs font-bold hover:bg-indigo-500/20 transition"
        >
          <span className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            <span>Save Contact</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
        </a>
      </div>

      {/* 3. Direct WhatsApp Share */}
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <form onSubmit={handleDirectShare} className="flex items-center gap-2">
          <input
            type="tel"
            placeholder="Share via WhatsApp number..."
            value={sharePhone}
            onChange={(e) => setSharePhone(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold focus:outline-none placeholder:text-slate-400"
          />
          <button type="submit" className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black">
            Send
          </button>
        </form>
      </div>

      {/* 4. Contact Details List (Minimalist Clean Table) */}
      <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Direct Contact</h3>
        {cardData.phone && (
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-xs">
            <span className="text-slate-400">Telephone</span>
            <div className="flex items-center gap-2 font-mono font-bold">
              <span>{cardData.phone}</span>
              <button onClick={() => handleCopy(cardData.phone, "phone")} className="text-slate-400 hover:text-indigo-500">
                {copiedItem === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
        {cardData.email && (
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-xs">
            <span className="text-slate-400">Email</span>
            <div className="flex items-center gap-2 font-mono font-bold">
              <span className="truncate max-w-[180px]">{cardData.email}</span>
              <button onClick={() => handleCopy(cardData.email, "email")} className="text-slate-400 hover:text-indigo-500">
                {copiedItem === "email" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
        {cardData.address && (
          <div className="flex items-start justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-xs">
            <span className="text-slate-400">Address</span>
            <span className="text-right font-medium max-w-[200px] leading-tight">{cardData.address}</span>
          </div>
        )}
      </div>

      {/* 5. Clean Social Badges Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Channels</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Instagram", icon: InstagramIcon, url: cardData.social_instagram },
            { name: "LinkedIn", icon: LinkedinIcon, url: cardData.social_linkedin },
            { name: "YouTube", icon: YoutubeIcon, url: cardData.social_youtube },
            { name: "Twitter", icon: TwitterIcon, url: cardData.social_twitter },
            { name: "Telegram", icon: Send, url: cardData.social_telegram },
            { name: "Website", icon: Globe, url: cardData.website }
          ].filter(s => s.url).map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <s.icon className="w-3.5 h-3.5" />
              <span>{s.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 6. Products Showcase (Editorial Card Grid) */}
      {products.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Catalog ({products.length})</h3>
            <span className="text-[10px] font-mono text-emerald-600">IN STOCK</span>
          </div>
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex gap-3.5 items-center">
                <img src={p.image_url || "/assets/img/demo/prod1.png"} alt={p.title} className="w-16 h-16 rounded-xl object-cover shrink-0" onError={(e) => { e.target.src = "/assets/img/demo/prod1.png"; }} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black truncate">{p.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black">₹{p.discount_price || p.price}</span>
                    <button onClick={() => handleOrderWhatsApp(p)} className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black">
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Clean QR Code Payment Box */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">UPI Instant Payment</h3>
        <div className="p-2 bg-white rounded-xl inline-block shadow-sm">
          {upiQrUrl ? <img src={upiQrUrl} alt="UPI QR" className="w-36 h-36 object-contain mx-auto" /> : <div>QR...</div>}
        </div>
        <p className="text-xs font-mono font-bold">UPI: {cardData.payment_upi_id || "pay@upi"}</p>
      </div>

      {/* 8. Inquiry Form */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Direct Inquiries</h3>
        {enquirySuccess ? (
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl text-center text-xs font-bold">
            Thank you. Your message has been dispatched.
          </div>
        ) : (
          <form onSubmit={handleEnquirySubmit} className="space-y-2">
            <input type="text" required placeholder="Name *" value={enquiryName} onChange={(e) => setEnquiryName(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent font-medium" />
            <input type="tel" required placeholder="Phone *" value={enquiryPhone} onChange={(e) => setEnquiryPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent font-medium" />
            <textarea rows={2} placeholder="Message..." value={enquiryMsg} onChange={(e) => setEnquiryMsg(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent resize-none font-medium" />
            <button type="submit" disabled={enquirySubmitting} className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs">
              {enquirySubmitting ? "Submitting..." : "Send Inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
