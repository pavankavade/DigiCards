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

// Cryptographic security helpers for unique hack-proof codes
const crypto = require('crypto');

function generateCustomerCode() {
  const bytes = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `CUST-${bytes.slice(0, 4)}-${bytes.slice(4, 8)}-${bytes.slice(8, 12)}`;
}

function generateFranchiseCode(name = '') {
  const clean = (name || 'FRAN').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'PART';
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `FRAN-${clean}-${rand}`;
}

function generateFranchisePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Helper auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const userId = req.cookies.user_id || (authHeader && authHeader.replace('Bearer ', ''));
  if (!userId) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const user = db.prepare(`
    SELECT id, role, name, email, phone, wallet_balance, card_quota, status,
           franchise_id, customer_code, franchise_code, franchise_pin, approval_status
    FROM users WHERE id = ?
  `).get(userId);

  if (!user || user.status !== 'active') return res.status(401).json({ error: 'Invalid or inactive session' });
  if (user.approval_status === 'pending') return res.status(403).json({ error: 'Account application is pending Super Admin approval' });

  req.user = user;
  next();
}

// ==================== AUTH ROUTES ====================

app.post('/api/auth/login', (req, res) => {
  const { identifier, password, role } = req.body;
  if (!identifier || !password) return res.status(400).json({ error: 'Identifier and password required' });

  let query = 'SELECT * FROM users WHERE (email = ? OR phone = ? OR customer_code = ? OR franchise_code = ?) AND password = ?';
  let params = [identifier, identifier, identifier, identifier, password];
  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }

  const user = db.prepare(query).get(...params);
  if (!user) return res.status(401).json({ error: 'Invalid login credentials or wrong portal selected' });
  if (user.status !== 'active') return res.status(403).json({ error: 'Account has been deactivated. Please contact support.' });

  // Franchisee pending approval check
  if (user.role === 'franchisee' && user.approval_status === 'pending') {
    return res.status(403).json({
      error: 'Your Franchise Partner application is pending review by Super Admin. You will be able to log in once approved.'
    });
  }

  res.cookie('user_id', user.id, { httpOnly: false, maxAge: 86400000 });
  const { password: _, ...userData } = user;
  res.json({ message: 'Login successful', user: userData });
});

