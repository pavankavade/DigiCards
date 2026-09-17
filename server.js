const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static directories
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
// Static dist if Vite has built
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Uploads and public asset fallbacks
app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Multer Storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

// Helper auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const userId = req.cookies.user_id || (authHeader && authHeader.replace('Bearer ', ''));
  if (!userId) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const user = db.prepare('SELECT id, role, name, email, phone, wallet_balance, status FROM users WHERE id = ?').get(userId);
  if (!user || user.status !== 'active') return res.status(401).json({ error: 'Invalid or inactive session' });

  req.user = user;
  next();
}

// ==================== AUTH ROUTES ====================

app.post('/api/auth/login', (req, res) => {
  const { identifier, password, role } = req.body;
  if (!identifier || !password) return res.status(400).json({ error: 'Identifier and password required' });

  let query = 'SELECT * FROM users WHERE (email = ? OR phone = ?) AND password = ?';
  let params = [identifier, identifier, password];
  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }

  const user = db.prepare(query).get(...params);
  if (!user) return res.status(401).json({ error: 'Invalid email/phone or password' });
  if (user.status !== 'active') return res.status(403).json({ error: 'Account is deactivated' });

  res.cookie('user_id', user.id, { httpOnly: false, maxAge: 86400000 });
  const { password: _, ...userData } = user;
  res.json({ message: 'Login successful', user: userData });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });

  try {
    const info = db.prepare(`
      INSERT INTO users (role, name, email, phone, password, wallet_balance, status)
      VALUES ('customer', ?, ?, ?, ?, 0, 'active')
    `).run(name, email, phone || '', password);

    const user = db.prepare('SELECT id, role, name, email, phone, wallet_balance FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.cookie('user_id', user.id, { httpOnly: false, maxAge: 86400000 });
    res.json({ message: 'Registration successful', user });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const userId = req.cookies.user_id || req.headers['authorization']?.replace('Bearer ', '');
  if (!userId) return res.json({ user: null });
  const user = db.prepare('SELECT id, role, name, email, phone, wallet_balance, status FROM users WHERE id = ?').get(userId);
  res.json({ user: user || null });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('user_id');
  res.json({ message: 'Logged out successfully' });
});

// ==================== CARDS ROUTES ====================

// Public card lookup by slug
app.get('/api/cards/public/:slug', (req, res) => {
  const slug = req.params.slug;
  const card = db.prepare('SELECT * FROM cards WHERE slug = ? COLLATE NOCASE').get(slug);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  // Increment view counter
  db.prepare('UPDATE cards SET views_count = views_count + 1 WHERE id = ?').run(card.id);

  const products = db.prepare('SELECT * FROM products WHERE card_id = ? ORDER BY id DESC').all(card.id);
  const gallery = db.prepare('SELECT * FROM gallery WHERE card_id = ? ORDER BY id DESC').all(card.id);
  const settings = db.prepare('SELECT key, value FROM settings').all().reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});

  res.json({ card, products, gallery, settings });
});

// vCard (.vcf) download for 1-click Contact Saving
app.get('/api/cards/public/:slug/vcard', (req, res) => {
  const slug = req.params.slug;
  const card = db.prepare('SELECT * FROM cards WHERE slug = ? COLLATE NOCASE').get(slug);
  if (!card) return res.status(404).send('Card not found');

  const fullName = card.personal_name || card.company_name;
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${fullName}`,
    `ORG:${card.company_name || ''}`,
    `TITLE:${card.designation || ''}`,
    `TEL;TYPE=CELL,VOICE:${card.phone || ''}`,
    `TEL;TYPE=WORK,VOICE:${card.alt_phone || card.phone || ''}`,
    `EMAIL;TYPE=PREF,INTERNET:${card.email || ''}`,
    `URL:${card.website || ''}`,
    `ADR;TYPE=WORK:;;${(card.address || '').replace(/[\r\n]+/g, ' ')};;;;`,
    `NOTE:${(card.about_us || '').replace(/[\r\n]+/g, ' ')}`,
    'END:VCARD'
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${slug}.vcf"`);
  res.send(vcard);
});

