import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Check, Sparkles, Image as ImageIcon, Save, Eye,
  Phone, MessageSquare, Mail, Globe, MapPin, Plus, Trash2,
  Video, CreditCard, ShoppingBag, Layers, Upload, ExternalLink
} from 'lucide-react';
import { THEMES, getThemeById } from '../themes';

export default function CardBuilder({ cardId, onBack, onViewPublicCard }) {
  const [card, setCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState('theme'); // 'theme', 'company', 'social', 'payment', 'products', 'gallery'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New product / gallery inputs
  const [newProduct, setNewProduct] = useState({ title: '', price: '', discount_price: '', description: '', image_url: '' });
  const [newGallery, setNewGallery] = useState({ image_url: '', caption: '' });

  // Load card details
  const fetchCardDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cards');
      const data = await res.json();
      const current = data.cards.find(c => c.id === parseInt(cardId));
      if (!current) throw new Error('Card not found');
      setCard(current);

      // Load products & gallery via public endpoint
      const pRes = await fetch(`/api/cards/public/${current.slug}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData.products || []);
        setGallery(pData.gallery || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardDetails();
  }, [cardId]);

  const handleUpdateField = (field, value) => {
    setCard(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCard = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/cards/${card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
      });
      if (!res.ok) throw new Error('Save failed');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        handleUpdateField(field, data.url);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title) return;
    try {
      const res = await fetch(`/api/cards/${card.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      setProducts(prev => [data.product, ...prev]);
      setNewProduct({ title: '', price: '', discount_price: '', description: '', image_url: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Add Gallery Image
  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!newGallery.image_url) return;
    try {
      const res = await fetch(`/api/cards/${card.id}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGallery)
      });
      const data = await res.json();
      setGallery(prev => [data.item, ...prev]);
      setNewGallery({ image_url: '', caption: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteGallery = async (id) => {
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      setGallery(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentTheme = getThemeById(card.theme_id || 26);

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Top Action Bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1.5 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Editing: {card.company_name}
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">/{card.slug}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewPublicCard(card.slug)}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Preview Live Card</span>
            </button>

            <button
              onClick={handleSaveCard}
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : saveSuccess ? '✓ Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs matching frame_065s.png */}
        <div className="flex flex-wrap bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 mb-6 gap-1">
          {[
            { id: 'theme', label: '1. Select Theme (100)', icon: Sparkles },
            { id: 'company', label: '2. Company Details', icon: Layers },
            { id: 'social', label: '3. Social & Video', icon: MessageSquare },
            { id: 'payment', label: '4. Payment Options', icon: CreditCard },
            { id: 'products', label: '5. Products & Services', icon: ShoppingBag },
            { id: 'gallery', label: '6. Image Gallery', icon: ImageIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Split Grid: Left Editor | Right Live Smartphone Simulator */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Form Area */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            
            {/* TAB 1: 100 THEMES SELECTOR matching frame_050s & frame_059s */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Select Theme for your card</h3>
                    <p className="text-xs text-slate-500">Choose from 100 high-converting modern themes</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Theme {card.theme_id || 26} Active
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto p-1 pr-2">
                  {THEMES.map((t) => {
                    const isSelected = card.theme_id === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleUpdateField('theme_id', t.id)}
                        className={`cursor-pointer rounded-2xl border-2 p-2.5 relative transition-all duration-200 flex flex-col items-center text-center ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/20 shadow-md scale-[1.02]'
                            : 'border-slate-200 hover:border-indigo-400 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
                            Selected
                          </span>
                        )}

                        {/* Mini Smartphone Thumbnail Preview matching frame_050s */}
                        <div 
                          className="w-full h-28 rounded-xl relative overflow-hidden shadow-inner flex flex-col items-center justify-between p-2 mb-2"
                          style={{ background: t.gradient }}
                        >
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-white/30 backdrop-blur-sm flex items-center justify-center text-[9px] font-black text-white">
                            LOGO
                          </div>
                          <div className="w-full bg-white/90 rounded-md p-1 space-y-1">
                            <div className="w-3/4 h-1 bg-slate-300 rounded mx-auto" />
                            <div className="w-1/2 h-1 bg-slate-200 rounded mx-auto" />
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-slate-800 truncate w-full">
                          {t.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{t.category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: COMPANY & PERSONAL DETAILS matching frame_061s */}
            {activeTab === 'company' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Company & Contact Details</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company / Business Name *</label>
                    <input
                      type="text"
                      value={card.company_name || ''}
                      onChange={(e) => handleUpdateField('company_name', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Card Slug (Unique URL)</label>
                    <input
                      type="text"
                      value={card.slug || ''}
                      onChange={(e) => handleUpdateField('slug', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Personal Name *</label>
                    <input
                      type="text"
                      value={card.personal_name || ''}
                      onChange={(e) => handleUpdateField('personal_name', e.target.value)}
                      placeholder="e.g. Irshad Kamil"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={card.designation || ''}
                      onChange={(e) => handleUpdateField('designation', e.target.value)}
                      placeholder="e.g. CEO & Founder"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Calling Phone *</label>
                    <input
                      type="tel"
                      value={card.phone || ''}
                      onChange={(e) => handleUpdateField('phone', e.target.value)}
                      placeholder="e.g. 7367063161"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number *</label>
                    <input
                      type="tel"
                      value={card.whatsapp || ''}
                      onChange={(e) => handleUpdateField('whatsapp', e.target.value)}
                      placeholder="e.g. 7367063161"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Alternate Phone</label>
                    <input
                      type="tel"
                      value={card.alt_phone || ''}
                      onChange={(e) => handleUpdateField('alt_phone', e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email ID *</label>
                    <input
                      type="email"
                      value={card.email || ''}
                      onChange={(e) => handleUpdateField('email', e.target.value)}
                      placeholder="e.g. abcmarketingofficial@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={card.website || ''}
                      onChange={(e) => handleUpdateField('website', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                  <textarea
                    rows="2"
                    value={card.address || ''}
                    onChange={(e) => handleUpdateField('address', e.target.value)}
                    placeholder="e.g. Gandhi Maidan, Patna, Bihar 800001"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Established Year</label>
                    <input
                      type="text"
                      value={card.company_est_date || ''}
                      onChange={(e) => handleUpdateField('company_est_date', e.target.value)}
                      placeholder="e.g. 2021"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Logo Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo_url')}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">About Us</label>
                  <textarea
                    rows="3"
                    value={card.about_us || ''}
                    onChange={(e) => handleUpdateField('about_us', e.target.value)}
                    placeholder="Describe your company, products, and services..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL LINKS & YOUTUBE matching frame_065s */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Social Media & Video Links</h3>

                <div className="space-y-3">
                  {[
                    { key: 'social_facebook', label: 'Facebook Link', placeholder: 'https://facebook.com/yourpage' },
                    { key: 'social_twitter', label: 'Twitter / X Link', placeholder: 'https://x.com/yourhandle' },
                    { key: 'social_instagram', label: 'Instagram Link', placeholder: 'https://instagram.com/yourprofile' },
                    { key: 'social_linkedin', label: 'LinkedIn Link', placeholder: 'https://linkedin.com/in/yourprofile' },
                    { key: 'social_youtube', label: 'YouTube Channel Link', placeholder: 'https://youtube.com/@channel' },
                    { key: 'social_pinterest', label: 'Pinterest Link', placeholder: 'https://pinterest.com/profile' },
                    { key: 'social_telegram', label: 'Telegram Link', placeholder: 'https://t.me/username' }
                  ].map(s => (
                    <div key={s.key}>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{s.label} (Optional)</label>
                      <input
                        type="url"
                        value={card[s.key] || ''}
                        onChange={(e) => handleUpdateField(s.key, e.target.value)}
                        placeholder={s.placeholder}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}

                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-1">YouTube Video Link (Featured on Card)</label>
                    <input
                      type="url"
                      value={card.youtube_video || ''}
                      onChange={(e) => handleUpdateField('youtube_video', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PAYMENT OPTIONS */}
            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Payment & Bank Information</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID (Google Pay, PhonePe, Paytm)</label>
                    <input
                      type="text"
                      value={card.payment_upi_id || ''}
                      onChange={(e) => handleUpdateField('payment_upi_id', e.target.value)}
                      placeholder="e.g. abcmarketing@upi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Custom Payment QR Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'payment_qr_url')}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Paytm Mobile</label>
                    <input
                      type="tel"
                      value={card.payment_paytm || ''}
                      onChange={(e) => handleUpdateField('payment_paytm', e.target.value)}
                      placeholder="7367063161"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Google Pay Mobile</label>
                    <input
                      type="tel"
                      value={card.payment_gpay || ''}
                      onChange={(e) => handleUpdateField('payment_gpay', e.target.value)}
                      placeholder="7367063161"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PhonePe Mobile</label>
                    <input
                      type="tel"
                      value={card.payment_phonepe || ''}
                      onChange={(e) => handleUpdateField('payment_phonepe', e.target.value)}
                      placeholder="7367063161"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-800">Bank Account Transfer Details</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={card.bank_name || ''}
                      onChange={(e) => handleUpdateField('bank_name', e.target.value)}
                      placeholder="Bank Name (e.g. State Bank of India)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={card.bank_account_no || ''}
                      onChange={(e) => handleUpdateField('bank_account_no', e.target.value)}
                      placeholder="Account Number"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={card.bank_ifsc || ''}
                      onChange={(e) => handleUpdateField('bank_ifsc', e.target.value)}
                      placeholder="IFSC Code"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={card.bank_holder_name || ''}
                      onChange={(e) => handleUpdateField('bank_holder_name', e.target.value)}
                      placeholder="Account Holder Name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PRODUCTS & SERVICES (MINI STORE) */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Products & Mini Store</h3>
                  <p className="text-xs text-slate-500">Add products with prices and 1-click WhatsApp checkout</p>
                </div>

                {/* New Product Form */}
                <form onSubmit={handleAddProduct} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-600" /> Add New Product
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={newProduct.title}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Product Name *"
                      className="sm:col-span-3 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Regular Price (₹)"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                    <input
                      type="number"
                      value={newProduct.discount_price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, discount_price: e.target.value }))}
                      placeholder="Offer Price (₹)"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="Image URL or /assets/img/demo/prod1.png"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                  </div>
                  <textarea
                    rows="2"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Short product description..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition"
                  >
                    Add Product
                  </button>
                </form>

                {/* Products List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700">Current Products ({products.length})</h4>
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || '/assets/img/demo/prod1.png'}
                          alt={p.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">{p.title}</div>
                          <div className="text-[11px] text-emerald-600 font-bold">
                            ₹{p.discount_price || p.price} {p.discount_price && <span className="text-slate-400 line-through">₹{p.price}</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: IMAGE GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Photo Gallery</h3>
                  <p className="text-xs text-slate-500">Upload portfolio photos, studio photos, certificates</p>
                </div>

                <form onSubmit={handleAddGallery} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newGallery.image_url}
                      onChange={(e) => setNewGallery(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="Image URL or /assets/img/demo/gallery1.jpg"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={newGallery.caption}
                      onChange={(e) => setNewGallery(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Photo Caption (e.g. Our Office)"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition"
                  >
                    Add to Gallery
                  </button>
                </form>

                <div className="grid grid-cols-3 gap-3">
                  {gallery.map((g) => (
                    <div key={g.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video">
                      <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteGallery(g.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right: LIVE Interactive Smartphone Simulator */}
          <div className="lg:col-span-5 flex justify-center sticky top-36">
            <div className="w-full max-w-[340px]">
              <div className="text-center mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Live Smartphone Preview</span>
                <span className="text-emerald-600">● Live Sync</span>
              </div>

              {/* Realistic Phone Bezel */}
              <div className="rounded-[36px] border-[6px] border-slate-900 bg-white shadow-2xl overflow-hidden relative text-center">
                {/* Notch */}
                <div className="h-5 bg-slate-900 flex items-center justify-center">
                  <div className="w-16 h-2.5 bg-slate-800 rounded-b-md" />
                </div>

                {/* Banner & Logo */}
                <div 
                  className="h-28 relative flex items-center justify-center"
                  style={{ background: currentTheme.gradient }}
                >
                  <div className="absolute -bottom-8 w-16 h-16 rounded-full border-2 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center font-extrabold text-slate-900 text-xs">
                    {card.logo_url ? (
                      <img src={card.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      'LOGO'
                    )}
                  </div>
                </div>

                <div className="pt-10 px-4 pb-4 space-y-2">
                  <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">
                    {card.company_name || 'Your Company Name'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    {card.personal_name || 'Full Name'} • {card.designation || 'Designation'}
                  </p>

                  {/* 4 Action buttons */}
                  <div className="flex justify-around pt-2">
                    {[Phone, MessageSquare, Mail, Globe].map((Icon, i) => (
                      <div 
                        key={i} 
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md text-xs"
                        style={{ background: currentTheme.primary }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    ))}
                  </div>

                  {/* Contact box */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-[11px] space-y-1">
                    <div className="font-semibold text-slate-700">📞 {card.phone || 'Phone'}</div>
                    <div className="font-semibold text-slate-700 truncate">✉️ {card.email || 'Email'}</div>
                  </div>

                  {/* Theme indicator */}
                  <div className="pt-2 text-[10px] text-slate-400 font-medium">
                    Rendered with <strong>{currentTheme.name}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