app.post('/api/auth/register', (req, res) => {
  const { 
    name, email, phone, password, role = 'customer',
    franchise_code, franchise_pin, agency_name, city
  } = req.body;

  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });

  // Strictly block online Admin registration (Single Tenant Super Admin)
  if (role === 'admin') {
    return res.status(403).json({ error: 'Admin registration is disabled. Super Admin is single-tenant and pre-configured.' });
  }

  // 1. Franchise Partner Registration (Requires Super Admin Approval)
  if (role === 'franchisee') {
    try {
      const fCode = generateFranchiseCode(agency_name || name);
      const fPin = generateFranchisePin();

      const info = db.prepare(`
        INSERT INTO users (
          role, name, email, phone, password, wallet_balance, card_quota, 
          status, approval_status, franchise_code, franchise_pin
        )
        VALUES ('franchisee', ?, ?, ?, ?, 0, 0, 'active', 'pending', ?, ?)
      `).run(
        name + (agency_name ? ` (${agency_name})` : ''),
        email.trim().toLowerCase(),
        phone || '',
        password,
        fCode,
        fPin
      );

      return res.json({
        message: 'Franchise Partner application submitted! Super Admin has received your request and will review & approve your account.',
        status: 'pending',
        franchise_code: fCode
      });
    } catch (err) {
      if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'This email is already registered.' });
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. Customer Registration
  try {
    let targetFranchiseId = null;

    // If customer specifies a franchise code
    if (franchise_code && franchise_code.trim()) {
      const cleanCode = franchise_code.trim().toUpperCase();
      const franchise = db.prepare(`
        SELECT id, name, franchise_pin, approval_status 
        FROM users 
        WHERE role = 'franchisee' AND franchise_code = ? COLLATE NOCASE
      `).get(cleanCode);

      if (!franchise || franchise.approval_status !== 'approved') {
        return res.status(400).json({ error: `Invalid or unapproved Franchise Code "${franchise_code}". Please verify with your Franchise Partner.` });
      }

      if (franchise_pin && franchise.franchise_pin && franchise.franchise_pin !== franchise_pin.trim()) {
        return res.status(400).json({ error: 'Invalid Franchise Security PIN. Please contact your partner.' });
      }

      targetFranchiseId = franchise.id;
    }

    const cCode = generateCustomerCode();

    const info = db.prepare(`
      INSERT INTO users (
        role, name, email, phone, password, wallet_balance, card_quota, 
        status, approval_status, franchise_id, customer_code
      )
      VALUES ('customer', ?, ?, ?, ?, 0, 0, 'active', 'approved', ?, ?)
    `).run(
      name,
      email.trim().toLowerCase(),
      phone || '',
      password,
      targetFranchiseId,
      cCode
    );

    const user = db.prepare(`
      SELECT id, role, name, email, phone, wallet_balance, card_quota, customer_code, franchise_id, approval_status 
      FROM users WHERE id = ?
    `).get(info.lastInsertRowid);

    res.cookie('user_id', user.id, { httpOnly: false, maxAge: 86400000 });
    res.json({
      message: 'Registration successful!',
      user,
      customer_code: cCode,
      has_franchise: Boolean(targetFranchiseId)
    });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'This email is already registered' });
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const userId = req.cookies.user_id || req.headers['authorization']?.replace('Bearer ', '');
  if (!userId) return res.json({ user: null });
  const user = db.prepare(`
    SELECT id, role, name, email, phone, wallet_balance, card_quota, status,
           customer_code, franchise_code, franchise_pin, franchise_id, approval_status
    FROM users WHERE id = ?
  `).get(userId);
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
  let card = db.prepare('SELECT * FROM cards WHERE slug = ? COLLATE NOCASE').get(slug);
  if (!card && ['demo', 'apex-studio', 'abc-marketing'].includes(slug.toLowerCase())) {
    card = db.prepare("SELECT * FROM cards WHERE slug IN ('demo', 'apex-studio', 'ABC-Marketing') ORDER BY id ASC LIMIT 1").get();
  }
  if (!card) return res.status(404).json({ error: 'Card not found' });

  // Increment view counter
  db.prepare('UPDATE cards SET views_count = views_count + 1 WHERE id = ?').run(card.id);

  const products = db.prepare('SELECT * FROM products WHERE card_id = ? ORDER BY id DESC').all(card.id);
  const gallery = db.prepare('SELECT * FROM gallery WHERE card_id = ? ORDER BY id DESC').all(card.id);
  const settings = db.prepare('SELECT key, value FROM settings').all().reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});

  res.json({ card, products, gallery, settings });
});

