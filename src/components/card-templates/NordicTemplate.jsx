import React from "react";
import { 
  Phone, MessageSquare, Mail, Globe, MapPin, Download, Share2, 
  Copy, Check, ExternalLink, Play, ShoppingCart, Send, CreditCard, 
  ShieldCheck, Clock, CheckCircle2, Eye, Compass, Feather, Minus
} from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";

export default function NordicTemplate(props) {
  const {
    cardData, products, gallery, currentTheme, activeTab, setActiveTab,
    handleCopy, copiedItem, sharePhone, setSharePhone, handleDirectShare,
    handleOrderWhatsApp, upiQrUrl, ytEmbed, setLightboxImage,
    enquiryName, setEnquiryName, enquiryPhone, setEnquiryPhone,
    enquiryEmail, setEnquiryEmail, enquiryMsg, setEnquiryMsg,
    enquirySubmitting, enquirySuccess, handleEnquirySubmit
  } = props;

  return (
    <div className="space-y-4 font-sans text-stone-900 dark:text-stone-100">
      {/* 1. Nordic Minimal Header */}
      <div className="p-6 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-3">
        <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1 uppercase tracking-widest text-[9px] font-semibold">
            <Feather className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
            Nordic Minimal
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {cardData.views_count || 0}
          </span>
        </div>

        <div className="w-20 h-20 rounded-full mx-auto p-1 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
          <img
            src={cardData.logo_url || "/assets/img/demo/logo.png"}
            alt="Logo"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => { e.target.src = "/assets/img/demo/logo.png"; }}
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-light tracking-tight text-stone-900 dark:text-white">
            {cardData.company_name}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-normal">
            {cardData.personal_name} <span className="text-stone-400 dark:text-stone-600">/</span> {cardData.designation || "Director"}
          </p>
        </div>

        {cardData.about_us && (
          <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed max-w-xs mx-auto pt-2 border-t border-stone-200 dark:border-stone-800">
            {cardData.about_us}
          </p>
        )}
      </div>

      {/* 2. Quiet Luxury Action Bar */}
      <div className="grid grid-cols-4 gap-2">
        <a
          href={`tel:${cardData.phone}`}
          className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition flex flex-col items-center justify-center gap-1 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-stone-600 dark:text-stone-400">Call</span>
        </a>

        <a
          href={`https://wa.me/${cardData.whatsapp ? cardData.whatsapp.replace(/\D/g, "") : cardData.phone ? cardData.phone.replace(/\D/g, "") : ""}?text=Hello%20${encodeURIComponent(cardData.company_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition flex flex-col items-center justify-center gap-1 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-stone-600 dark:text-stone-400">Chat</span>
        </a>

        <a
          href={`mailto:${cardData.email}`}
          className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition flex flex-col items-center justify-center gap-1 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-stone-600 dark:text-stone-400">Mail</span>
        </a>

        <a
          href={cardData.location_url || (cardData.address ? `https://maps.google.com/?q=${encodeURIComponent(cardData.address)}` : "#")}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition flex flex-col items-center justify-center gap-1 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-stone-600 dark:text-stone-400">Map</span>
        </a>
      </div>

      {/* 3. Refined Information List */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3 text-xs shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-stone-500 text-[11px]">Direct Phone</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-800 dark:text-stone-200">{cardData.phone}</span>
            <button onClick={() => handleCopy(cardData.phone, "phone")} className="text-stone-400 hover:text-stone-700">
              {copiedItem === "phone" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {cardData.email && (
          <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-2.5">
            <span className="text-stone-500 text-[11px]">Email</span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-stone-800 dark:text-stone-200 truncate">{cardData.email}</span>
              <button onClick={() => handleCopy(cardData.email, "email")} className="text-stone-400 hover:text-stone-700">
                {copiedItem === "email" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}

        {cardData.website && (
          <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-2.5">
            <span className="text-stone-500 text-[11px]">Website</span>
            <a 
              href={cardData.website.startsWith("http") ? cardData.website : `https://${cardData.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-800 dark:text-stone-200 hover:underline truncate"
            >
              {cardData.website}
            </a>
          </div>
        )}

        {cardData.address && (
          <div className="border-t border-stone-100 dark:border-stone-800 pt-2.5">
            <span className="text-stone-500 text-[11px] block">Location</span>
            <span className="font-normal text-stone-700 dark:text-stone-300 leading-relaxed block mt-0.5">{cardData.address}</span>
          </div>
        )}
      </div>

      {/* 4. Minimalist Tab Bar */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 px-2">
        {[
          { id: "products", label: "Collection" },
          { id: "gallery", label: "Gallery" },
          { id: "payment", label: "Settlement" },
          { id: "enquiry", label: "Inquire" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 pb-2.5 text-xs transition relative ${
              activeTab === tab.id
                ? "font-semibold text-stone-900 dark:text-white"
                : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-stone-900 dark:bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 5. Tab Panels */}
      <div>
        {activeTab === "products" && (
          <div className="space-y-2.5">
            {products.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                Collection details pending.
              </div>
            ) : (
              products.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex gap-3.5 items-center shadow-sm"
                >
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-medium text-stone-900 dark:text-white truncate">{item.name}</h3>
                    {item.description && <p className="text-[11px] text-stone-500 font-light line-clamp-1">{item.description}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {item.price ? `₹${item.price}` : "Custom"}
                      </span>
                      <button
                        onClick={() => handleOrderWhatsApp(item.name, item.price)}
                        className="px-3 py-1 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 transition"
                      >
                        Order via WhatsApp
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
              <div className="col-span-2 p-8 text-center text-xs text-stone-400">
                No gallery photographs provided.
              </div>
            ) : (
              gallery.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setLightboxImage(img.image_url)}
                  className="group aspect-square rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 cursor-pointer relative shadow-sm"
                >
                  <img src={img.image_url} alt={img.title || "Gallery"} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-[10px] text-white font-normal truncate">
                      {img.title}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "payment" && (
          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Payment & Settlement
            </div>

            {cardData.upi_id && (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 text-center space-y-2 border border-stone-200 dark:border-stone-800">
                {upiQrUrl && (
                  <div className="p-2 bg-white rounded-xl inline-block shadow-sm">
                    <img src={upiQrUrl} alt="UPI QR" className="w-36 h-36 mx-auto" />
                  </div>
                )}
                <div className="text-xs font-mono font-medium text-stone-700 dark:text-stone-300">{cardData.upi_id}</div>
                <button
                  onClick={() => handleCopy(cardData.upi_id, "upi")}
                  className="px-3 py-1 rounded-full text-xs bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 transition"
                >
                  {copiedItem === "upi" ? "Copied" : "Copy UPI"}
                </button>
              </div>
            )}

            {(cardData.bank_account_no || cardData.bank_ifsc) && (
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 text-xs space-y-1 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
                <div className="font-medium text-[10px] uppercase text-stone-400">Direct Bank Details</div>
                {cardData.bank_name && <div>Bank: <span className="text-stone-800 dark:text-stone-200">{cardData.bank_name}</span></div>}
                {cardData.bank_account_no && <div>Account: <span className="font-mono text-stone-800 dark:text-stone-200">{cardData.bank_account_no}</span></div>}
                {cardData.bank_ifsc && <div>IFSC: <span className="font-mono text-stone-800 dark:text-stone-200">{cardData.bank_ifsc}</span></div>}
              </div>
            )}
          </div>
        )}

        {activeTab === "enquiry" && (
          <form onSubmit={handleEnquirySubmit} className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2.5">
            <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Direct Contact
            </div>

            {enquirySuccess && (
              <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Your message has been received.
              </div>
            )}

            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Name"
                required
                value={enquiryName}
                onChange={(e) => setEnquiryName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-400"
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                value={enquiryPhone}
                onChange={(e) => setEnquiryPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-400"
              />
              <textarea
                placeholder="Message"
                rows={3}
                value={enquiryMsg}
                onChange={(e) => setEnquiryMsg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-400 resize-none"
              />
              <button
                type="submit"
                disabled={enquirySubmitting}
                className="w-full py-2.5 rounded-xl text-xs font-medium bg-stone-900 text-white dark:bg-white dark:text-stone-900 hover:opacity-90 transition disabled:opacity-50"
              >
                {enquirySubmitting ? "Sending..." : "Submit Message"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 6. Footer Contact Save */}
      <a
        href={`/api/cards/public/${cardData.slug}/vcard`}
        className="w-full py-3.5 rounded-2xl font-medium text-xs tracking-wide bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 shadow-sm flex items-center justify-center gap-2 transition"
      >
        <Download className="w-4 h-4" /> Save Contact Card
      </a>
    </div>
  );
}