// List cards for current logged-in user
app.get('/api/cards', authMiddleware, (req, res) => {
  let cards;
  if (req.user.role === 'admin') {
    cards = db.prepare(`
      SELECT c.*, u.name as owner_name, u.email as owner_email, u.role as owner_role
      FROM cards c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.id DESC
    `).all();
  } else {
    cards = db.prepare('SELECT * FROM cards WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  }
  res.json({ cards });
});

// Create new card
app.post('/api/cards', authMiddleware, (req, res) => {
  const { company_name, theme_id = 26, slug } = req.body;
  if (!company_name) return res.status(400).json({ error: 'Company Name is required' });

  // If franchisee is creating a card, verify and deduct wallet balance!
  if (req.user.role === 'franchisee') {
    const costSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('franchise_card_price');
    const cardCost = parseFloat(costSetting ? costSetting.value : '150');

    if (req.user.wallet_balance < cardCost) {
      return res.status(400).json({
        error: `Insufficient wallet balance. You need ₹${cardCost}, current balance is ₹${req.user.wallet_balance}. Please recharge wallet.`
      });
    }

    // Deduct balance
    db.prepare('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?').run(cardCost, req.user.id);
    db.prepare('INSERT INTO wallet_transactions (user_id, amount, type, comment) VALUES (?, ?, ?, ?)').run(
      req.user.id,
      cardCost,
      'debit',
      `Card creation fee for: ${company_name}`
    );
  }

  // Generate clean slug if not provided
  let cardSlug = (slug || company_name)
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  // Ensure unique slug
  let finalSlug = cardSlug;
  let counter = 1;
  while (db.prepare('SELECT id FROM cards WHERE slug = ?').get(finalSlug)) {
    finalSlug = `${cardSlug}-${counter}`;
    counter++;
  }

  try {
    const result = db.prepare(`
      INSERT INTO cards (
        user_id, created_by_role, slug, company_name, theme_id,
        status, payment_status, phone, email
      ) VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?)
    `).run(
      req.user.id,
      req.user.role,
      finalSlug,
      company_name,
      theme_id,
      req.user.role === 'franchisee' ? 'paid' : 'trial',
      req.user.phone || '',
      req.user.email || ''
    );

    const newCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);
    res.json({ message: 'Card created successfully', card: newCard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update card
app.put('/api/cards/:id', authMiddleware, (req, res) => {
  const cardId = req.params.id;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  // Permissions check
  if (req.user.role !== 'admin' && card.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to edit this card' });
  }

  const fields = [
    'company_name', 'theme_id', 'theme_style', 'personal_name', 'designation',
    'phone', 'alt_phone', 'whatsapp', 'email', 'address', 'website', 'location_map',
    'company_est_date', 'about_us', 'logo_url', 'profile_url',
    'social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin',
    'social_youtube', 'social_pinterest', 'social_telegram', 'youtube_video',
    'payment_paytm', 'payment_gpay', 'payment_phonepe', 'payment_upi_id', 'payment_qr_url',
    'bank_name', 'bank_account_no', 'bank_ifsc', 'bank_holder_name', 'status'
  ];

  const updates = [];
  const values = [];

  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(req.body[f]);
    }
  }

  if (updates.length === 0) return res.json({ message: 'No fields to update', card });

  values.push(cardId);
  db.prepare(`UPDATE cards SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const updatedCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  res.json({ message: 'Card updated successfully', card: updatedCard });
});

// Delete card
app.delete('/api/cards/:id', authMiddleware, (req, res) => {
  const cardId = req.params.id;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  if (req.user.role !== 'admin' && card.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  db.prepare('DELETE FROM cards WHERE id = ?').run(cardId);
  res.json({ message: 'Card deleted successfully' });
});

// Toggle card status (active / deactivated)
app.post('/api/cards/:id/toggle-status', authMiddleware, (req, res) => {
  const cardId = req.params.id;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  const newStatus = card.status === 'active' ? 'deactivated' : 'active';
  db.prepare('UPDATE cards SET status = ? WHERE id = ?').run(newStatus, cardId);
  res.json({ message: `Card ${newStatus}`, status: newStatus });
});

// ==================== PRODUCTS ROUTES ====================

app.post('/api/cards/:id/products', authMiddleware, (req, res) => {
  const cardId = req.params.id;
  const { title, price, discount_price, description, image_url } = req.body;
  if (!title) return res.status(400).json({ error: 'Product title is required' });

  const info = db.prepare(`
    INSERT INTO products (card_id, title, price, discount_price, description, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(cardId, title, price || 0, discount_price || 0, description || '', image_url || '');

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  res.json({ message: 'Product added', product });
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted' });
});

// ==================== GALLERY ROUTES ====================

app.post('/api/cards/:id/gallery', authMiddleware, (req, res) => {
  const cardId = req.params.id;
  const { image_url, caption } = req.body;
  if (!image_url) return res.status(400).json({ error: 'Image URL is required' });

  const info = db.prepare('INSERT INTO gallery (card_id, image_url, caption) VALUES (?, ?, ?)').run(cardId, image_url, caption || '');
  const item = db.prepare('SELECT * FROM gallery WHERE id = ?').get(info.lastInsertRowid);
  res.json({ message: 'Gallery item added', item });
});

app.delete('/api/gallery/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ message: 'Gallery item deleted' });
});

// ==================== ENQUIRIES ROUTES ====================

app.post('/api/cards/:slug/enquiries', (req, res) => {
  const slug = req.params.slug;
  const card = db.prepare('SELECT id FROM cards WHERE slug = ?').get(slug);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  const { name, phone, email, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

  db.prepare('INSERT INTO enquiries (card_id, name, phone, email, message) VALUES (?, ?, ?, ?, ?)').run(
    card.id, name, phone, email || '', message || ''
  );

  res.json({ message: 'Enquiry submitted successfully! Thank you.' });
});

app.get('/api/cards/:id/enquiries', authMiddleware, (req, res) => {
  const enquiries = db.prepare('SELECT * FROM enquiries WHERE card_id = ? ORDER BY id DESC').all(req.params.id);
  res.json({ enquiries });
});

// ==================== PAYMENT & SIMULATION ====================

app.post('/api/pay/simulate', authMiddleware, (req, res) => {
  const { card_id, amount } = req.body;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(card_id);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  db.prepare("UPDATE cards SET payment_status = 'paid', status = 'active' WHERE id = ?").run(card_id);
  res.json({ message: 'Payment successful! Your digital card is now fully active for 1 year.' });
});

// ==================== FRANCHISEE ROUTES ====================

app.get('/api/franchise/dashboard', authMiddleware, (req, res) => {
  if (req.user.role !== 'franchisee' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Franchisee access required' });
  }

  const clientCards = db.prepare('SELECT * FROM cards WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  const transactions = db.prepare('SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  const settings = db.prepare('SELECT key, value FROM settings').all().reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});

  res.json({
    wallet_balance: req.user.wallet_balance,
    clientCards,
    transactions,
    franchise_card_price: parseFloat(settings.franchise_card_price || '150')
  });
});

// ==================== SUPER ADMIN ROUTES ====================

app.get('/api/admin/dashboard', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const totalCards = db.prepare('SELECT COUNT(*) as c FROM cards').get().c;
  const userCards = db.prepare("SELECT COUNT(*) as c FROM cards WHERE created_by_role = 'customer'").get().c;
  const franchiseeCards = db.prepare("SELECT COUNT(*) as c FROM cards WHERE created_by_role = 'franchisee'").get().c;
  const activeCards = db.prepare("SELECT COUNT(*) as c FROM cards WHERE status = 'active'").get().c;
  const inactiveCards = db.prepare("SELECT COUNT(*) as c FROM cards WHERE status = 'deactivated'").get().c;
  const trialCards = db.prepare("SELECT COUNT(*) as c FROM cards WHERE payment_status = 'trial'").get().c;
  const paidCards = db.prepare("SELECT COUNT(*) as c FROM cards WHERE payment_status = 'paid'").get().c;

  const allFranchisees = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'franchisee'").get().c;
  const allUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").get().c;

  const cardPriceSetting = db.prepare("SELECT value FROM settings WHERE key = 'card_price'").get();
  const cardPrice = parseFloat(cardPriceSetting?.value || '999');
  const paymentTotal = paidCards * cardPrice;

  res.json({
    summary: {
      totalCards,
      franchiseeCards,
      userCards,
      allFranchisees,
      allUsers,
      activeCards,
      inactiveCards,
      trialCards,
      paymentTotal
    }
  });
});

app.get('/api/admin/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const users = db.prepare(`
    SELECT u.id, u.role, u.name, u.email, u.phone, u.wallet_balance, u.status, u.created_at,
           COUNT(c.id) as cards_count
    FROM users u
    LEFT JOIN cards c ON u.id = c.user_id
    GROUP BY u.id
    ORDER BY u.id DESC
  `).all();
  res.json({ users });
});

app.post('/api/admin/recharge-wallet', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const { email, amount, comment } = req.body;
  if (!email || !amount) return res.status(400).json({ error: 'Email and amount required' });

  const franchisee = db.prepare("SELECT * FROM users WHERE email = ? AND role = 'franchisee'").get(email);
  if (!franchisee) return res.status(404).json({ error: 'Franchisee with this email not found' });

  const rechargeAmount = parseFloat(amount);
  if (isNaN(rechargeAmount) || rechargeAmount <= 0) return res.status(400).json({ error: 'Valid amount required' });

  db.prepare('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?').run(rechargeAmount, franchisee.id);
  db.prepare('INSERT INTO wallet_transactions (user_id, amount, type, comment) VALUES (?, ?, ?, ?)').run(
    franchisee.id, rechargeAmount, 'credit', comment || 'Admin manual recharge'
  );

  const updatedFranchisee = db.prepare('SELECT id, name, email, wallet_balance FROM users WHERE id = ?').get(franchisee.id);
  res.json({ message: `Successfully recharged ₹${rechargeAmount} to ${franchisee.name}`, franchisee: updatedFranchisee });
});

app.get('/api/admin/settings', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = rows.reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});
  res.json({ settings });
});

app.post('/api/admin/settings', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of Object.entries(req.body)) {
    updateStmt.run(k, String(v));
  }
  res.json({ message: 'Settings saved successfully' });
});

// SPA fallback: Send index.html for frontend routing in production
app.use((req, res) => {
  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    res.sendFile(path.join(distDir, 'index.html'));
  } else {
    res.send('API server is running. Start the frontend with: npm run dev');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Digital Card SaaS Portal API running on http://localhost:${PORT}`);
});
