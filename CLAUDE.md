# DigiCards - AI Agent & Developer Guidelines (`CLAUDE.md`)

This file provides system architecture instructions, build commands, and coding conventions for AI agents (Claude Code, Cursor, Copilot, Antigravity) working on the DigiCards repository.

---

## 🚀 Common Commands

### Local Development
- `npm start` — Run unified local Express server on `http://localhost:5000` (serves API and built client).
- `npm run dev` — Start Vite hot-reloading development server on `http://localhost:5173`.
- `npm run build` — Compile React 19 + Tailwind CSS frontend into production static files in `dist/`.
- `run.bat` — 1-click Windows launcher (installs dependencies, builds if needed, starts server, opens browser).

### Cloudflare Edge & Database Management
- `npx wrangler login` — Authenticate CLI with Cloudflare account.
- `npx wrangler d1 list` — List D1 serverless SQLite databases.
- `npx wrangler d1 execute digicards-db --command="<SQL>" --remote` — Execute SQL directly on the production D1 database.
- `npx wrangler d1 execute digicards-db --file=./schema_tables.sql --remote` — Apply table schema migrations to remote D1.
- `npx wrangler pages deploy dist --project-name=digicards-app` — Deploy built assets and Edge Functions directly to Cloudflare Pages.

---

## 🏗️ Architecture & Dual-Stack Parity

DigiCards uses a **dual-stack architecture**:
1. **Local Offline Environment**:
   - `server.js` — Node.js Express 5 API server.
   - `database.js` — Local SQLite via `better-sqlite3` (`database.sqlite` in WAL mode).
   - `uploads/` — Local filesystem media directory.
2. **Cloudflare Serverless Production (100% Free Tier)**:
   - **Frontend**: Cloudflare Pages (`https://digicards-app.pages.dev`).
   - **Edge API**: `functions/api/[[route]].js` (Cloudflare Pages Functions on V8 Isolates).
   - **Database**: Cloudflare D1 (`digicards-db`, ID: `9060c1b7-877c-4a08-a371-01bbf84292b3`, bound as `DB`).
   - **Storage**: Cloudflare R2 (`digicards-uploads`, bound as `UPLOADS`) with automatic Base64 fallback.

### ⚠️ Golden Rule for Agents: Dual-Stack Synchronization
Whenever adding or modifying API endpoints, you **MUST** update both:
1. `server.js` (for local development).
2. `functions/api/[[route]].js` (for Cloudflare Pages Functions).

---

## 📂 Repository Structure

```
DigiCards/
├── functions/                     # Cloudflare Pages Functions (Edge API)
│   ├── api/
│   │   └── [[route]].js          # Universal Edge API router (Auth, Cards, Admin, CRM)
│   └── uploads/
│       └── [filename].js         # Cloudflare R2 media streaming handler
├── public/                       # Static public assets
│   └── assets/
│       ├── css/common.css        # Common CSS & theme utility classes
│       └── img/demo/             # Sample logos, QR codes, product previews
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
├── AGENTS.md                     # Agent guide on Cloudflare architecture
├── tasks.md                      # Comprehensive Architectural Audit & Product Roadmap
├── DEPLOY_CLOUDFLARE.md          # Cloudflare deployment documentation
├── run.bat                       # 1-Click Windows development launcher
└── package.json                  # Dependencies and build scripts
```

---

## 💻 Code Style & Conventions

### Frontend (React 19)
- Use standard React 19 functional components with hooks (`useState`, `useEffect`, `useRef`).
- Styling: **Tailwind CSS v4** utility classes. Avoid arbitrary hardcoded style tags when a Tailwind utility exists.
- Icons: Always import from **`lucide-react`**.
- State & Routing:
  - Views are coordinated through `currentView` in `App.jsx` (Landing, Customer, Franchisee, Admin, Public Card).
  - Deep linking for public cards uses `/card/:slug`.

### Backend & Edge API
- **Strict Edge Constraints in `functions/`**:
  - **NO** Node.js native dependencies (`fs`, `path`, `better-sqlite3`, `multer`, etc.).
  - Always use Web Standards: `Request`, `Response`, `Headers`, `URL`, `FormData`, `crypto.subtle`.
  - Database access: `await context.env.DB.prepare(sql).bind(...params).all() / .first() / .run()`.
  - Storage access: `await context.env.UPLOADS.put(filename, stream)` and `context.env.UPLOADS.get(filename)`.
- **Database Parameterization**:
  - Never concatenate raw user input into SQL queries. Always use `?` placeholders.

---

## 🔑 Preloaded Test Accounts

| Role | Email / Identifier | Password | Access Details |
|---|---|---|---|
| **Super Admin** | `admin@example.com` | `admin123` | System analytics, wallet recharging, user management, global settings |
| **Franchisee** | `franchise@example.com` | `franchise123` | Reseller hub, ₹5,000 wallet, wholesale card creation (₹150 deduction) |
| **Customer** | `user@example.com` | `user123` | Pre-loaded **"ABC MARKETING"** card, 100 themes, 6-step builder |

---

## 📌 Important Reference Files
- **[`tasks.md`](./tasks.md)**: Master architectural audit and prioritized task roadmap (security hardening, password hashing, real payment webhooks, PWA).
- **[`AGENTS.md`](./AGENTS.md)**: Cloudflare infrastructure guide and capacity analysis.
- **[`DEPLOY_CLOUDFLARE.md`](./DEPLOY_CLOUDFLARE.md)**: Step-by-step Cloudflare deployment documentation.