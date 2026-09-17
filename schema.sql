-- DigiCards Cloudflare D1 Database Schema & Seed Data

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL DEFAULT 'customer',
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    wallet_balance REAL DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cards table
CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    created_by_role TEXT DEFAULT 'customer',
    slug TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    theme_id INTEGER DEFAULT 1,
    theme_style TEXT DEFAULT 'theme-1',
    status TEXT DEFAULT 'active',
    payment_status TEXT DEFAULT 'trial',
    personal_name TEXT,
    designation TEXT,
    phone TEXT,
    alt_phone TEXT,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    website TEXT,
    location_map TEXT,
    company_est_date TEXT,
    about_us TEXT,
    logo_url TEXT,
    profile_url TEXT,
    social_facebook TEXT,
    social_twitter TEXT,
    social_instagram TEXT,
    social_linkedin TEXT,
    social_youtube TEXT,
    social_pinterest TEXT,
    social_telegram TEXT,
    youtube_video TEXT,
    payment_paytm TEXT,
    payment_gpay TEXT,
    payment_phonepe TEXT,
    payment_upi_id TEXT,
    payment_qr_url TEXT,
    bank_name TEXT,
    bank_account_no TEXT,
    bank_ifsc TEXT,
    bank_holder_name TEXT,
    views_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    price REAL DEFAULT 0,
    discount_price REAL DEFAULT 0,
    image_url TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- 4. Gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- 5. Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- 6. Wallet Transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Seed Settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('site_name', 'DesiCard Digital Services');
INSERT OR IGNORE INTO settings (key, value) VALUES ('currency', '₹');
INSERT OR IGNORE INTO settings (key, value) VALUES ('card_price', '999');
INSERT OR IGNORE INTO settings (key, value) VALUES ('franchise_card_price', '150');
INSERT OR IGNORE INTO settings (key, value) VALUES ('trial_days', '7');
INSERT OR IGNORE INTO settings (key, value) VALUES ('razorpay_key', 'rzp_test_1234567890ABCD');
INSERT OR IGNORE INTO settings (key, value) VALUES ('razorpay_secret', 'rzp_secret_dummy_12345');
INSERT OR IGNORE INTO settings (key, value) VALUES ('test_mode', 'true');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_phone', '+91 7367063161');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_email', 'info@desicard.in');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_address', 'Gandhi Maidan, Patna 800001 Bihar, India');

-- Seed Default Users
INSERT OR IGNORE INTO users (id, role, name, email, phone, password, wallet_balance, status)
VALUES (1, 'admin', 'Super Admin', 'admin@example.com', '7367063161', 'admin123', 0, 'active');

INSERT OR IGNORE INTO users (id, role, name, email, phone, password, wallet_balance, status)
VALUES (2, 'franchisee', 'Patna Reseller Hub', 'franchise@example.com', '9876543210', 'franchise123', 5000, 'active');

INSERT OR IGNORE INTO wallet_transactions (id, user_id, amount, type, comment)
VALUES (1, 2, 5000, 'credit', 'Initial promotional balance credited by admin');

INSERT OR IGNORE INTO users (id, role, name, email, phone, password, wallet_balance, status)
VALUES (3, 'customer', 'Irshad Kamil', 'user@example.com', '7367063161', 'user123', 0, 'active');

-- Seed Demo Card 'ABC MARKETING'
INSERT OR IGNORE INTO cards (
    id, user_id, created_by_role, slug, company_name, theme_id, theme_style,
    status, payment_status, personal_name, designation, phone, alt_phone,
    whatsapp, email, address, website, location_map, company_est_date,
    about_us, logo_url, profile_url, social_facebook, social_twitter,
    social_instagram, social_linkedin, social_youtube, social_pinterest,
    social_telegram, youtube_video, payment_paytm, payment_gpay,
    payment_phonepe, payment_upi_id, payment_qr_url, bank_name,
    bank_account_no, bank_ifsc, bank_holder_name, views_count
) VALUES (
    1, 3, 'customer', 'ABC-Marketing', 'ABC MARKETING', 26, 'theme-26',
    'active', 'paid', 'Irshad Kamil', 'CEO & Founder', '7367063161', '9876543210',
    '7367063161', 'abcmarketingofficial@gmail.com', 'Gandhi Maidan, Patna, Bihar 800001',
    'https://desicard.in', 'https://maps.google.com/?q=Patna+Bihar', '2021',
    'Best Marketing Software & Digital Business Card Provider in Patna. We help entrepreneurs, businesses, and professionals build their high-converting digital identity and mini ecommerce store.',
    '/assets/img/demo/logo.png', '/assets/img/demo/profile.jpg',
    'https://facebook.com', 'https://twitter.com', 'https://instagram.com',
    'https://linkedin.com', 'https://youtube.com/@ABCMarketing', 'https://pinterest.com',
    'https://t.me/abcmarketing', 'https://www.youtube.com/watch?v=o6tlSH-dypE',
    '7367063161', '7367063161', '7367063161', 'abcmarketing@upi',
    '/assets/img/demo/sample-qr.png', 'State Bank of India', '39872145678', 'SBIN0001234',
    'ABC MARKETING DIGITAL SERVICES', 142
);

-- Seed Products for ABC Marketing
INSERT OR IGNORE INTO products (id, card_id, title, price, discount_price, description, image_url)
VALUES (1, 1, 'Digital Business Card Portal Source Code', 4999, 1999, 'Complete PHP/Node source code with 100 themes, Franchisee module, Admin portal, and Razorpay integration.', '/assets/img/demo/prod1.png');

INSERT OR IGNORE INTO products (id, card_id, title, price, discount_price, description, image_url)
VALUES (2, 1, 'NFC Smart Metal Business Card', 1499, 999, 'Tap and share contact info instantly with any NFC-enabled smartphone. Waterproof and engraved.', '/assets/img/demo/prod2.png');

INSERT OR IGNORE INTO products (id, card_id, title, price, discount_price, description, image_url)
VALUES (3, 1, 'Mini E-commerce Store Setup', 2999, 1499, 'Turn your digital visiting card into a 24/7 product catalog with instant 1-click WhatsApp order placement.', '/assets/img/demo/prod3.png');

-- Seed Gallery for ABC Marketing
INSERT OR IGNORE INTO gallery (id, card_id, image_url, caption)
VALUES (1, 1, '/assets/img/demo/gallery1.jpg', 'Our Creative Studio & Team');

INSERT OR IGNORE INTO gallery (id, card_id, image_url, caption)
VALUES (2, 1, '/assets/img/demo/gallery2.jpg', 'Digital Visiting Card Mockup Showcase');

INSERT OR IGNORE INTO gallery (id, card_id, image_url, caption)
VALUES (3, 1, '/assets/img/demo/gallery3.jpg', 'Client Networking Event 2026');

-- Seed Sample Enquiries
INSERT OR IGNORE INTO enquiries (id, card_id, name, phone, email, message)
VALUES (1, 1, 'Rajesh Kumar', '9812345678', 'rajesh@example.com', 'Interested in setting up 15 digital cards for my sales team.');

INSERT OR IGNORE INTO enquiries (id, card_id, name, phone, email, message)
VALUES (2, 1, 'Pooja Verma', '9876501234', 'pooja@example.com', 'Can you also provide NFC smart cards with my custom branding?');
