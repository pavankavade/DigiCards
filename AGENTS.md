# DigiCards: Agent & Developer Guidelines (`AGENTS.md`)

This document provides autonomous coding agents, AI assistants, and developers with a clear understanding of the **DigiCards** codebase, its dual-stack hosting architecture on Cloudflare, and guidelines for maintaining and extending the platform.

---

## 📌 Project Overview
- **Repository**: [https://github.com/pavankavade/DigiCards](https://github.com/pavankavade/DigiCards)
- **Live Production URL**: [https://digicards-app.pages.dev](https://digicards-app.pages.dev)
- **Live Demo Visiting Card**: [https://digicards-app.pages.dev/card/ABC-Marketing](https://digicards-app.pages.dev/card/ABC-Marketing)
- **Tech Stack**:
  - **Frontend**: React 19, Tailwind CSS v4, Lucide React, Vite.
  - **Edge Backend**: Cloudflare Pages Functions (V8 Isolates).
  - **Local Backend**: Node.js Express 5.
  - **Database**: Cloudflare D1 (Edge Serverless SQLite) / `better-sqlite3` (Local SQLite).
  - **Media Storage**: Cloudflare R2 (`digicards-uploads`) with Base64 fallback.

---

## ☁️ How the App is Hosted on Cloudflare

DigiCards runs **100% serverless on Cloudflare's Free Tier** with zero server maintenance, no cold starts, and zero egress fees.

```
                            [ USER REQUEST ]
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │ Cloudflare Edge (CDN) │
                       └───────────┬───────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
    [ Static Assets: HTML/CSS/JS ]            [ API Requests: /api/* ]
          Cloudflare Pages                   Cloudflare Pages Functions
     (React 19 Frontend in dist/)            (V8 Edge API in functions/)
                                                        │
                                     ┌──────────────────┴──────────────────┐
                                     ▼                                     ▼
                           Cloudflare D1 (Database)              Cloudflare R2 (Storage)
                         Serverless SQLite at the Edge            Object Storage for Uploads
                          (Users, Cards, Enquiries)                (Logos, Photos, QR codes)
```

### 1. Cloudflare Pages (Frontend)
- **Project Name**: `digicards-app`
- **Canonical Domain**: `https://digicards-app.pages.dev`
- **Build Output**: `dist/` (generated via `npm run build`).
- **CI/CD Integration**: Connected to GitHub repository `pavankavade/DigiCards` on branch `main`. Any push to `main` triggers automated build and deployment.

### 2. Cloudflare Pages Functions (Edge API)
- **Location**: `functions/api/[[route]].js` and `functions/uploads/[filename].js`.
- **Runtime**: Cloudflare Workers V8 isolates (~0ms cold starts, global distribution).
- **Functionality**:
  - Intercepts all `/api/*` routes (Auth, Cards CRUD, Products, Gallery, Enquiries, Admin, Franchisee).
  - Handles `/api/cards/public/:slug/vcard` generating RFC 6350 `.vcf` files on the fly.
  - Serves uploaded media from R2 at `/uploads/:filename` with long-term edge caching headers (`Cache-Control: public, max-age=31536000, immutable`).

### 3. Cloudflare D1 (Serverless SQLite Database)
- **Database Name**: `digicards-db`
- **Database ID**: `9060c1b7-877c-4a08-a371-01bbf84292b3`
- **Binding in Pages**: `DB` (accessed inside functions via `context.env.DB`).
- **Schema & Migrations**:
  - `schema_tables.sql`: Clean `CREATE TABLE IF NOT EXISTS` for all 7 tables (`users`, `cards`, `products`, `gallery`, `enquiries`, `wallet_transactions`, `settings`).
  - `schema_seed.sql`: Initial seed data (default Admin, Franchisee, Customer, and the ABC Marketing demo card).
  - Schema can be queried or updated remotely via:
    ```bash
    npx wrangler d1 execute digicards-db --command="SELECT COUNT(*) FROM cards;" --remote
    ```

### 4. Cloudflare R2 (Media Storage)
- **Bucket Name**: `digicards-uploads`
- **Binding in Pages**: `UPLOADS` (accessed inside functions via `context.env.UPLOADS`).
- **Zero Egress Fees**: Unlike AWS S3, Cloudflare R2 charges $0 for download bandwidth, allowing unlimited visitor card scans.
- **Resilient Fallback**: If R2 is unbound or unavailable, `/api/upload` automatically converts images to Base64 data URLs so uploads never fail.

---

## 💻 Local Development Architecture

To ensure full offline usability, the repository maintains an identical local environment:
- **Server**: `server.js` (Express 5 listening on `http://localhost:5000`).
- **Database**: `database.js` using `better-sqlite3` (`database.sqlite` in WAL mode).
- **Uploads**: Local `uploads/` folder.
- **Windows Launcher**: `run.bat` (automatically installs missing dependencies, builds the frontend if `dist/` is missing, starts the server, and opens the browser).

---

## 🛡️ Critical Rules for AI Agents & Contributors

When editing or extending DigiCards, follow these rules:

### Rule 1: Maintain Dual-Stack API Parity
Whenever you add, modify, or remove an API endpoint:
1. Update the local Express router in `server.js`.
2. Update the Cloudflare Pages Functions router in `functions/api/[[route]].js`.
*Both implementations must remain functionally identical.*

### Rule 2: Keep SQL Queries SQLite-Compatible
Both `better-sqlite3` (local) and Cloudflare D1 (production) use standard SQLite syntax.
- Use parameterized queries with `?` placeholders.
- Do not use database-specific extensions not supported by SQLite.
- Remember: D1 queries return `{ results: [...] }` from `.all()`, and single rows from `.first()`.

### Rule 3: Zero Node.js Native Addons in `functions/`
Cloudflare Pages Functions execute on V8 isolates, **not Node.js**.
- **DO NOT** import `fs`, `path`, `better-sqlite3`, `multer`, or any native C++ modules in files inside `functions/`.
- Use Web Standard APIs (`Request`, `Response`, `Headers`, `URL`, `FormData`, `crypto.subtle`).
- Access database via `env.DB` and storage via `env.UPLOADS`.

### Rule 4: Preserve Cloudflare Bindings in `wrangler.toml`
`wrangler.toml` must always maintain the active project configuration:
```toml
name = "digicards-app"
pages_build_output_dir = "dist"

[[d1_databases]]
binding = "DB"
database_name = "digicards-db"
database_id = "9060c1b7-877c-4a08-a371-01bbf84292b3"

[[r2_buckets]]
binding = "UPLOADS"
bucket_name = "digicards-uploads"
```

---

## 🛠️ Essential Commands

### Development
```bash
# Start local Node.js Express server on port 5000
npm start

# Run Vite with hot-reload
npm run dev

# Build frontend production bundle into dist/
npm run build
```

### Cloudflare Management (via Wrangler)
```bash
# Verify authentication
npx wrangler whoami

# Query remote D1 database
npx wrangler d1 execute digicards-db --command="SELECT id, email, role FROM users;" --remote

# Deploy directly to Cloudflare Pages
npm run build
npx wrangler pages deploy dist --project-name=digicards-app
```

---

## 🔑 Preloaded Test Accounts

| Role | Email / Identifier | Password | Access Details |
|---|---|---|---|
| **Super Admin** | `admin@example.com` | `admin123` | System analytics, wallet recharging, user management, global settings |
| **Franchisee** | `franchise@example.com` | `franchise123` | Reseller hub, ₹5,000 wallet, client card creation (₹150/card fee) |
| **Customer** | `user@example.com` | `user123` | Pre-loaded **"ABC MARKETING"** card, 100 themes, 6-step builder |

---

## 📋 Product Roadmap & Security Tasks

For an in-depth audit of planned improvements (including password hashing via Web Crypto API, cryptographically signed JWT cookies, `react-router-dom` migration, Razorpay webhook integration, and PWA support), consult:

👉 **[tasks.md](./tasks.md)**