import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, Terminal, Cpu, Zap, Wifi
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function CyberTemplate(props) {
  const {
    cardData, products, gallery, currentTheme, activeTab, setActiveTab,
    handleCopy, copiedItem, sharePhone, setSharePhone, handleDirectShare,
    handleOrderWhatsApp, upiQrUrl, ytEmbed, setLightboxImage,
    enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone,
    enquiryEmail, setEnquiryEmail, enquiryMsg, setEnquiryMsg,
    enquirySubmitting, enquirySuccess, handleEnquirySubmit
  } = props;

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Cyber HUD Top Bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between text-[11px] border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-widest uppercase">SYS.ONLINE // ID: {cardData.slug || "01"}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> SECURE</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {cardData.views_count || 0}</span>
        </div>
      </div>

      {/* 2. Cyber Header with Matrix / Grid Banner */}
      <div className="relative px-4">
        <div 
          className="h-36 rounded-2xl relative overflow-hidden border border-cyan-500/30 flex items-center justify-center"
          style={{ background: currentTheme.gradient }}
        >
          {/* Cyber Grid Lines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffff15_1px,transparent_1px),linear-gradient(to_bottom,#00ffff15_1px,transparent_1px)] bg-[size:16px_16px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
              NODE v2.4
            </span>
          </div>
        </div>

        {/* Futuristic Hex / Octagon Avatar */}
        <div className="flex items-end gap-3 -mt-10 px-2 relative z-10">
          <div 
            className="w-20 h-20 rounded-2xl p-1 bg-slate-950 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative group"
          >
            <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={cardData.logo_url || "/assets/img/demo/logo.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-cyan-500 rounded-lg text-black font-black text-[9px]">
              PRO
            </div>
          </div>

          <div className="flex-1 pb-1">
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 tracking-wider">
              <Cpu className="w-3 h-3" /> VERIFIED OPERATOR
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase truncate">
              {cardData.company_name}
            </h1>
            <p className="text-xs text-slate-300 font-sans">
              {cardData.personal_name} <span className="text-cyan-400 font-mono">//</span> {cardData.designation || "Lead Engineer"}
            </p>
          </div>
        </div>
      </div>

      {/* Cyber Tagline */}
      {cardData.about_us && (
        <div className="mx-4 p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 text-xs text-slate-300 font-sans leading-relaxed flex items-start gap-2">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="italic font-mono text-[11px]">"{cardData.about_us}"</p>
        </div>
      )}

      {/* 3. High-Voltage Cyber Action Matrix */}
      <div className="mx-4 grid grid-cols-4 gap-2">
        <a
          href={`tel:${cardData.phone}`}
          className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition flex flex-col items-center justify-center gap-1 text-center group"
        >
          <Phone className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-slate-200">CALL</span>
        </a>
        <a
          href={`https://wa.me/${cardData.whatsapp ? cardData.whatsapp.replace(/\D/g, "") : cardData.phone ? cardData.phone.replace(/\D/g, "") : ""}?text=Hello%20${encodeURIComponent(cardData.company_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition flex flex-col items-center justify-center gap-1 text-center group"
        >
          <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-slate-200">SIGNAL</span>
        </a>
        <a
          href={`mailto:${cardData.email}`}
          className="p-3 rounded-xl bg-slate-950 border border-violet-500/30 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition flex flex-col items-center justify-center gap-1 text-center group"
        >
          <Mail className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-slate-200">DISPATCH</span>
        </a>
        <a
          href={`/api/cards/${cardData.slug}/vcard`}
          className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition flex flex-col items-center justify-center gap-1 text-center group"
        >
          <Download className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-slate-200">SYNC vCF</span>
        </a>
      </div>

      {/* 4. Cyber Tabs Navigation */}
      <div className="mx-4 p-1 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex gap-1 text-[11px]">
        {["info", "products", "gallery", "pay", "enquiry"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all ${
              activeTab === tab
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab === "pay" ? "PAY" : tab}
          </button>
        ))}
      </div>

      {/* 5. Cyber Tab Content */}
      <div className="mx-4 pb-6 font-sans">
        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="space-y-3 font-mono">
            <div className="rounded-xl bg-slate-950/70 border border-cyan-500/20 divide-y divide-cyan-500/10 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" /> DIRECT_LINE
                </span>
                <span className="font-semibold text-white">{cardData.phone}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> EMAIL_ENDPOINT
                </span>
                <span className="font-semibold text-white truncate max-w-[200px]">{cardData.email}</span>
              </div>
              {cardData.website && (
                <div className="p-3 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> WEB_PORTAL
                  </span>
                  <a href={cardData.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-400 hover:underline flex items-center gap-1">
                    VISIT <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {cardData.address && (
                <div className="p-3 flex items-start justify-between gap-4">
                  <span className="text-slate-400 flex items-center gap-2 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> PHYSICAL_NODE
                  </span>
                  <span className="font-semibold text-white text-right font-sans">{cardData.address}</span>
                </div>
              )}
            </div>

            {/* Social Grid */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20">
              <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
                // EXTERNAL_COMMUNITIES
              </div>
              <div className="flex flex-wrap gap-2">
                {cardData.social_instagram && (
                  <a href={cardData.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {cardData.social_linkedin && (
                  <a href={cardData.social_linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition">
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {cardData.social_twitter && (
                  <a href={cardData.social_twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition">
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                )}
                {cardData.social_youtube && (
                  <a href={cardData.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition">
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                )}
                {cardData.social_facebook && (
                  <a href={cardData.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition">
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Video embed */}
            {ytEmbed && (
              <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 aspect-video">
                <iframe src={ytEmbed} title="YouTube" className="w-full h-full" allowFullScreen />
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-3 font-mono">
            {products && products.length > 0 ? (
              products.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 hover:border-cyan-400/50 transition flex gap-3">
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} className="w-16 h-16 rounded-lg object-cover border border-cyan-500/30" />
                  )}
                  <div className="flex-1 flex flex-col justify-between font-sans">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">{p.name}</h4>
                        <span className="font-mono text-xs font-black text-cyan-400">₹{p.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{p.description}</p>
                    </div>
                    <button
                      onClick={() => handleOrderWhatsApp(p.name, p.price)}
                      className="mt-2 py-1 px-3 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center gap-1 hover:bg-cyan-500/30"
                    >
                      <ShoppingCart className="w-3 h-3" /> ORDER_DISPATCH
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs font-mono text-slate-500 border border-cyan-500/10 rounded-xl">
                NO_CATALOG_DATA_FOUND
              </div>
            )}
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-2 gap-2 font-mono">
            {gallery && gallery.length > 0 ? (
              gallery.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage && setLightboxImage(img.image_url)}
                  className="rounded-xl overflow-hidden border border-cyan-500/20 aspect-square cursor-pointer group relative bg-slate-950"
                >
                  <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/80 text-[10px] text-cyan-300 font-mono truncate">
                      {img.title}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-xs font-mono text-slate-500 border border-cyan-500/10 rounded-xl">
                NO_TELEMETRY_IMAGES
              </div>
            )}
          </div>
        )}

        {/* PAY TAB */}
        {activeTab === "pay" && (
          <div className="space-y-3 font-mono">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center space-y-3">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                // UPI_TRANSFER_PORT
              </div>
              {upiQrUrl && (
                <div className="w-40 h-40 mx-auto p-2 rounded-xl bg-white border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <img src={upiQrUrl} alt="UPI QR" className="w-full h-full object-contain" />
                </div>
              )}
              {cardData.upi_id && (
                <div className="p-2 rounded-lg bg-slate-900 border border-cyan-500/20 flex items-center justify-between text-xs">
                  <span className="text-cyan-300 truncate">{cardData.upi_id}</span>
                  <button onClick={() => handleCopy(cardData.upi_id, "upi")} className="text-cyan-400 hover:text-cyan-200">
                    {copiedItem === "upi" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
            {cardData.bank_account_no && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs space-y-1">
                <div className="text-slate-400 text-[10px]">// SETTLEMENT_DETAILS</div>
                <div className="text-white">BANK: {cardData.bank_name}</div>
                <div className="text-white">ACC: {cardData.bank_account_no}</div>
                <div className="text-white">IFSC: {cardData.bank_ifsc}</div>
              </div>
            )}
          </div>
        )}

        {/* ENQUIRY TAB */}
        {activeTab === "enquiry" && (
          <form onSubmit={handleEnquirySubmit} className="space-y-3 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 font-mono text-xs">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">
              // TRANSMIT_ENQUIRY_PACKET
            </div>
            {enquirySuccess && (
              <div className="p-2 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[11px] flex items-center gap-2">
                <Check className="w-4 h-4" /> PACKET_RECEIVED_ACK
              </div>
            )}
            <input
              type="text"
              placeholder="CALLSIGN (Name)"
              value={enquiryName}
              onChange={(e) => setEnquiryName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="COMMS (Phone)"
              value={enquiryPhone}
              onChange={(e) => setEnquiryPhone(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="email"
              placeholder="PACKET_DEST (Email)"
              value={enquiryEmail}
              onChange={(e) => setEnquiryEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <textarea
              placeholder="PAYLOAD (Message)"
              rows={3}
              value={enquiryMsg}
              onChange={(e) => setEnquiryMsg(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={enquirySubmitting}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Send className="w-3.5 h-3.5" /> {enquirySubmitting ? "TRANSMITTING..." : "FIRE_TRANSMISSION"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
