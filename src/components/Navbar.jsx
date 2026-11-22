import React from 'react';
import { CreditCard, Shield, Users, LogIn, LogOut, Sparkles, UserCheck, Sun, Moon, Briefcase } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../i18n/LanguageContext';

export default function Navbar({ 
  currentView, 
  setView, 
  currentUser, 
  onLogout, 
  openAuthModal, 
  onQuickLogin,
  theme,
  toggleTheme
}) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Quick Demo Switcher Bar */}
      <div className="bg-slate-900 dark:bg-black text-slate-300 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            LOCAL DEV
          </span>
          <span className="hidden sm:inline text-slate-400">Digital Visiting Card & Mini Website SaaS</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-slate-500 font-medium text-[11px]">Instant Demo Login:</span>
          <button
            onClick={() => onQuickLogin('admin@example.com', 'admin123', 'admin')}
            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] flex items-center gap-1 transition"
          >
            <Shield className="w-3 h-3 text-amber-400" /> Admin
          </button>
          <button
            onClick={() => onQuickLogin('franchise@example.com', 'franchise123', 'franchisee')}
            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-[11px] flex items-center gap-1 transition"
          >
            <Briefcase className="w-3 h-3 text-emerald-400" /> Franchise
          </button>
          <button
            onClick={() => onQuickLogin('user@example.com', 'user123', 'customer')}
            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-[11px] flex items-center gap-1 transition"
          >
            <UserCheck className="w-3 h-3 text-sky-400" /> Customer
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setView('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              DigiCards
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">PRO</span>
            </div>
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setView('landing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentView === 'landing'
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            {t('home', 'Home')}
          </button>

          <button
            onClick={() => setView('public-card', 'apex-studio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              currentView === 'public-card'
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t('liveDemo', 'Live Card Demo')}
          </button>

          {currentUser && (
            <>
              {currentUser.role === 'customer' && (
                <button
                  onClick={() => setView('customer')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    currentView === 'customer'
                      ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {t('myCards', 'My Cards')}
                </button>
              )}

              {currentUser.role === 'franchisee' && (
                <button
                  onClick={() => setView('franchisee')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    currentView === 'franchisee'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                  {t('franchiseHub', 'Franchise Hub')}
                </button>
              )}

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setView('admin')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    currentView === 'admin'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  {t('adminConsole', 'Admin Console')}
                </button>
              )}
            </>
          )}
        </nav>

        {/* Right Actions, Language Selector & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Multilingual Selector */}
          <LanguageSelector />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {currentUser.role}
                </div>
              </div>

              {currentUser.role === 'customer' && (
                <button
                  onClick={() => setView('customer')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl shadow-sm hover:opacity-90 transition"
                >
                  {t('dashboard', 'Dashboard')}
                </button>
              )}

              {currentUser.role === 'franchisee' && (
                <button
                  onClick={() => setView('franchisee')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-xl shadow-sm hover:opacity-90 transition"
                >
                  {t('franchiseHub', 'Franchise Hub')}
                </button>
              )}

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setView('admin')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-sm hover:opacity-90 transition"
                >
                  {t('adminConsole', 'Admin Console')}
                </button>
              )}

              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t('login', 'Login')}
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl shadow-sm transition"
              >
                {t('getStarted', 'Get Started')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
