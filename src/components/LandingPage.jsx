import React, { useState } from 'react';
import { 
  Phone, MessageSquare, Mail, Share2, ShoppingBag, Eye, 
  CreditCard, Sparkles, CheckCircle2, ArrowRight, Star,
  Smartphone, Award, QrCode, Layers, Shield, Download, 
  ChevronRight, Play, ExternalLink, Cpu, Zap, Check, ArrowUpRight,
  Crown, LayoutGrid, Feather
} from 'lucide-react';
import { THEMES, THEME_CATEGORIES } from '../themes';
import { useLanguage } from '../i18n/LanguageContext';

// 10 Card Structure metadata for interactive landing showcase
const STRUCTURE_SHOWCASE = [
  {
    id: 'executive',
    name: 'Executive',
    tag: 'Signature',
    desc: 'Curved cover header, centered floating badge, glassmorphic dock, segmented tabs.',
    icon: Sparkles,
    previewBg: 'linear-gradient(135deg, #1e293b, #0f172a)',
    accent: '#3b82f6'
  },
  {
    id: 'editorial',
    name: 'Editorial',
    tag: 'Minimalist',
    desc: 'Sharp magazine typography, asymmetric layout, clean quote bio, structured tables.',
    icon: Layers,
    previewBg: 'linear-gradient(135deg, #09090b, #18181b)',
    accent: '#71717a'
  },
  {
    id: 'cyber',
    name: 'Cyber HUD',
    tag: 'Futuristic',
    desc: 'Deep obsidian matrix, neon glowing borders, monospace telemetry, tech operator badges.',
    icon: Cpu,
    previewBg: 'linear-gradient(135deg, #020617, #082f49)',
    accent: '#06b6d4'
  },
  {
    id: 'split',
    name: 'Dynamic Split',
    tag: 'Modern',
    desc: 'Dramatic diagonal split cover angle (-8°), offset badge, floating high-contrast action pills.',
    icon: Zap,
    previewBg: 'linear-gradient(135deg, #18181b, #27272a)',
    accent: '#8b5cf6'
  },
  {
    id: 'compact',
    name: 'Compact Bio',
    tag: 'Linktree Style',
    desc: 'App-like smartphone card with collapsible accordion drawers for Products, UPI, and Comms.',
    icon: Smartphone,
    previewBg: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
    accent: '#10b981'
  },
  {
    id: 'royale',
    name: 'Imperial Royale',
    tag: 'Ultra Luxury',
    desc: 'Imperial velvet crest, gold filigree accents, Roman serif, and prestige client badge.',
    icon: Crown,
    previewBg: 'linear-gradient(135deg, #2d2417, #0d0b08)',
    accent: '#d4af37'
  },
  {
    id: 'neoglass',
    name: 'NeoGlass Prism',
    tag: 'Glassmorphism',
    desc: 'Frosted 3D depth, specular liquid reflections, aurora mesh aura, and translucent pill docks.',
    icon: Sparkles,
    previewBg: 'linear-gradient(135deg, #083344, #1e1b4b)',
    accent: '#06b6d4'
  },
  {
    id: 'bento',
    name: 'Bento Grid',
    tag: 'Apple & Linear',
    desc: 'Modular asymmetric tiles for quick stats, live WhatsApp pulse, map coordinates, and catalog.',
    icon: LayoutGrid,
    previewBg: 'linear-gradient(135deg, #0f172a, #1e293b)',
    accent: '#3b82f6'
  },
  {
    id: 'brutalist',
    name: 'Neo-Brutalist',
    tag: 'High Impact',
    desc: 'High-contrast 3px solid black outlines, retro shadows, energetic pastel blocks, and punchy stamps.',
    icon: Zap,
    previewBg: 'linear-gradient(135deg, #facc15, #f59e0b)',
    accent: '#000000'
  },
  {
    id: 'nordic',
    name: 'Nordic Minimal',
    tag: 'Scandinavian',
    desc: 'Serene Scandinavian quiet luxury, titanium hair-line dividers, calming whitespace, and pure focus.',
    icon: Feather,
    previewBg: 'linear-gradient(135deg, #292524, #1c1917)',
    accent: '#a8a29e'
  }
];

