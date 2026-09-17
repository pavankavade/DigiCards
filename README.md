# DigiCards - Digital Visiting Card & Mini Website SaaS Platform (100 Themes)

A modern, high-performance local clone of the **Digital Business Card PHP Portal with 100 Themes** demonstrated in the reference video (`https://www.youtube.com/watch?v=o6tlSH-dypE`).

Built with a **modern tech stack** (React 19, Tailwind CSS v4, Lucide Icons, Node.js Express 5, and SQLite) requiring **zero complex configuration** or external database installation.

---

## ⚡ Quick Start (Local Run)

### Option 1: Double-Click (Windows)
Double-click `run.bat` in the project root directory.
This automatically installs dependencies, builds the frontend, starts the unified server, and opens `http://localhost:5000` in your default browser.

### Option 2: Terminal Commands
```bash
# 1. Install dependencies
npm install

# 2. Build the frontend
npm run build

# 3. Start unified server on http://localhost:5000
npm start

# (Optional for hot reload development)
npm run dev
```

---

## 🔑 Default Demo Accounts

Use the **Quick Demo Login** bar at the top of the app or log in manually:

| Role | Email / Identifier | Password | Key Features |
|---|---|---|---|
| **Super Admin** | `admin@example.com` | `admin123` | Central analytics, user management, franchisee management, wallet recharge, Razorpay settings |
| **Franchisee** | `franchise@example.com` | `franchise123` | Reseller hub, ₹5,000 wallet balance, wholesale card creation (₹150/card deduction), client card management |
| **Customer** | `user@example.com` | `user123` | Preloaded **"ABC MARKETING"** card, 100 theme selector, 8-step card builder, live phone simulator |

---

## 🌟 Key Features Matching Video

1. **Public Landing Page (`/`)**:
   - Modern hero section with 3D interactive phone card preview matching `frame_010s.png` & `frame_215s.png`.
   - 3-step guide: Create your Store, Save to your Device, Share with Anyone.
   - 100 themes visual catalog with category filter tabs.
   - WhatsApp live floating widget.

2. **Public Interactive Visiting Card (`/card/:slug`)**:
   - Realistic smartphone bezel on desktop with geometric 3D dark textured background matching `frame_075s.png` and `frame_085s.png`.
   - Dynamic 100-Theme live switcher right on the card.
   - 1-Click Action Bar: Call (`tel:`), WhatsApp (`wa.me`), Mail (`mailto:`), Website (`http:`).
   - 1-Click **"Save to Contacts (vCard)"**: Generates standard RFC 6350 `.vcf` file syncing with phone contacts.
   - Direct WhatsApp Share Bar: Enter any mobile number and share card link directly.
   - Mini E-commerce Store: Showcase products with **"Order on WhatsApp"** button prefilling order message.
   - Dynamic UPI Payment QR: Supports Google Pay, PhonePe, Paytm, and bank account transfer details.
   - YouTube Video player embed.
   - Contact / Lead Enquiry form saving directly into card inquiries.
   - Deactivated status screen with "Activate Now" button matching `frame_165s.png`.

3. **Customer Portal (`/panel`)**:
   - Purple gradient login & registration matching `frame_025s.png`.
   - Dashboard table with Card ID, Company Name, Payment Status, Card Status, Date, Share, Edit, Pay Now matching `frame_040s.png`.
   - Split-screen Card Builder with 6 tabs and **LIVE real-time smartphone sync**.

4. **Franchisee Reseller Portal (`/franchisee`)**:
   - Reseller wallet balance system with credit deduction per created card.
   - Wholesale rate: ₹150 / card.
   - Client card management & activity ledger.

5. **Super Admin Portal (`/admin`)**:
   - Dashboard matching `frame_115s.png`: Total Cards, Franchisee Cards, User Cards, All Franchisees, All Users, Account Summary (₹999 total).
   - Wallet recharge system matching `frame_135s.png`: Credit balance to any franchisee email.
   - System settings: card pricing, Razorpay credentials, test mode simulation.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide React Icons, Vite.
- **Backend**: Node.js, Express 5, Cookie-Parser, Multer (file uploads), CORS.
- **Database**: SQLite (`better-sqlite3`) in WAL mode (`database.sqlite`).
- **Export Engine**: RFC 6350 vCard `.vcf` generator.
