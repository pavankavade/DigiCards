import React, { useState } from 'react';
import { 
  Phone, MessageSquare, Mail, Share2, ShoppingBag, Eye, 
  CreditCard, Sparkles, CheckCircle2, ArrowRight, Star,
  Smartphone, Award, QrCode, Layers, Shield, Download, 
  ChevronRight, Play, ExternalLink
} from 'lucide-react';
import { THEMES } from '../themes';

export default function LandingPage({ setView, openAuthModal }) {
  const [selectedThemeTab, setSelectedThemeTab] = useState('All');
  const [activeHeroCard, setActiveHeroCard] = useState(26);

  const categories = ['All', 'Popular', 'Dark & Cyber', 'Luxury', 'Minimalist', 'Creative Vibrant'];
  const filteredThemes = selectedThemeTab === 'All' 
    ? THEMES.slice(0, 24) 
    : THEMES.filter(t => t.category === selectedThemeTab).slice(0, 24);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>2026 DIGITAL VISITING CARD PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Digital Card Create your <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  online business store
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Create your interactive Digital Visiting Card & Mini Website online in just 5 minutes with <strong>100 premium themes</strong>. 1-click call, WhatsApp, vCard save, online mini-store & payment QR integration.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>Create Your Card</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setView('public-card', 'ABC-Marketing')}
                  className="px-6 py-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-base shadow-sm hover:shadow transition flex items-center gap-2"
                >
                  <Eye className="w-5 h-5 text-indigo-600" />
                  <span>View Live Demo</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100+ Theme Templates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>NFC & QR Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Franchisee / Reseller Hub</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Card Showcase matching frame_010s & frame_215s */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                {/* Glow backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[48px] blur-2xl -z-10" />

                {/* Smartphone Mockup */}
                <div className="rounded-[40px] border-[8px] border-slate-900 bg-white shadow-2xl overflow-hidden relative">
                  {/* Phone Notch */}
                  <div className="h-6 bg-slate-900 flex items-center justify-center">
                    <div className="w-20 h-3.5 bg-slate-800 rounded-b-lg flex items-center justify-center gap-1.5">
                      <div className="w-8 h-1 bg-slate-700 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                    </div>
                  </div>

                  {/* Card Preview Inside Phone */}
                  <div className="p-4 space-y-4 text-center bg-slate-50">
                    {/* Header Banner */}
                    <div className="h-28 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative flex items-center justify-center shadow-inner">
                      <div className="absolute -bottom-8 w-20 h-20 rounded-full border-4 border-white bg-amber-400 overflow-hidden shadow-lg flex items-center justify-center font-extrabold text-slate-900 text-xl">
                        ABC
                      </div>
                    </div>

                    <div className="pt-6">
                      <h3 className="font-black text-xl text-slate-900">ABC MARKETING</h3>
                      <p className="text-xs text-slate-500 font-semibold">Irshad Kamil • CEO & Founder</p>
                    </div>

                    {/* Quick 4 action buttons matching video */}
                    <div className="grid grid-cols-4 gap-2 px-2">
                      {[
                        { icon: Phone, label: 'Call', color: 'bg-orange-500' },
                        { icon: MessageSquare, label: 'WhatsApp', color: 'bg-emerald-500' },
                        { icon: Mail, label: 'Mail', color: 'bg-blue-500' },
                        { icon: Share2, label: 'Share', color: 'bg-purple-500' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div className={`w-11 h-11 rounded-full ${item.color} text-white flex items-center justify-center shadow-md`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Mini details card */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-left text-xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-orange-500" />
                        <span className="font-semibold">+91 7367063161</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-orange-500" />
                        <span className="truncate">abcmarketingofficial@gmail.com</span>
                      </div>
                    </div>

                    {/* Direct WhatsApp Share Input matching frame_075s */}
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 text-xs shadow-sm">
                      <span className="bg-slate-100 px-2 py-2 text-slate-500 font-bold border-r border-slate-200">+91</span>
                      <input 
                        type="text" 
                        readOnly 
                        value="Enter mobile to share" 
                        className="flex-1 px-2 text-slate-400 bg-white outline-none text-[11px]" 
                      />
                      <button className="bg-red-500 text-white font-bold px-3 py-2 text-[11px]">
                        Share
                      </button>
                    </div>

                    {/* Button trigger */}
                    <button
                      onClick={() => setView('public-card', 'ABC-Marketing')}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <span>Open Full Interactive Card</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Your Mini Website Works in <span className="text-indigo-600">3 Simple Steps</span>
            </h2>
            <p className="text-sm text-slate-500">
              No technical expertise required. Launch your personalized digital brand in less than 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your Store',
                desc: 'Design your Mini Website or Mini Store in 2 minutes. Enter business details, select from 100 themes, and upload logo.',
                icon: Layers,
                color: 'from-blue-500 to-indigo-600'
              },
              {
                step: '02',
                title: 'Save to your Device',
                desc: '1-click Save to Contacts (.vcf vCard file) directly syncs with Google Contacts and iPhone Phonebook.',
                icon: Download,
                color: 'from-emerald-500 to-teal-600'
              },
              {
                step: '03',
                title: 'Share with Anyone',
                desc: 'Share unlimited times via WhatsApp, QR code, NFC tap, or custom business URL (e.g. digicards-app.pages.dev/card/your-brand).',
                icon: Share2,
                color: 'from-purple-500 to-pink-600'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-black text-slate-200 group-hover:text-indigo-200 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 100 Themes Showcase Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                100 THEMES CATALOG
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
                100+ Designer Templates & Styles
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Switch themes anytime with 1 click without losing your contact details or product listings.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedThemeTab(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedThemeTab === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredThemes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setView('public-card', 'ABC-Marketing', theme.id)}
                className="group cursor-pointer rounded-2xl bg-slate-800/80 border border-slate-700 p-3 hover:border-indigo-500 hover:scale-[1.03] transition-all relative overflow-hidden"
              >
                {/* Mini mockup banner */}
                <div 
                  className="h-28 rounded-xl relative overflow-hidden flex flex-col items-center justify-between p-2 shadow-inner"
                  style={{ background: theme.gradient }}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-white/80 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-extrabold text-white">
                    DC
                  </div>
                  
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full bg-white/90" />
                    <span className="w-3 h-3 rounded-full bg-white/90" />
                    <span className="w-3 h-3 rounded-full bg-white/90" />
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                    {theme.name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                    <span>{theme.category}</span>
                    <span className="text-indigo-400 font-semibold group-hover:underline">Preview →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => openAuthModal('register')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition"
            >
              Choose From All 100 Themes in Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              POWERFUL CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              One Mini Website, Endless Possibilities
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Phone, title: 'One Click Call', desc: 'Direct phone dialing with 1 tap' },
              { icon: MessageSquare, title: 'One Click WhatsApp', desc: 'Instant chat with prefilled greetings' },
              { icon: Mail, title: 'One Click Email', desc: 'Pre-addressed professional mailing' },
              { icon: Download, title: 'Add to Contacts', desc: 'RFC 6350 .vcf vCard phonebook sync' },
              { icon: ShoppingBag, title: 'Online Mini Store', desc: 'Sell products & services with WhatsApp order' },
              { icon: QrCode, title: 'Payment Section', desc: 'Google Pay, PhonePe, Paytm & dynamic UPI QR' },
              { icon: Play, title: 'YouTube Videos', desc: 'Embed promotional & tutorial video galleries' },
              { icon: Star, title: 'Customer Feedback', desc: 'Capture customer leads and inquiries' }
            ].map((f, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{f.title}</h4>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Simple Plans For Every Business
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">7-Day Free Trial</h3>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">₹0</div>
                <p className="text-xs text-slate-500 mt-1">Full access to all 100 themes</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1 Digital Visiting Card</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100 Themes Switcher</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Products & Mini Store</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 7 Days Validity</li>
                </ul>
              </div>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full mt-8 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition"
              >
                Start Free Trial
              </button>
            </div>

            {/* Standard Year Card */}
            <div className="p-8 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/25 flex flex-col justify-between relative scale-105">
              <div className="absolute -top-3 right-6 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <div>
                <h3 className="text-xl font-bold">Standard 1-Year</h3>
                <div className="mt-4 text-3xl font-extrabold">₹999 <span className="text-xs font-normal text-indigo-200">/ year</span></div>
                <p className="text-xs text-indigo-200 mt-1">Complete digital card with hosting</p>
                <ul className="mt-6 space-y-3 text-xs text-indigo-100">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 1 Year Uninterrupted Active Card</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> All 100 Themes Unlimited Switching</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 10 Products with WhatsApp Ordering</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Payment UPI QR + Bank Account info</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> YouTube Video & Photo Gallery</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> NFC Smart Card Compatible</li>
                </ul>
              </div>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full mt-8 py-3.5 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 font-extrabold text-xs shadow-lg transition"
              >
                Get Started Now
              </button>
            </div>

            {/* Franchisee Reseller */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold">Franchisee Hub</h3>
                <div className="mt-4 text-3xl font-extrabold text-emerald-400">₹4,999</div>
                <p className="text-xs text-slate-400 mt-1">Become a reseller & sell to clients</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ₹5,000 Wallet Balance Included</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Card Creation at only ₹150 / card</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated Franchisee Dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Client Card Generation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Wallet Top-up anytime from Admin</li>
                </ul>
              </div>
              <button
                onClick={() => openAuthModal('login')}
                className="w-full mt-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition shadow-lg shadow-emerald-600/25"
              >
                Franchisee Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Chat Widget matching video frame_010s */}
      <a
        href="https://wa.me/917367063161?text=Hello%20DigiCards%20Team,%20I%20am%20interested%20in%20the%20Digital%20Business%20Card%20Platform"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-110 transition-transform"
        title="Chat on WhatsApp (+91 7367063161)"
      >
        <MessageSquare className="w-7 h-7" />
      </a>
    </div>
  );
}