export default function LandingPage({ setView, openAuthModal, theme }) {
  const { t } = useLanguage();
  const [activeStructure, setActiveStructure] = useState('executive');
  const [selectedThemeCategory, setSelectedThemeCategory] = useState('All');

  const filteredThemes = selectedThemeCategory === 'All'
    ? THEMES.slice(0, 18)
    : THEMES.filter(t => t.category === selectedThemeCategory).slice(0, 18);

  const currentStruc = STRUCTURE_SHOWCASE.find(s => s.id === activeStructure) || STRUCTURE_SHOWCASE[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Next-Generation Digital Identity Platform</span>
              <span className="text-slate-400">•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">10 Layout Structures</span>
            </div>

            {/* Clean, Rich Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {t('heroTitle', 'Your Professional Identity, Re-engineered for the Digital Era.')}
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              {t('heroSubtitle', 'Replace outdated paper cards with an interactive digital visiting card & mini-website. Featuring 10 distinct layout architectures, 100 color themes, instant vCard contact downloads, and direct WhatsApp checkout.')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => openAuthModal('register')}
                className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm shadow-md transition flex items-center gap-2 group"
              >
                <span>{t('createCard', 'Create Your Digital Card')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setView('public-card', 'apex-studio')}
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition flex items-center gap-2 shadow-xs"
              >
                <Eye className="w-4 h-4 text-indigo-500" />
                <span>{t('exploreDemo', 'Explore Live Demo Card')}</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero App Install Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>1-Tap RFC 6350 vCard Save</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Direct UPI & WhatsApp Orders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 10 STRUCTURAL ARCHITECTURES SHOWCASE */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Beyond Color Swaps
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              10 Fundamentally Distinct Card Structures
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Every business has its own personality. Choose an architecture tailored to your brand, not just a recolored box.
            </p>
          </div>

          {/* Structure Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {STRUCTURE_SHOWCASE.map((struc) => {
              const Icon = struc.icon;
              const isActive = activeStructure === struc.id;
              return (
                <button
                  key={struc.id}
                  onClick={() => setActiveStructure(struc.id)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{struc.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 dark:bg-slate-900/20 text-current' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {struc.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Layout Feature & Smartphone Preview Split */}
          <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <currentStruc.icon className="w-3.5 h-3.5 text-indigo-500" />
                <span>{currentStruc.name} Architecture</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Designed for {currentStruc.tag} Businesses & Professionals
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentStruc.desc}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>High-performance mobile UX optimized for iOS & Android</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Compatible with any of the 100 color themes</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Interactive product catalog with 1-click WhatsApp order</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setView('public-card', 'apex-studio')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 hover:opacity-90 transition"
                >
                  <span>Preview This Structure Live</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Mini Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] rounded-[32px] border-[5px] border-slate-900 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl overflow-hidden relative text-center">
                <div className="h-4 bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
                  <div className="w-12 h-2 bg-slate-800 dark:bg-slate-700 rounded-b" />
                </div>

                {/* Structure Header Mockup */}
                {activeStructure === 'editorial' ? (
                  <div className="p-3 text-left border-b border-slate-100 dark:border-slate-800 flex justify-between">
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Editorial</span>
                      <h4 className="font-black text-xs uppercase text-slate-900 dark:text-white">Apex Design Studio</h4>
                      <p className="text-[9px] text-slate-500">Alex Vance • Creative Lead</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold">LOGO</div>
                  </div>
                ) : activeStructure === 'cyber' ? (
                  <div className="bg-slate-950 p-2 text-left border-b border-cyan-500/30 font-mono">
                    <div className="text-[8px] text-cyan-400 flex justify-between mb-1">
                      <span>SYS.ONLINE // 01</span>
                      <span className="text-emerald-400">SECURE</span>
                    </div>
                    <div className="h-14 bg-gradient-to-r from-cyan-950 to-slate-950 rounded-lg flex items-center justify-center border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                      CYBER HUD
                    </div>
                  </div>
                ) : activeStructure === 'split' ? (
                  <div className="relative">
                    <div className="h-16 bg-gradient-to-r from-violet-600 to-indigo-600" style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 0 100%)" }} />
                    <div className="px-3 -mt-6 flex items-end gap-2 text-left">
                      <div className="w-12 h-12 rounded-xl border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[8px] font-bold">LOGO</div>
                      <div className="pb-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">Apex Studio</h4>
                        <p className="text-[9px] text-slate-500">Design Lead</p>
                      </div>
                    </div>
                  </div>
                ) : activeStructure === 'compact' ? (
                  <div className="p-3 text-center space-y-1">
                    <div className="w-12 h-12 rounded-full mx-auto bg-slate-900 text-white flex items-center justify-center text-[8px] font-bold">LOGO</div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Apex Studio</h4>
                    <p className="text-[9px] text-slate-500">Founder</p>
                  </div>
                ) : (
                  <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative flex items-center justify-center">
                    <div className="absolute -bottom-6 w-12 h-12 rounded-2xl border-2 border-white bg-white shadow-md flex items-center justify-center text-[8px] font-black text-slate-900">
                      LOGO
                    </div>
                  </div>
                )}

                {/* 4 Action Pills */}
                <div className="p-3 space-y-2">
                  <div className="flex justify-around pt-2">
                    {[Phone, MessageSquare, Mail, Download].map((Icon, idx) => (
                      <div key={idx} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    ))}
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-[10px] text-left text-slate-500 dark:text-slate-400 space-y-1">
                    <div>📞 +91 98765 43210</div>
                    <div>✉️ contact@apexstudio.io</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM CAPABILITIES BENTO GRID */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Powerful Features
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Built for Real Business Conversion
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A comprehensive digital card solution that turns profile visits into paying customers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Download,
                title: "1-Tap RFC 6350 vCard Save",
                desc: "Visitors tap once to save your entire contact card—phone, email, website, and company—directly into their smartphone contacts."
              },
              {
                icon: ShoppingBag,
                title: "Mini Store & WhatsApp Checkout",
                desc: "List products and services with pricing. Customers click to place pre-filled orders directly into your WhatsApp inbox."
              },
              {
                icon: CreditCard,
                title: "Instant UPI & Bank Settlement",
                desc: "Display dynamic UPI QR codes and bank details for instant, fee-free customer payments straight to your account."
              },
              {
                icon: QrCode,
                title: "Dynamic QR & NFC Ready",
                desc: "Share via scannable QR code on physical stands, posters, or program into any NFC smart card or tap card."
              },
              {
                icon: Sparkles,
                title: "100 Color Themes",
                desc: "Curated aesthetic themes spanning Executive, Creative, Dark Luxe, Neon Cyber, and Minimalist styling."
              },
              {
                icon: Shield,
                title: "Direct Admin Control",
                desc: "Direct deals between Super Admin and customers. Manage cards, approvals, and custom domains from one dashboard."
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 100 THEMES PREVIEW STRIP */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Color Palettes</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">100 Handcrafted Themes</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {THEME_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedThemeCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
                    selectedThemeCategory === cat
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {filteredThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => setView('public-card', 'apex-studio', t.id)}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left transition hover:scale-102 flex flex-col justify-between h-28 relative overflow-hidden group shadow-xs"
              >
                <div className="absolute top-0 left-0 right-0 h-8" style={{ background: t.gradient }} />
                <div className="relative z-10 pt-6">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate group-hover:underline">
                    #{t.id} {t.name.split(':')[1] || t.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{t.category}</span>
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-black uppercase text-slate-500">{t.layoutStyle}</span>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.primary }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING & DIRECT SUPER ADMIN DEALS */}
      <section className="py-20 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Straightforward Pricing</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Choose Your Business Plan</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">All plans include the 5 structural layouts and 100 theme choices.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For freelancers & solo operators</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">₹499</span>
                  <span className="text-xs text-slate-400">/ year</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 Digital Visiting Card</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> All 5 Layout Architectures</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100 Themes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 5 Products listed</li>
              </ul>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Get Started
              </button>
            </div>

            {/* Professional (Featured) */}
            <div className="p-7 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 space-y-6 shadow-xl relative">
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500 text-white">
                Most Popular
              </span>
              <div>
                <h3 className="text-base font-bold">Professional</h3>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">For growing businesses & agencies</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black">₹999</span>
                  <span className="text-xs text-slate-400 dark:text-slate-600">/ year</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 dark:text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Products & Store items</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Photo Gallery Showcase</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Slug & QR Code download</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Priority WhatsApp Support</li>
              </ul>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
              >
                Launch Professional Card
              </button>
            </div>

            {/* Lifetime / Custom Domain */}
            <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Lifetime Deal</h3>
                <p className="text-xs text-slate-400 mt-1">Pay once, keep forever</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">₹2,499</span>
                  <span className="text-xs text-slate-400">one-time</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Lifetime access & renewals</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom Domain linking option</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Zero renewal fees forever</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> VIP Direct Founder Support</li>
              </ul>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Claim Lifetime
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLEAN FOOTER */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <span>DigiCards</span>
          </div>
          <p>© 2026 DigiCards SaaS. Built for clean, modern digital business networking.</p>
          <div className="flex items-center gap-4 font-semibold">
            <button onClick={() => setView('public-card', 'apex-studio')} className="hover:text-slate-900 dark:hover:text-white">Live Demo</button>
            <button onClick={() => openAuthModal('login')} className="hover:text-slate-900 dark:hover:text-white">Login</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