// vCard (.vcf) download for 1-click Contact Saving
app.get(['/api/cards/public/:slug/vcard', '/api/cards/:slug/vcard'], (req, res) => {
  const slug = req.params.slug;
  let card = db.prepare('SELECT * FROM cards WHERE slug = ? COLLATE NOCASE').get(slug);
  if (!card && ['demo', 'apex-studio', 'abc-marketing'].includes(slug.toLowerCase())) {
    card = db.prepare("SELECT * FROM cards WHERE slug IN ('demo', 'apex-studio', 'ABC-Marketing') ORDER BY id ASC LIMIT 1").get();
  }
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
      SELECT c.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.role as owner_role,
             creator.name as creator_name
      FROM cards c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users creator ON c.created_by_user_id = creator.id
      ORDER BY c.id DESC
    `).all();
  } else if (req.user.role === 'franchisee') {
    cards = db.prepare(`
      SELECT c.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.role as owner_role
      FROM cards c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.created_by_user_id = ? OR c.user_id = ?
      ORDER BY c.id DESC
    `).all(req.user.id, req.user.id);
  } else {
    // Customer: Only see cards assigned to them
    cards = db.prepare(`
      SELECT c.*, creator.name as creator_name, creator.phone as creator_phone
      FROM cards c
      LEFT JOIN users creator ON c.created_by_user_id = creator.id
      WHERE c.user_id = ?
      ORDER BY c.id DESC
    `).all(req.user.id);
  }
  res.json({ cards });
});

// Create new card: Strictly restricted to Franchisee and Super Admin
app.post('/api/cards', authMiddleware, (req, res) => {
  // 1. Customer cannot create cards through the franchise endpoint
  if (req.user.role === 'customer') {
    return res.status(403).json({
      error: 'Customer accounts cannot create cards. Please contact your appointed Franchise Partner to create or issue a new digital card, or use the Direct Self-Service option.'
    });
  }

  const { 
    company_name, theme_id = 1, slug, layout_template = 'executive',
    customer_name, customer_email, customer_phone, customer_code
  } = req.body;

  if (!company_name) return res.status(400).json({ error: 'Company Name is required' });

  let targetUserId = req.user.id;

  // 2. If franchisee is creating a card for a client
  if (req.user.role === 'franchisee') {
    const franchiseUser = db.prepare('SELECT card_quota, wallet_balance FROM users WHERE id = ?').get(req.user.id);
    const quota = franchiseUser?.card_quota !== undefined ? franchiseUser.card_quota : 50;

    if (quota <= 0) {
      return res.status(400).json({
        error: 'Card creation quota exhausted. Please contact Super Admin to recharge your franchise card quota pack.'
      });
    }

    // Step A: If customer_code is provided, lookup client directly by their unique security code
    if (customer_code && customer_code.trim()) {
      const cleanCode = customer_code.trim().toUpperCase();
      const existingClient = db.prepare('SELECT id, name, email, phone FROM users WHERE customer_code = ? COLLATE NOCASE').get(cleanCode);
      if (existingClient) {
        targetUserId = existingClient.id;
        // Bind customer to this franchise if not already bound
        db.prepare('UPDATE users SET franchise_id = ? WHERE id = ?').run(req.user.id, existingClient.id);
      } else {
        return res.status(400).json({ error: `Customer with Security Code "${customer_code}" not found. Please double-check the code.` });
      }
    } 
    // Step B: If customer_email is provided
    else if (customer_email && customer_email.trim()) {
      const trimmedEmail = customer_email.trim().toLowerCase();
      let existingCustomer = db.prepare('SELECT id FROM users WHERE email = ?').get(trimmedEmail);
      if (existingCustomer) {
        targetUserId = existingCustomer.id;
        db.prepare('UPDATE users SET franchise_id = ? WHERE id = ?').run(req.user.id, existingCustomer.id);
      } else {
        const cCode = generateCustomerCode();
        const newCust = db.prepare(`
          INSERT INTO users (role, name, email, phone, password, wallet_balance, card_quota, status, franchise_id, customer_code)
          VALUES ('customer', ?, ?, ?, 'user123', 0, 0, 'active', ?, ?)
        `).run(
          customer_name || company_name, 
          trimmedEmail, 
          customer_phone || req.body.phone || '',
          req.user.id,
          cCode
        );
        targetUserId = newCust.lastInsertRowid;
      }
    }

    // Deduct 1 card from quota
    db.prepare('UPDATE users SET card_quota = card_quota - 1 WHERE id = ?').run(req.user.id);
  }

  // Generate clean unique slug
  let cardSlug = (slug || company_name)
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  let finalSlug = cardSlug;
  let counter = 1;
  while (db.prepare('SELECT id FROM cards WHERE slug = ?').get(finalSlug)) {
    finalSlug = `${cardSlug}-${counter}`;
    counter++;
  }

  try {
    const result = db.prepare(`
      INSERT INTO cards (
        user_id, created_by_user_id, created_by_role, slug, company_name, theme_id, layout_template,
        status, payment_status, phone, email, personal_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
    `).run(
      targetUserId,
      req.user.id,
      req.user.role,
      finalSlug,
      company_name,
      theme_id || 1,
      layout_template || 'executive',
      req.user.role === 'franchisee' ? 'paid' : 'trial',
      req.body.phone || customer_phone || '',
      req.body.email || customer_email || '',
      customer_name || req.body.personal_name || ''
    );

    const newCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);
    res.json({ message: 'Card created successfully', card: newCard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Direct Self-Service Card: For customers creating their card directly online (without a franchise)
app.post('/api/cards/self-service', authMiddleware, (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer access required for self-service card' });
  }

  const { company_name, layout_template = 'executive', theme_id = 1, phone, email, personal_name, slug } = req.body;
  if (!company_name) return res.status(400).json({ error: 'Company Name is required' });

  // Generate clean unique slug
  let cardSlug = (slug || company_name)
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  let finalSlug = cardSlug;
  let counter = 1;
  while (db.prepare('SELECT id FROM cards WHERE slug = ?').get(finalSlug)) {
    finalSlug = `${cardSlug}-${counter}`;
    counter++;
  }

  try {
    const result = db.prepare(`
      INSERT INTO cards (
        user_id, created_by_user_id, created_by_role, slug, company_name, theme_id, layout_template,
        status, payment_status, phone, email, personal_name, is_self_service
      ) VALUES (?, NULL, 'direct', ?, ?, ?, ?, 'pending_approval', 'pending', ?, ?, ?, 1)
    `).run(
      req.user.id,
      finalSlug,
      company_name,
      theme_id || 1,
      layout_template || 'executive',
      phone || req.user.phone || '',
      email || req.user.email || '',
      personal_name || req.user.name || ''
    );

    const newCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);
    res.json({ message: 'Self-service card submitted! It is currently pending approval by Super Admin.', card: newCard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update card
app.put('/api/cards/:id', authMiddleware, (req, res) => {
  const cardId = req.params.id;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  // Permissions check: Super Admin, Creator Franchisee, or Customer Owner
  const isAuthorized = req.user.role === 'admin' || 
                       (req.user.role === 'franchisee' && (card.created_by_user_id === req.user.id || card.user_id === req.user.id)) ||
                       (req.user.role === 'customer' && card.user_id === req.user.id);

  if (!isAuthorized) {
    return res.status(403).json({ error: 'Unauthorized to edit this card' });
  }

  const fields = [
    'company_name', 'theme_id', 'layout_template', 'theme_style', 'personal_name', 'designation',
    'phone', 'alt_phone', 'whatsapp', 'email', 'address', 'website', 'location_map',
    'company_est_date', 'about_us', 'logo_url', 'profile_url',
    'social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin',
    'social_youtube', 'social_pinterest', 'social_telegram', 'youtube_video',
    'payment_paytm', 'payment_gpay', 'payment_phonepe', 'payment_upi_id', 'payment_qr_url',
    'bank_name', 'bank_account_no', 'bank_ifsc', 'bank_holder_name', 'status'
  ];

  // Customers cannot modify 'status' via PUT
  if (req.user.role === 'customer' && req.body.status !== undefined) {
    delete req.body.status;
  }

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

  // Only Admin or Creator Franchisee can delete
  if (req.user.role !== 'admin' && card.created_by_user_id !== req.user.id) {
    return res.status(403).json({ error: 'Customer cannot delete cards. Please request your Franchise Partner.' });
  }

  db.prepare('DELETE FROM cards WHERE id = ?').run(cardId);
  res.json({ message: 'Card deleted successfully' });
});

// Toggle card status (active / deactivated): Customer strictly prohibited
app.post('/api/cards/:id/toggle-status', authMiddleware, (req, res) => {
  if (req.user.role === 'customer') {
    return res.status(403).json({
      error: 'Customer accounts cannot toggle card status. Only your Franchise Partner or Super Admin can activate or deactivate cards.'
    });
  }

  const cardId = req.params.id;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  if (req.user.role === 'franchisee' && card.created_by_user_id !== req.user.id && card.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to manage this card' });
  }

  const newStatus = card.status === 'active' ? 'deactivated' : 'active';
  db.prepare('UPDATE cards SET status = ? WHERE id = ?').run(newStatus, cardId);
  res.json({ message: `Card ${newStatus}`, status: newStatus });
});

// Set trial / paid status: Franchisee & Super Admin control
app.post('/api/cards/:id/set-payment-status', authMiddleware, (req, res) => {
  if (req.user.role === 'customer') {
    return res.status(403).json({ error: 'Customer accounts cannot modify subscription status.' });
  }

  const cardId = req.params.id;
  const { payment_status } = req.body;
  if (!['trial', 'paid', 'expired'].includes(payment_status)) {
    return res.status(400).json({ error: 'Invalid payment status' });
  }

  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  if (req.user.role === 'franchisee' && card.created_by_user_id !== req.user.id && card.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to manage this card' });
  }

  db.prepare('UPDATE cards SET payment_status = ? WHERE id = ?').run(payment_status, cardId);
  res.json({ message: `Card subscription set to ${payment_status}`, payment_status });
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

  const franchiseUser = db.prepare(`
    SELECT card_quota, wallet_balance, franchise_code, franchise_pin 
    FROM users WHERE id = ?
  `).get(req.user.id);

  const clientCards = db.prepare(`
    SELECT c.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone, u.customer_code
    FROM cards c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.created_by_user_id = ? OR c.user_id = ?
    ORDER BY c.id DESC
  `).all(req.user.id, req.user.id);

  // Registered customers under this franchise
  const clients = db.prepare(`
    SELECT u.id, u.name, u.email, u.phone, u.customer_code, u.status, u.created_at,
           (SELECT COUNT(*) FROM cards WHERE user_id = u.id AND created_by_user_id = ?) as cards_count
    FROM users u
    WHERE u.franchise_id = ?
    ORDER BY u.id DESC
  `).all(req.user.id, req.user.id);

  const transactions = db.prepare('SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  const settings = db.prepare('SELECT key, value FROM settings').all().reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});

  res.json({
    card_quota: franchiseUser?.card_quota !== undefined ? franchiseUser.card_quota : 50,
    wallet_balance: req.user.wallet_balance || 0,
    franchise_code: franchiseUser?.franchise_code || 'FRAN-PUNE-8910',
    franchise_pin: franchiseUser?.franchise_pin || '8910',
    clientCards,
    clients,
    transactions,
    franchise_card_price: parseFloat(settings.franchise_card_price || '150')
  });
});

// ==================== SUPER ADMIN ROUTES ====================

// Admin Franchise Management: List all approved franchises
app.get('/api/admin/franchises', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const franchises = db.prepare(`
    SELECT u.id, u.name, u.email, u.phone, u.wallet_balance, COALESCE(u.card_quota, 50) as card_quota, 
           u.status, u.approval_status, u.franchise_code, u.franchise_pin, u.created_at,
           (SELECT COUNT(*) FROM cards WHERE created_by_user_id = u.id) as cards_created,
           (SELECT COUNT(*) FROM users WHERE franchise_id = u.id) as customers_count
    FROM users u
    WHERE u.role = 'franchisee' AND (u.approval_status = 'approved' OR u.approval_status IS NULL)
    ORDER BY u.id DESC
  `).all();

  res.json({ franchises });
});

// Admin Pending Franchise Applications
app.get('/api/admin/franchise-requests', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const requests = db.prepare(`
    SELECT id, name, email, phone, franchise_code, franchise_pin, status, approval_status, created_at
    FROM users
    WHERE role = 'franchisee' AND approval_status = 'pending'
    ORDER BY id DESC
  `).all();

  res.json({ requests });
});

// Admin Approve Franchise Application
app.post('/api/admin/franchises/:id/approve', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const franchiseId = req.params.id;
  const { card_quota = 50 } = req.body;

  db.prepare(`
    UPDATE users 
    SET approval_status = 'approved', status = 'active', card_quota = ?
    WHERE id = ? AND role = 'franchisee'
  `).run(parseInt(card_quota) || 50, franchiseId);

  const approved = db.prepare('SELECT id, name, email, phone, franchise_code, card_quota FROM users WHERE id = ?').get(franchiseId);
  res.json({ message: 'Franchise Partner application approved successfully!', franchise: approved });
});

// Admin Reject Franchise Application
app.post('/api/admin/franchises/:id/reject', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const franchiseId = req.params.id;
  db.prepare("DELETE FROM users WHERE id = ? AND role = 'franchisee' AND approval_status = 'pending'").run(franchiseId);
  res.json({ message: 'Franchise application rejected and removed.' });
});

// Admin Remove / Delete Franchise Partner
app.delete('/api/admin/franchises/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const franchiseId = req.params.id;
  const fran = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'franchisee'").get(franchiseId);
  if (!fran) return res.status(404).json({ error: 'Franchise Partner not found' });

  // Reassign cards created by this franchise so Super Admin manages them directly
  db.prepare('UPDATE cards SET created_by_user_id = NULL WHERE created_by_user_id = ?').run(franchiseId);
  // Detach customers so they become direct customers under Admin
  db.prepare('UPDATE users SET franchise_id = NULL WHERE franchise_id = ?').run(franchiseId);

  // Delete franchise record
  db.prepare('DELETE FROM users WHERE id = ?').run(franchiseId);

  res.json({ message: `Franchise partner "${fran.name}" has been removed. All customer cards have been reassigned directly to Super Admin.` });
});

// Admin All Customers with Franchise Mapping
app.get('/api/admin/customers', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const customers = db.prepare(`
    SELECT u.id, u.name, u.email, u.phone, u.customer_code, u.franchise_id, u.status, u.created_at,
           f.name as franchise_name, f.franchise_code as franchise_code,
           COUNT(c.id) as cards_count
    FROM users u
    LEFT JOIN users f ON u.franchise_id = f.id
    LEFT JOIN cards c ON u.id = c.user_id
    WHERE u.role = 'customer'
    GROUP BY u.id
    ORDER BY u.id DESC
  `).all();

  res.json({ customers });
});

// Admin Delete Customer
app.delete('/api/admin/users/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const userId = req.params.id;
  const user = db.prepare('SELECT id, name, role FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Super Admin cannot be deleted.' });

  db.prepare('DELETE FROM cards WHERE user_id = ?').run(userId);
  db.prepare('DELETE FROM users WHERE id = ?').run(userId);

  res.json({ message: `Customer "${user.name}" and their cards have been deleted.` });
});

// Admin Toggle Customer Status (Active / Suspended)
app.post('/api/admin/users/:id/toggle-status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const userId = req.params.id;
  const user = db.prepare('SELECT id, status, name, role FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Cannot deactivate Super Admin.' });

  const newStatus = user.status === 'active' ? 'suspended' : 'active';
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(newStatus, userId);
  res.json({ message: `User status changed to ${newStatus}`, status: newStatus });
});

// Admin Appoint New Franchise (Direct allocation)
app.post('/api/admin/franchises', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const { name, email, phone, password, card_quota = 50 } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password required' });

  try {
    const fCode = generateFranchiseCode(name);
    const fPin = generateFranchisePin();

    const info = db.prepare(`
      INSERT INTO users (
        role, name, email, phone, password, card_quota, wallet_balance, 
        status, approval_status, franchise_code, franchise_pin
      )
      VALUES ('franchisee', ?, ?, ?, ?, ?, 0, 'active', 'approved', ?, ?)
    `).run(name, email.trim().toLowerCase(), phone || '', password, parseInt(card_quota) || 50, fCode, fPin);

    const newFranchise = db.prepare(`
      SELECT id, role, name, email, phone, card_quota, franchise_code, franchise_pin 
      FROM users WHERE id = ?
    `).get(info.lastInsertRowid);

    res.json({ message: 'Franchise appointed successfully', franchise: newFranchise });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
});

// Admin Recharge Franchise Quota
app.post('/api/admin/franchises/:id/recharge', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  const franchiseId = req.params.id;
  const { additional_quota = 0, amount = 0, pack_name = 'Custom Pack' } = req.body;

  const franchise = db.prepare('SELECT * FROM users WHERE id = ? AND role = "franchisee"').get(franchiseId);
  if (!franchise) return res.status(404).json({ error: 'Franchise not found' });

  const quotaToAdd = parseInt(additional_quota) || 0;
  db.prepare('UPDATE users SET card_quota = COALESCE(card_quota, 0) + ? WHERE id = ?').run(quotaToAdd, franchiseId);

  if (amount > 0) {
    db.prepare('INSERT INTO wallet_transactions (user_id, amount, type, comment) VALUES (?, ?, "credit", ?)').run(
      franchiseId,
      parseFloat(amount),
      `Quota Pack Recharge: ${pack_name} (+${quotaToAdd} cards)`
    );
  }

  const updated = db.prepare('SELECT id, name, email, card_quota, wallet_balance FROM users WHERE id = ?').get(franchiseId);
  res.json({ message: `Successfully allocated +${quotaToAdd} cards to franchise quota`, franchise: updated });
});

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

// Admin All Enquiries
app.get('/api/admin/enquiries', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const enquiries = db.prepare(`
    SELECT e.*, c.company_name, c.slug, u.name as owner_name, u.email as owner_email
    FROM enquiries e
    JOIN cards c ON e.card_id = c.id
    LEFT JOIN users u ON c.user_id = u.id
    ORDER BY e.id DESC
  `).all();
  res.json({ enquiries });
});

// Admin Direct Deal Card Payment Status Toggle
app.post('/api/admin/cards/:id/payment-status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const { payment_status, status } = req.body;
  const cardId = req.params.id;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  const newPayStatus = payment_status || (card.payment_status === 'paid' ? 'trial' : 'paid');
  const newStatus = status || (newPayStatus === 'paid' ? 'active' : card.status);

  db.prepare('UPDATE cards SET payment_status = ?, status = ? WHERE id = ?').run(newPayStatus, newStatus, cardId);
  res.json({ message: `Card updated to ${newPayStatus} / ${newStatus}`, cardId, payment_status: newPayStatus, status: newStatus });
});

// Admin List Pending Cards
app.get('/api/admin/pending-cards', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const cards = db.prepare(`
    SELECT c.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
    FROM cards c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.status = 'pending_approval'
    ORDER BY c.id DESC
  `).all();
  res.json({ cards });
});

// Admin Approve Self-Service Card
app.post('/api/admin/cards/:id/approve', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const cardId = req.params.id;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  db.prepare("UPDATE cards SET status = 'active', payment_status = 'paid' WHERE id = ?").run(cardId);
  res.json({ message: 'Card approved and activated successfully', cardId });
});

// Admin Reject Self-Service Card
app.post('/api/admin/cards/:id/reject', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const cardId = req.params.id;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  db.prepare('DELETE FROM products WHERE card_id = ?').run(cardId);
  db.prepare('DELETE FROM gallery WHERE card_id = ?').run(cardId);
  db.prepare('DELETE FROM enquiries WHERE card_id = ?').run(cardId);
  db.prepare('DELETE FROM cards WHERE id = ?').run(cardId);
  res.json({ message: 'Card rejected and removed', cardId });
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
