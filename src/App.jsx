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
      // e.g. theme override
      setViewParam({ slug: param, themeId: extra });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickLogin = async (identifier, password, expectedRole) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role: expectedRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Quick login failed');
      setCurrentUser(data.user);
      if (expectedRole === 'admin') setCurrentView('admin');
      else if (expectedRole === 'franchisee') setCurrentView('franchisee');
      else setCurrentView('customer');
    } catch (err) {
      alert(err.message);
    }
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
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] bg-slate-50 text-slate-900">
      {/* Navbar shown on non-card views, or with back navigation */}
      {currentView !== 'public-card' && (
        <Navbar
          currentView={currentView}
          setView={handleSetView}
          currentUser={currentUser}
          onLogout={handleLogout}
          openAuthModal={(mode) => setAuthModal({ open: true, mode })}
          onQuickLogin={handleQuickLogin}
        />
      )}

      {/* View Routers */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            setView={handleSetView}
            openAuthModal={(mode) => setAuthModal({ open: true, mode })}
          />
        )}

        {currentView === 'public-card' && (
          <PublicCardView
            slug={typeof viewParam === 'object' && viewParam !== null ? viewParam.slug : (viewParam || 'ABC-Marketing')}
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
        onQuickLogin={handleQuickLogin}
      />
    </div>
  );
}
