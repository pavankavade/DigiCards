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

INSERT OR IGNORE INTO users (id, role, name, email, phone, password, wallet_balance, status)
VALUES (1, 'admin', 'Super Admin', 'admin@example.com', '7367063161', 'admin123', 0, 'active');

INSERT OR IGNORE INTO users (id, role, name, email, phone, password, wallet_balance, status)
VALUES (2, 'franchisee', 'Patna Reseller Hub', 'franchise@example.com', '9876543210', 'franchise123', 5000, 'active');

INSERT OR IGNORE INTO wallet_transactions (id, user_id, amount, type, comment)
VALUES (1, 2, 5000, 'credit', 'Initial promotional balance credited by admin');

INSERT OR IGNORE INTO users (id, role, name, email, phone, password, wallet_balance, status)
VALUES (3, 'customer', 'Irshad Kamil', 'user@example.com', '7367063161', 'user123', 0, 'active');

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

INSERT OR IGNORE INTO products (id, card_id, title, price, discount_price, description, image_url)
VALUES (1, 1, 'Digital Business Card Portal Source Code', 4999, 1999, 'Complete PHP/Node source code with 100 themes, Franchisee module, Admin portal, and Razorpay integration.', '/assets/img/demo/prod1.png');

INSERT OR IGNORE INTO products (id, card_id, title, price, discount_price, description, image_url)
VALUES (2, 1, 'NFC Smart Metal Business Card', 1499, 999, 'Tap and share contact info instantly with any NFC-enabled smartphone. Waterproof and engraved.', '/assets/img/demo/prod2.png');

INSERT OR IGNORE INTO products (id, card_id, title, price, discount_price, description, image_url)
VALUES (3, 1, 'Mini E-commerce Store Setup', 2999, 1499, 'Turn your digital visiting card into a 24/7 product catalog with instant 1-click WhatsApp order placement.', '/assets/img/demo/prod3.png');

INSERT OR IGNORE INTO gallery (id, card_id, image_url, caption)
VALUES (1, 1, '/assets/img/demo/gallery1.jpg', 'Our Creative Studio & Team');

INSERT OR IGNORE INTO gallery (id, card_id, image_url, caption)
VALUES (2, 1, '/assets/img/demo/gallery2.jpg', 'Digital Visiting Card Mockup Showcase');

INSERT OR IGNORE INTO gallery (id, card_id, image_url, caption)
VALUES (3, 1, '/assets/img/demo/gallery3.jpg', 'Client Networking Event 2026');

INSERT OR IGNORE INTO enquiries (id, card_id, name, phone, email, message)
VALUES (1, 1, 'Rajesh Kumar', '9812345678', 'rajesh@example.com', 'Interested in setting up 15 digital cards for my sales team.');

INSERT OR IGNORE INTO enquiries (id, card_id, name, phone, email, message)
VALUES (2, 1, 'Pooja Verma', '9876501234', 'pooja@example.com', 'Can you also provide NFC smart cards with my custom branding?');
