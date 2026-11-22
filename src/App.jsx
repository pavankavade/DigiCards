import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PublicCardView from './components/PublicCardView';
import CustomerDashboard from './components/CustomerDashboard';
import CardBuilder from './components/CardBuilder';
import FranchiseeDashboard from './components/FranchiseeDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [viewParam, setViewParam] = useState(null); // e.g. card slug or theme id
  const [editingCardId, setEditingCardId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  // Global Theme: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('digicards_theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('digicards_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check current session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(console.error);

    // Check if initial URL has /card/slug
    const path = window.location.pathname;
    if (path.startsWith('/card/')) {
      const slug = path.replace('/card/', '');
      if (slug) {
        setCurrentView('public-card');
        setViewParam(slug);
      }
    }
  }, []);

  const handleSetView = (view, param = null, extra = null) => {
    setCurrentView(view);
    setViewParam(param);
    if (extra) {
      setViewParam({ slug: param, themeId: extra });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleEditCard = (cardId) => {
    setEditingCardId(cardId);
    setCurrentView('builder');
  };

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navbar shown on non-card views */}
      {currentView !== 'public-card' && (
        <Navbar
          currentView={currentView}
          setView={handleSetView}
          currentUser={currentUser}
          onLogout={handleLogout}
          openAuthModal={(mode) => setAuthModal({ open: true, mode })}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {/* View Routers */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            setView={handleSetView}
            openAuthModal={(mode) => setAuthModal({ open: true, mode })}
            theme={theme}
          />
        )}

        {currentView === 'public-card' && (
          <PublicCardView
            slug={typeof viewParam === 'object' && viewParam !== null ? viewParam.slug : (viewParam || 'demo')}
            overrideThemeId={typeof viewParam === 'object' && viewParam !== null ? viewParam.themeId : null}
            onBack={() => handleSetView('landing')}
          />
        )}

        {currentView === 'customer' && (
          <CustomerDashboard
            currentUser={currentUser}
            setView={handleSetView}
            onEditCard={handleEditCard}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'builder' && (
          <CardBuilder
            cardId={editingCardId || 1}
            onBack={() => handleSetView(currentUser?.role === 'franchisee' ? 'franchisee' : 'customer')}
            onViewPublicCard={(slug) => handleSetView('public-card', slug)}
          />
        )}

        {currentView === 'franchisee' && (
          <FranchiseeDashboard
            currentUser={currentUser}
            setView={handleSetView}
            onEditCard={handleEditCard}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            setView={handleSetView}
            onEditCard={handleEditCard}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ open: false, mode: 'login' })}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') setCurrentView('admin');
          else if (user.role === 'franchisee') setCurrentView('franchisee');
          else setCurrentView('customer');
        }}
      />
    </div>
  );
}
