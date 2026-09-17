import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess, onQuickLogin }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer', 'franchisee', 'admin'
  
  // Form fields
  const [identifier, setIdentifier] = useState('user@example.com');
  const [password, setPassword] = useState('user123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password, role: selectedRole })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        onAuthSuccess(data.user);
        onClose();
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setRoleTab = (r) => {
    setSelectedRole(r);
    if (r === 'admin') {
      setIdentifier('admin@example.com');
      setPassword('admin123');
    } else if (r === 'franchisee') {
      setIdentifier('franchise@example.com');
      setPassword('franchise123');
    } else {
      setIdentifier('user@example.com');
      setPassword('user123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl transition-all"
        style={{
          background: "linear-gradient(145deg, #a855f7 0%, #ec4899 100%)",
          padding: "3px"
        }}
      >
        <div className="bg-white rounded-[22px] p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Role selector tabs */}
          {mode === 'login' && (
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRoleTab('customer')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  selectedRole === 'customer'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRoleTab('franchisee')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  selectedRole === 'franchisee'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Franchisee
              </button>
              <button
                type="button"
                onClick={() => setRoleTab('admin')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  selectedRole === 'admin'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white mb-3 shadow-lg shadow-purple-500/25">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {mode === 'login' ? (
                selectedRole === 'admin' ? 'Admin Portal Login' :
                selectedRole === 'franchisee' ? 'Franchisee Portal' :
                'Customer Login'
              ) : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login'
                ? 'Please login with your email and password to manage your digital visiting card'
                : 'Join DigiCards and launch your modern digital business card in minutes'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Irshad Kamil"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 7367063161"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@business.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email ID or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email or 10-digit mobile"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {mode === 'login' && (
                  <span className="text-[11px] text-purple-600 hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register Now'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 transition"
              >
                New User? Register Now
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 transition"
              >
                Already have an account? Login Here
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
