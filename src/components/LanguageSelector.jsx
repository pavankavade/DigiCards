// src/components/LanguageSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, currentLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      // Auto-focus search input when opened
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Filter languages based on search query
  const filteredLanguages = languages.filter((lang) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q) ||
      lang.region.toLowerCase().includes(q)
    );
  });

  const indianLangs = filteredLanguages.filter(
    (l) => l.region !== 'Global' && l.region !== 'Middle East' && l.region !== 'Europe'
  );
  const globalLangs = filteredLanguages.filter(
    (l) => l.region === 'Global' || l.region === 'Middle East' || l.region === 'Europe'
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button positioned in Navbar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer select-none active:scale-95"
        title={t('selectLanguage', 'Select Language')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="hidden sm:inline font-bold tracking-tight">{currentLanguage.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu attached downside the tab */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 origin-top-right ring-1 ring-black/5"
          role="listbox"
        >
          {/* Header & Quick Search Bar */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{t('selectLanguage', 'Select Language')}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {languages.length} Languages
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language / भाषा निवडा..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Scrollable Language List */}
          <div className="overflow-y-auto max-h-72 p-1.5 space-y-2 divide-y-0 text-xs overscroll-contain">
            {/* Indian Regional Languages */}
            {indianLangs.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>🇮🇳</span>
                  <span>{t('indianLanguages', 'Indian Languages')}</span>
                </div>
                <div className="space-y-0.5 mt-0.5">
                  {indianLangs.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelect(lang.code)}
                        className={`w-full px-2.5 py-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-extrabold ring-1 ring-indigo-500/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <div>
                            <div className="font-black text-xs leading-tight text-slate-900 dark:text-white">
                              {lang.nativeName}
                            </div>
                            <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                              {lang.name} • {lang.region}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Global Languages */}
            {globalLangs.length > 0 && (
              <div className="pt-1.5">
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <span>🌐</span>
                  <span>{t('globalLanguages', 'Global Languages')}</span>
                </div>
                <div className="space-y-0.5 mt-0.5">
                  {globalLangs.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelect(lang.code)}
                        className={`w-full px-2.5 py-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-extrabold ring-1 ring-indigo-500/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <div>
                            <div className="font-black text-xs leading-tight text-slate-900 dark:text-white">
                              {lang.nativeName}
                            </div>
                            <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                              {lang.name}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredLanguages.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">
                No languages found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
