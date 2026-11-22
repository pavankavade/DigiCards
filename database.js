const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initDatabase() {
    // 1. Users table
    db.exec(`
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
    `);

    // 2. Cards table with layout_template
    db.exec(`
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            created_by_role TEXT DEFAULT 'customer',
            slug TEXT UNIQUE NOT NULL,
            company_name TEXT NOT NULL,
            theme_id INTEGER DEFAULT 1,
            layout_template TEXT DEFAULT 'executive',
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
    `);

    // 3. Products / Services table
    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            price REAL NOT NULL,
            discount_price REAL,
            description TEXT,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
        );
    `);

    // 4. Gallery Images table
    db.exec(`
        CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_id INTEGER NOT NULL,
            image_url TEXT NOT NULL,
            caption TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
        );
    `);

    // 5. Inquiries / Leads table
    db.exec(`
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
    `);

    // 6. Wallet Transactions table (Modular Franchisee)
    db.exec(`
        CREATE TABLE IF NOT EXISTS wallet_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 7. System Settings table
    db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    `);

    // Safe schema migrations for existing database
    try {
        db.exec("ALTER TABLE users ADD COLUMN card_quota INTEGER DEFAULT 50;");
    } catch (e) {}

    try {
        db.exec("ALTER TABLE cards ADD COLUMN created_by_user_id INTEGER;");
    } catch (e) {}

    try {
        db.exec("ALTER TABLE users ADD COLUMN franchise_id INTEGER;");
    } catch (e) {}

    try {
        db.exec("ALTER TABLE users ADD COLUMN customer_code TEXT;");
    } catch (e) {}

    try {
        db.exec("ALTER TABLE users ADD COLUMN franchise_code TEXT;");
    } catch (e) {}

    try {
        db.exec("ALTER TABLE users ADD COLUMN franchise_pin TEXT;");
    } catch (e) {}

    try {
        db.exec("ALTER TABLE users ADD COLUMN approval_status TEXT DEFAULT 'approved';");
    } catch (e) {}

    try {
        db.exec("ALTER TABLE cards ADD COLUMN is_self_service INTEGER DEFAULT 0;");
    } catch (e) {}

    // Ensure demo franchise has codes
    try {
        db.prepare(`
            UPDATE users 
            SET franchise_code = COALESCE(franchise_code, 'FRAN-PUNE-8910'),
                franchise_pin = COALESCE(franchise_pin, '8910'),
                approval_status = 'approved'
            WHERE role = 'franchisee' AND email = 'franchise@example.com'
        `).run();

        db.prepare(`
            UPDATE users 
            SET customer_code = COALESCE(customer_code, 'CUST-ALEX-7712'),
                approval_status = 'approved'
            WHERE role = 'customer' AND email = 'user@example.com'
        `).run();
    } catch (e) {}

    // Seed default settings if empty
    const settingsCount = db.prepare("SELECT count(*) as c FROM settings").get().c;
    if (settingsCount === 0) {
        const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
        insertSetting.run("card_price", "999");
        insertSetting.run("franchise_card_price", "150");
        insertSetting.run("site_name", "DigiCards");
        insertSetting.run("contact_email", "support@digicards.com");
        insertSetting.run("admin_whatsapp", "917367063161");
        insertSetting.run("trial_days", "7");
    }

    // Seed clean initial users and starter card if empty
    const usersCount = db.prepare("SELECT count(*) as c FROM users").get().c;
    if (usersCount === 0) {
        console.log("Seeding clean initial users and fresh card starting at 0 views...");

        // 1. Super Admin
        db.prepare(`
            INSERT INTO users (role, name, email, phone, password, wallet_balance, status)
            VALUES ('admin', 'Super Admin', 'admin@example.com', '917367063161', 'admin123', 100000, 'active')
        `).run();

        // 2. Franchisee (Modular)
        db.prepare(`
            INSERT INTO users (role, name, email, phone, password, wallet_balance, status)
            VALUES ('franchisee', 'Franchise Partner', 'franchise@example.com', '9876543210', 'franchise123', 5000, 'active')
        `).run();

        // 3. Customer User
        const customerRes = db.prepare(`
            INSERT INTO users (role, name, email, phone, password, wallet_balance, status)
            VALUES ('customer', 'Alex Morgan', 'user@example.com', '9876543210', 'user123', 0, 'active')
        `).run();
        const customerId = customerRes.lastInsertRowid;

        // Fresh Starter Card with 0 VIEWS
        const cardRes = db.prepare(`
            INSERT INTO cards (
                user_id, created_by_role, slug, company_name, theme_id, layout_template,
                theme_style, status, payment_status, personal_name, designation, phone,
                alt_phone, whatsapp, email, address, website, location_map,
                company_est_date, about_us, logo_url, profile_url, social_facebook,
                social_twitter, social_instagram, social_linkedin, social_youtube,
                social_telegram, youtube_video, payment_upi_id, payment_qr_url,
                bank_name, bank_account_no, bank_ifsc, bank_holder_name, views_count
            ) VALUES (
                ?, 'customer', 'apex-studio', 'Apex Digital Studio', 1, 'executive',
                'theme-1', 'active', 'paid', 'Alex Morgan', 'Creative Director', '9876543210',
                '9876543211', '9876543210', 'contact@apexstudio.com', '100 Innovation Boulevard, Tech District',
                'https://apexstudio.com', 'https://maps.google.com/?q=Innovation+Park',
                '2024', 'We engineer next-generation digital identities, interactive visiting cards, and high-performance mini websites.',
                '/assets/img/demo/logo.png', '/assets/img/demo/profile.jpg',
                'https://facebook.com', 'https://twitter.com', 'https://instagram.com',
                'https://linkedin.com', 'https://youtube.com', 'https://t.me',
                'https://www.youtube.com/watch?v=o6tlSH-dypE', 'apexstudio@upi',
                '/assets/img/demo/sample-qr.png', 'HDFC Bank', '50100234567890', 'HDFC0001234',
                'APEX DIGITAL STUDIO', 0
            )
        `).run(customerId);

        const cardId = cardRes.lastInsertRowid;

        // Sample products
        const insertProduct = db.prepare(`
            INSERT INTO products (card_id, title, price, discount_price, description, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        insertProduct.run(cardId, "Custom Digital Visiting Card", 1499, 999, "Interactive digital card with 100 themes, 1-click vCard export, and WhatsApp integration.", "/assets/img/demo/prod1.png");
        insertProduct.run(cardId, "NFC Matte Metal Card", 1999, 1499, "Matte finish NFC smart business card. Tap any smartphone to share your profile instantly.", "/assets/img/demo/prod2.png");
        insertProduct.run(cardId, "Mini Website & E-Commerce Store", 3999, 2499, "Complete mini website with product catalog and WhatsApp 1-click ordering.", "/assets/img/demo/prod3.png");

        // Sample gallery
        const insertGallery = db.prepare("INSERT INTO gallery (card_id, image_url, caption) VALUES (?, ?, ?)");
        insertGallery.run(cardId, "/assets/img/demo/gallery1.jpg", "Creative Design Studio");
        insertGallery.run(cardId, "/assets/img/demo/gallery2.jpg", "Smart Card Mockups");
        insertGallery.run(cardId, "/assets/img/demo/gallery3.jpg", "Client Networking Event");
    }
}

initDatabase();

module.exports = db;
