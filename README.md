# DigiCards - 100 Themes Digital Visiting Card & Mini Website SaaS Platform

[![Live Production Demo](https://img.shields.io/badge/Live%20Demo-digicards--app.pages.dev-success?style=for-the-badge&logo=cloudflare)](https://digicards-app.pages.dev)
[![GitHub Repository](https://img.shields.io/badge/GitHub-pavankavade%2FDigiCards-blue?style=for-the-badge&logo=github)](https://github.com/pavankavade/DigiCards)
[![Cloudflare Free Tier](https://img.shields.io/badge/Cloudflare-Pages%20%2B%20D1%20%2B%20R2-orange?style=for-the-badge&logo=cloudflare)](https://developers.cloudflare.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Tailwind%20v4-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

A modern, high-performance **Digital Business Card & Mini Website SaaS platform with 100 dynamic themes**, multi-tenant architecture, Franchisee reseller module, Super Admin control center, and RFC 6350 vCard contact export.

Built with a **dual architecture** supporting both **100% offline local development** (Node.js Express + SQLite) and **100% serverless edge production** on **Cloudflare Pages, Cloudflare D1 (Serverless SQLite), and Cloudflare R2** on the free tier.

---

## 🌐 Live Production Demo
- **Main Portal**: [https://digicards-app.pages.dev](https://digicards-app.pages.dev)
- **Live Demo Visiting Card**: [https://digicards-app.pages.dev/card/ABC-Marketing](https://digicards-app.pages.dev/card/ABC-Marketing)
- **Connected Edge API**: [https://digicards-app.pages.dev/api/cards/public/ABC-Marketing](https://digicards-app.pages.dev/api/cards/public/ABC-Marketing)

---

## 🌟 Key Features

### 1. Public Interactive Visiting Card (`/card/:slug`)
- **Realistic Smartphone Bezel**: Responsive desktop view showcasing a 3D smartphone simulator with dark textured geometric backdrop.
- **Dynamic 100-Theme Live Switcher**: Instantly switch and preview any of the 100 hand-crafted themes directly on the live card.
- **1-Click Action Bar**: Instant interaction via Direct Call (`tel:`), WhatsApp (`wa.me`), Email (`mailto:`), and Website (`http:`).
- **1-Click "Save to Contacts (vCard)"**: Generates standard RFC 6350 `.vcf` files that sync directly into iOS & Android address books.
- **Direct WhatsApp Share**: Enter any 10-digit mobile number to immediately send the digital card link via WhatsApp.
- **Mini E-Commerce Store**: Product showcase catalog with instant **"Order on WhatsApp"** button pre-filling item name and price in chat.
- **Dynamic UPI Payment QR**: Displays customizable Google Pay, PhonePe, Paytm QR codes and verified bank account transfer details.
- **YouTube Video Embed**: Embedded responsive video player for company introductions and promotional reels.
- **Lead Capture & Enquiries Form**: Contact inquiries stored directly in the database and accessible via customer dashboard.
- **Deactivated Card Safety Screen**: Shows branded "Card Deactivated / Activate Now" screen for expired subscriptions.

### 2. Customer Portal (`/panel`)
- Purple gradient customer authentication with email or mobile login.
- Card management table showing Card ID, Company Name, Payment Status, Card Status, Views count, and Creation Date.
- **Split-Screen Card Builder**: 6-step wizard (Company Details, Social Links, Payment Options, Products, Gallery, Theme Picker) with **live real-time smartphone sync**.

### 3. Franchisee Reseller Hub (`/franchisee`)
- Reseller wallet balance system with credit deduction per created card (₹150 wholesale rate per card).
- Client card management ledger and transaction activity log.

### 4. Super Admin Control Center (`/admin`)
- Central KPI analytics: Total Cards, Franchisee Cards, Customer Cards, Active/Inactive counts, Total Revenue summary.
- **Wallet Recharge System**: Instant credit balance allocation to any franchisee email address with audit remarks.
- Global system settings: Card retail pricing, franchisee wholesale rate, trial periods, and Razorpay API credentials.

---

## 🏗️ Architecture & Dual-Stack Design

```
                     ┌──────────────────────────────────────────────┐
                     │            User Browser / Client             │
                     └──────────────────────┬───────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
     [LOCAL DEVELOPMENT STACK]                     [CLOUDFLARE EDGE PRODUCTION]
  ┌───────────────────────────────┐               ┌───────────────────────────────┐
  │ Local Node.js Express Server  │               │ Cloudflare Pages (React SPA)  │
  │ (server.js on Port 5000)      │               │ (digicards-app.pages.dev)     │
  ├───────────────────────────────┤               ├───────────────────────────────┤
  │ Local SQLite (better-sqlite3) │               │ Cloudflare D1 Database        │
  │ (database.sqlite in WAL mode) │               │ (Serverless SQLite at Edge)   │
  ├───────────────────────────────┤               ├───────────────────────────────┤
  │ Local Filesystem Uploads      │               │ Cloudflare R2 Bucket          │
  │ (/uploads directory)          │               │ (digicards-uploads)           │
  └───────────────────────────────┘               └───────────────────────────────┘
```

---

## ⚡ Quick Start (Local Run)

### Option 1: Double-Click (Windows)
Double-click `run.bat` in the root folder.
This automatically checks dependencies, builds the frontend if needed, starts the unified server at `http://localhost:5000`, and opens your default browser.

### Option 2: Terminal Commands
```bash
# 1. Install dependencies
npm install

# 2. Build frontend production assets
npm run build

# 3. Start unified server on http://localhost:5000
npm start

# (Optional: Hot-reload development server)
npm run dev
```

---

## 🔑 Demo Credentials

Use the **Quick Demo Login** bar at the top of the navbar or log in manually:

| Role | Email / Phone | Password | Access & Capabilities |
|---|---|---|---|
| **Super Admin** | `admin@example.com` | `admin123` | System analytics, user accounts, franchisee credit recharge, global settings |
| **Franchisee** | `franchise@example.com` | `franchise123` | ₹5,000 preloaded wallet, wholesale card generation (₹150 deduction), client ledger |
| **Customer** | `user@example.com` | `user123` | Pre-loaded **"ABC MARKETING"** card, 100 themes, 6-step builder, lead viewing |

---

## ☁️ Cloudflare Free-Tier Deployment Guide

DigiCards is optimized to run **100% free** on Cloudflare:
- **Cloudflare Pages**: Unlimited bandwidth & requests globally.
- **Cloudflare D1**: 5,000,000 row reads / day & 100,000 writes / day (5 GB storage).
- **Cloudflare R2**: 10 GB storage / month with zero egress fees.

### One-Command Deployment via Wrangler CLI:

```bash
# 1. Log in to your Cloudflare account
npx wrangler login

# 2. Create the D1 Database
npx wrangler d1 create digicards-db
# Copy the database_id into wrangler.toml

# 3. Create tables and seed demo data
npx wrangler d1 execute digicards-db --file=./schema_tables.sql --remote
npx wrangler d1 execute digicards-db --file=./schema_seed.sql --remote

# 4. Create R2 bucket for uploads
npx wrangler r2 bucket create digicards-uploads

# 5. Build and deploy to Cloudflare Pages
npm run build
npx wrangler pages deploy dist --project-name=digicards-app
```

---

## 📁 Repository Structure

```
DigiCards/
├── functions/                     # Cloudflare Pages Functions (Edge API)
│   ├── api/
│   │   └── [[route]].js          # Universal Edge API router (Auth, Cards, CRM, Admin)
│   └── uploads/
│       └── [filename].js         # Cloudflare R2 media streaming handler
├── public/                       # Static public assets
│   └── assets/
│       ├── css/common.css        # Common utilities & theme overrides
│       └── img/demo/             # Sample logos, QR codes, products, gallery
├── src/                          # Frontend source code (React 19 + Vite)
│   ├── components/               # UI views and dashboards
│   │   ├── AdminDashboard.jsx    # Super Admin management console
│   │   ├── AuthModal.jsx         # Customer login & register modal
│   │   ├── CardBuilder.jsx       # 6-step live card builder studio
│   │   ├── CustomerDashboard.jsx # Client cards table & analytics overview
│   │   ├── FranchiseeDashboard.jsx # Reseller wallet hub & cards table
│   │   ├── LandingPage.jsx       # Public landing page with 3D phone showcase
│   │   ├── Navbar.jsx            # Sticky navigation with quick-demo login bar
│   │   ├── PaymentModal.jsx      # Checkout payment popup modal
│   │   └── PublicCardView.jsx    # Standalone public card view with phone bezel
│   ├── App.jsx                   # Root application orchestrator
│   ├── index.css                 # Tailwind CSS v4 styling rules
│   ├── main.jsx                  # React DOM entrypoint
│   └── themes.js                 # 100 Theme definitions, palettes & gradients
├── database.js                   # Local SQLite initialization and seeding (better-sqlite3)
├── server.js                     # Local Express 5 API server
├── schema.sql                    # Full SQL schema & seed script
├── schema_tables.sql             # Clean table creation statements (for D1)
├── schema_seed.sql               # Clean seed statements (for D1)
├── wrangler.toml                 # Cloudflare Pages, D1, and R2 bindings
├── tasks.md                      # Comprehensive Architectural Audit & Product Roadmap
├── DEPLOY_CLOUDFLARE.md          # Cloudflare deployment documentation
├── run.bat                       # 1-Click Windows development launcher
└── package.json                  # Dependencies and build scripts
```

---

## 📋 Comprehensive Audit & Future Roadmap

For an in-depth audit of the codebase, security recommendations (password hashing, signed JWT cookies, removing demo authentication), payment gateway integrations (Razorpay/Stripe webhooks), and planned features (Custom Domains, Progressive Web App, WhatsApp lead webhooks), see:

👉 **[tasks.md](./tasks.md)**

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).