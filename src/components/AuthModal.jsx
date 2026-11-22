import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Sparkles, 
  Briefcase, CheckCircle2, Copy, Check, KeyRound, Building
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess, onQuickLogin }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer', 'franchisee', 'admin'
  const [regType, setRegType] = useState('customer'); // 'customer' or 'franchisee'
  
  // Login form fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [hasFranchise, setHasFranchise] = useState(false);
  const [franchiseCode, setFranchiseCode] = useState('');
  const [franchisePin, setFranchisePin] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [city, setCity] = useState('');

  // Status / Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null); // { message, customer_code, isPendingFranchise }
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessInfo(null);

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
        // Register mode: strictly Customer or Franchisee (NO Admin!)
        const payload = {
          role: regType,
          name,
          email,
          phone,
          password: regPassword
        };

        if (regType === 'franchisee') {
          payload.agency_name = agencyName;
          payload.city = city;
        } else if (hasFranchise) {
          payload.franchise_code = franchiseCode;
          payload.franchise_pin = franchisePin;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        if (regType === 'franchisee') {
          setSuccessInfo({
            message: data.message,
            isPendingFranchise: true,
            franchise_code: data.franchise_code
          });
        } else {
          setSuccessInfo({
            message: 'Account created successfully!',
            customer_code: data.customer_code,
            user: data.user
          });
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const setRoleTab = (r) => {
    setSelectedRole(r);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl transition-all"
        style={{
          background: "linear-gradient(145deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
          padding: "3px"
        }}
      >
        <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Screen */}
          {successInfo ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              {successInfo.isPendingFranchise ? (
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Franchise Application Submitted!
                  </h3>
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 text-left space-y-2">
                    <p className="font-bold">
                      Your partner application has been dispatched to Super Admin for approval.
                    </p>
                    <p>
                      Your unique Franchise Reference Code is: <span className="font-mono font-black text-purple-700 dark:text-purple-300">{successInfo.franchise_code}</span>.
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Once Super Admin verifies your application, your account will be activated with your starter card pack and you will be able to log in.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSuccessInfo(null);
                      setMode('login');
                      setSelectedRole('franchisee');
                    }}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Customer Account Created!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Here is your personal, unique Customer Security Code. Keep this code safe or share it with your Franchise Partner to have them issue cards directly to your portal.
                  </p>

                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Your Unique Security Code
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-widest bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-700">
                        {successInfo.customer_code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(successInfo.customer_code)}
                        className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm"
                        title="Copy Code"
                      >
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (successInfo.user) onAuthSuccess(successInfo.user);
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                  >
                    Proceed to Customer Dashboard →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white mb-2.5 shadow-lg shadow-indigo-600/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {mode === 'login' ? (
                    selectedRole === 'admin' ? 'Super Admin Portal' :
                    selectedRole === 'franchisee' ? 'Franchise Partner Hub' :
                    'Customer Portal Login'
                  ) : (
                    regType === 'franchisee' ? 'Apply as Franchise Partner' : 'Create Customer Account'
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {mode === 'login'
                    ? 'Enter your credentials to access your management center'
                    : regType === 'franchisee'
                    ? 'Super Admin will review and approve your partner quota'
                    : 'Get your unique customer security code and track your visiting cards'}
                </p>
              </div>

              {/* Mode Specific Selector Tabs */}
              {mode === 'login' ? (
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-5 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setRoleTab('customer')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      selectedRole === 'customer'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleTab('franchisee')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      selectedRole === 'franchisee'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Franchise
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleTab('admin')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Super Admin
                  </button>
                </div>
              ) : (
                /* Registration role selection: Strictly Customer or Franchise Partner (NO Admin register!) */
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-5 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setRegType('customer')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      regType === 'customer'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegType('franchisee')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      regType === 'franchisee'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Apply for Franchise
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  ✕ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* LOGIN FORM */}
                {mode === 'login' && (
                  <>
                    <div>
                      <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                        Email, Phone, or Code
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="email@example.com or FRAN-... or CUST-..."
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* REGISTER FORM */}
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ramesh Patel"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition"
                        />
                      </div>
                    </div>

                    {regType === 'franchisee' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                            Agency / Business Name
                          </label>
                          <input
                            type="text"
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                            placeholder="e.g. Pune Digitals"
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                            City / Region
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Pune, MH"
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 transition"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@business.com"
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                          Mobile Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition"
                      />
                    </div>

                    {/* Customer Franchise Code Association Toggle */}
                    {regType === 'customer' && (
                      <div className="pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                          <input
                            type="checkbox"
                            checked={hasFranchise}
                            onChange={(e) => setHasFranchise(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                          />
                          <span>Registering under a Franchise Partner</span>
                        </label>

                        {hasFranchise && (
                          <div className="mt-2.5 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2 animate-in fade-in">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-black text-indigo-950 dark:text-indigo-200 mb-0.5">
                                  Franchise Code *
                                </label>
                                <input
                                  type="text"
                                  required={hasFranchise}
                                  value={franchiseCode}
                                  onChange={(e) => setFranchiseCode(e.target.value.toUpperCase())}
                                  placeholder="e.g. FRAN-PUNE-8910"
                                  className="w-full px-2.5 py-1.5 rounded-lg border-2 border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono font-bold uppercase outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-black text-indigo-950 dark:text-indigo-200 mb-0.5">
                                  Security PIN *
                                </label>
                                <input
                                  type="password"
                                  required={hasFranchise}
                                  value={franchisePin}
                                  onChange={(e) => setFranchisePin(e.target.value)}
                                  placeholder="e.g. 8910"
                                  className="w-full px-2.5 py-1.5 rounded-lg border-2 border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono font-bold outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-white font-black text-xs bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? 'Processing...'
                    : mode === 'login'
                    ? 'Login to Portal'
                    : regType === 'franchisee'
                    ? 'Submit Franchise Application'
                    : 'Register Customer Account'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Toggle Login / Register */}
              <div className="mt-5 text-center pt-3 border-t border-slate-100 dark:border-slate-800">
                {mode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Need an account? Register or Apply for Franchise →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Already registered? Sign in here →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
