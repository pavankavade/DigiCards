import React from 'react';
import { CreditCard, Shield, Users, LogIn, LogOut, ExternalLink, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar({ currentView, setView, currentUser, onLogout, openAuthModal, onQuickLogin }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Quick Demo Switcher Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            LOCAL DEV MODE
          </span>
          <span className="hidden sm:inline">100 Themes Digital Visiting Card SaaS Clone</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium">Quick Demo Login:</span>
          <button
            onClick={() => onQuickLogin('admin@example.com', 'admin123', 'admin')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-medium flex items-center gap-1 transition"
          >
            <Shield className="w-3 h-3" /> Admin
          </button>
          <button
            onClick={() => onQuickLogin('franchise@example.com', 'franchise123', 'franchisee')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium flex items-center gap-1 transition"
          >
            <Users className="w-3 h-3" /> Franchisee
          </button>
          <button
            onClick={() => onQuickLogin('user@example.com', 'user123', 'customer')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium flex items-center gap-1 transition"
          >
            <UserCheck className="w-3 h-3" /> Customer
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setView('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
              Desi<span className="text-indigo-600">Card</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">2026</span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-1 font-medium">100 Themes Digital Visiting Card</p>
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setView('landing')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
              currentView === 'landing'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setView('public-card', 'ABC-Marketing')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
              currentView === 'public-card'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Live Card Demo
          </button>

          {/* Role specific links */}
          {currentUser && (
            <>
              {currentUser.role === 'customer' && (
                <button
                  onClick={() => setView('customer')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    currentView === 'customer'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  My Cards
                </button>
              )}

              {currentUser.role === 'franchisee' && (
                <button
                  onClick={() => setView('franchisee')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                    currentView === 'franchisee'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  Franchisee Hub
                </button>
              )}

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setView('admin')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                    currentView === 'admin'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Super Admin
                </button>
              )}
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {currentUser.role}
                </div>
              </div>

              {currentUser.role === 'customer' && (
                <button
                  onClick={() => setView('customer')}
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-green-400 transition"
                >
                  Dashboard
                </button>
              )}

              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-600/20 transition"
              >
                Create Card
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
