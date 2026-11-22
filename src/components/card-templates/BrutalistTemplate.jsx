import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, Zap, Flame, Star, Asterisk
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function BrutalistTemplate(props) {
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
      {/* 1. High-Contrast Neo-Brutalist Top Banner */}
      <div className="relative border-4 border-black dark:border-white bg-amber-300 dark:bg-yellow-400 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
            NEO-BRUTALIST
          </div>
          <div className="px-2 py-0.5 bg-white border-2 border-black text-[10px] font-black text-black flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Eye className="w-3 h-3 text-black" /> {cardData.views_count || 0} HITS
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1 shrink-0 overflow-hidden">
            <img
              src={cardData.logo_url || "/assets/img/demo/logo.png"}
              alt="Logo"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black text-black uppercase tracking-tight leading-none break-words">
              {cardData.company_name}
            </h1>
            <p className="text-xs font-black text-black mt-1 bg-white inline-block px-1.5 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {cardData.personal_name} // {cardData.designation || "FOUNDER"}
            </p>
          </div>
        </div>

        {cardData.about_us && (
          <div className="mt-3 p-2 bg-white border-2 border-black text-xs font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] leading-snug">
            "{cardData.about_us}"
          </div>
        )}
      </div>

      {/* 2. Punchy Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={`tel:${cardData.phone}`}
          className="p-3 bg-cyan-400 dark:bg-cyan-300 text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition flex items-center justify-center gap-2 font-black text-xs uppercase"
        >
          <Phone className="w-4 h-4 fill-current" /> DIAL PHONE
        </a>

        <a
          href={`https://wa.me/${cardData.whatsapp ? cardData.whatsapp.replace(/\D/g, "") : cardData.phone ? cardData.phone.replace(/\D/g, "") : ""}?text=Hello%20${encodeURIComponent(cardData.company_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-emerald-400 dark:bg-emerald-300 text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition flex items-center justify-center gap-2 font-black text-xs uppercase"
        >
          <MessageSquare className="w-4 h-4 fill-current" /> WHATSAPP
        </a>

        {cardData.email && (
          <a
            href={`mailto:${cardData.email}`}
            className="p-3 bg-fuchsia-400 dark:bg-fuchsia-300 text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition flex items-center justify-center gap-2 font-black text-xs uppercase"
          >
            <Mail className="w-4 h-4" /> SEND EMAIL
          </a>
        )}

        <a
          href={cardData.location_url || (cardData.address ? `https://maps.google.com/?q=${encodeURIComponent(cardData.address)}` : "#")}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3 bg-rose-400 dark:bg-rose-300 text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition flex items-center justify-center gap-2 font-black text-xs uppercase ${cardData.email ? "" : "col-span-2"}`}
        >
          <MapPin className="w-4 h-4 fill-current" /> MAP COORDS
        </a>
      </div>

      {/* 3. Brutalist Details Box */}
      <div className="border-3 border-black dark:border-white bg-white dark:bg-slate-900 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-black/20 pb-1.5">
          <span className="font-bold text-slate-500 uppercase">PHONE:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-black dark:text-white">{cardData.phone}</span>
            <button onClick={() => handleCopy(cardData.phone, "phone")} className="p-1 hover:bg-yellow-300 border border-black">
              {copiedItem === "phone" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-black dark:text-white" />}
            </button>
          </div>
        </div>

        {cardData.email && (
          <div className="flex items-center justify-between border-b border-black/20 pb-1.5">
            <span className="font-bold text-slate-500 uppercase">EMAIL:</span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-black text-black dark:text-white truncate">{cardData.email}</span>
              <button onClick={() => handleCopy(cardData.email, "email")} className="p-1 hover:bg-yellow-300 border border-black">
                {copiedItem === "email" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-black dark:text-white" />}
              </button>
            </div>
          </div>
        )}

        {cardData.website && (
          <div className="flex items-center justify-between border-b border-black/20 pb-1.5">
            <span className="font-bold text-slate-500 uppercase">URL:</span>
            <a 
              href={cardData.website.startsWith("http") ? cardData.website : `https://${cardData.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-blue-600 dark:text-blue-400 hover:underline truncate"
            >
              {cardData.website}
            </a>
          </div>
        )}

        {cardData.address && (
          <div className="pt-1">
            <span className="font-bold text-slate-500 uppercase block text-[10px]">ADDRESS:</span>
            <span className="font-bold text-black dark:text-white leading-snug">{cardData.address}</span>
          </div>
        )}
      </div>

      {/* 4. Tab Selector Bar */}
      <div className="flex border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        {[
          { id: "products", label: "CATALOG" },
          { id: "gallery", label: "GALLERY" },
          { id: "payment", label: "PAY" },
          { id: "enquiry", label: "INQUIRE" }
        ].map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-black uppercase transition ${idx !== 0 ? "border-l-2 border-black dark:border-white" : ""} ${
              activeTab === tab.id
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-white text-black dark:bg-slate-900 dark:text-white hover:bg-amber-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 5. Tab Panels */}
      <div>
        {activeTab === "products" && (
          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="p-6 border-3 border-black dark:border-white text-center text-xs font-bold bg-white dark:bg-slate-900">
                NO INVENTORY CATALOGED.
              </div>
            ) : (
              products.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex gap-3 items-center"
                >
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover border-2 border-black shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-black dark:text-white uppercase truncate">{item.name}</h3>
                    {item.description && <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans line-clamp-1">{item.description}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-black dark:text-yellow-400 bg-yellow-300 dark:bg-black px-1.5 py-0.5 border border-black">
                        {item.price ? `₹${item.price}` : "INQUIRE"}
                      </span>
                      <button
                        onClick={() => handleOrderWhatsApp(item.name, item.price)}
                        className="px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase hover:bg-yellow-400 hover:text-black transition flex items-center gap-1 border border-black"
                      >
                        <ShoppingCart className="w-3 h-3" /> ORDER
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
              <div className="col-span-2 p-6 border-3 border-black text-center text-xs font-bold bg-white">
                NO MEDIA FOUND.
              </div>
            ) : (
              gallery.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setLightboxImage(img.image_url)}
                  className="group aspect-square border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer overflow-hidden relative"
                >
                  <img src={img.image_url} alt={img.title || "Gallery"} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-black text-white p-1 text-[9px] font-black uppercase truncate">
                      {img.title}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "payment" && (
          <div className="p-4 border-3 border-black dark:border-white bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-black dark:text-white border-b-2 border-black pb-1">
              INSTANT SETTLEMENT
            </div>

            {cardData.upi_id && (
              <div className="p-3 border-2 border-black bg-yellow-200 dark:bg-yellow-400/20 text-center space-y-2">
                <div className="text-[10px] font-black text-black uppercase">SCAN TO PAY (UPI)</div>
                {upiQrUrl && (
                  <div className="p-2 bg-white border-2 border-black inline-block shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <img src={upiQrUrl} alt="UPI QR" className="w-36 h-36 mx-auto" />
                  </div>
                )}
                <div className="text-xs font-mono font-black text-black">{cardData.upi_id}</div>
                <button
                  onClick={() => handleCopy(cardData.upi_id, "upi")}
                  className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase hover:bg-yellow-400 hover:text-black border border-black transition"
                >
                  {copiedItem === "upi" ? "COPIED!" : "COPY UPI ID"}
                </button>
              </div>
            )}

            {(cardData.bank_account_no || cardData.bank_ifsc) && (
              <div className="p-3 border-2 border-black bg-slate-50 dark:bg-slate-800 text-xs space-y-1 text-black dark:text-white">
                <div className="font-black text-[10px] uppercase text-slate-500">BANK TRANSFER DETAILS</div>
                {cardData.bank_name && <div>BANK: <strong>{cardData.bank_name}</strong></div>}
                {cardData.bank_account_no && <div>A/C: <strong className="font-mono">{cardData.bank_account_no}</strong></div>}
                {cardData.bank_ifsc && <div>IFSC: <strong className="font-mono">{cardData.bank_ifsc}</strong></div>}
              </div>
            )}
          </div>
        )}

        {activeTab === "enquiry" && (
          <form onSubmit={handleEnquirySubmit} className="p-4 border-3 border-black dark:border-white bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2.5">
            <div className="text-xs font-black uppercase tracking-wider text-black dark:text-white border-b-2 border-black pb-1">
              DISPATCH DIRECT INQUIRY
            </div>

            {enquirySuccess && (
              <div className="p-2 bg-emerald-400 border-2 border-black text-black text-xs font-black">
                MESSAGE DISPATCHED!
              </div>
            )}

            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="YOUR NAME *"
                required
                value={enquiryName}
                onChange={(e) => setEnquiryName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold focus:outline-none"
              />
              <input
                type="tel"
                placeholder="YOUR PHONE *"
                required
                value={enquiryPhone}
                onChange={(e) => setEnquiryPhone(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold focus:outline-none"
              />
              <textarea
                placeholder="MESSAGE SPECIFICATIONS..."
                rows={3}
                value={enquiryMsg}
                onChange={(e) => setEnquiryMsg(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={enquirySubmitting}
                className="w-full py-3 bg-black text-white dark:bg-yellow-400 dark:text-black font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:text-black border-2 border-black transition"
              >
                {enquirySubmitting ? "SENDING..." : "TRANSMIT INQUIRY →"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 6. Footer Download */}
      <a
        href={`/api/cards/public/${cardData.slug}/vcard`}
        className="w-full py-4 bg-yellow-300 dark:bg-yellow-400 text-black border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-yellow-400 transition flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest"
      >
        <Download className="w-5 h-5" /> DOWNLOAD VCARD CONTACT
      </a>
    </div>
  );
}
