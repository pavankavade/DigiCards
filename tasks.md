# DigiCards: Architectural Audit & Product Roadmap (`tasks.md`)

This document provides a comprehensive technical audit of the **DigiCards** codebase, analyzes its current architectural strengths and bottlenecks, and lays out a descriptive, prioritized task list to transition the platform from a local demo prototype into a scalable, secure, multi-tenant commercial SaaS.

---

## 🔍 Section 1: Comprehensive Codebase Audit

### 1.1 Frontend Architecture & Component Structure
- **Current State**:
  - The UI is built with React 19 and Tailwind CSS v4.
  - State management is primarily localized using React `useState` and extensive prop drilling (e.g. passing user, view, modal handlers through `Navbar` and dashboards).
  - Navigation is handled through manual condition matching in `App.jsx` (`currentView === 'landing'`, etc.) rather than a declarative client-side router (`react-router-dom` or `@tanstack/react-router`). This prevents native browser history navigation (back/forward buttons), direct bookmarkable URLs for admin/franchisee views, and SEO optimization.
  - Large monolithic components: `CardBuilder.jsx` (~38 KB), `PublicCardView.jsx` (~30 KB), and `AdminDashboard.jsx` (~25 KB) contain UI layout, local state, form validations, preview simulations, and API fetch calls all in one file.
  - API calls are executed directly with `fetch` inline inside `useEffect` and event handlers, with duplicated header setup and error handling.
  - Hardcoded legacy branding (`DesiCard`) remains in some components (`Navbar.jsx`, `LandingPage.jsx`).

### 1.2 Backend & Edge Function Architecture
- **Current State**:
  - Dual implementation: `server.js` (Express 5 for local Node.js) and `functions/api/[[route]].js` (Cloudflare Pages Functions for edge execution).
  - While having both enables easy offline local testing and zero-cost edge deployment, business logic is duplicated between Express and Cloudflare Functions. Changes made to one must be manually mirrored to the other.
  - Lack of schema validation on request payloads (e.g., using `zod` or `valibot`). Incoming inputs are parsed with basic `if (!field)` checks.

### 1.3 Database, Data Modeling & Performance
- **Current State**:
  - Uses SQLite locally (`database.sqlite`) and Cloudflare D1 remotely (`digicards-db`).
  - Passwords are currently stored as **plaintext** (`password TEXT NOT NULL`).
  - No database indexes defined on high-traffic lookup columns: `cards(slug)`, `cards(user_id)`, `products(card_id)`, `gallery(card_id)`, `enquiries(card_id)`.
  - Lack of a migration runner or typed ORM (such as Drizzle ORM for D1/SQLite).

### 1.4 Security & Authentication Audit
- **Current State**:
  - Session validation relies on an unencrypted, unsigned `user_id` cookie (`res.cookie('user_id', user.id)`). Any user can tamper with this cookie in developer tools to impersonate any user ID (including ID 1 - Super Admin).
  - The "Quick Demo Login" bar in `Navbar.jsx` allows anyone to log into Super Admin or Franchisee with a single click.
  - No rate limiting on authentication (`/api/auth/login`, `/api/auth/register`) or lead enquiry submissions (`/api/cards/:slug/enquiries`).
  - CORS currently allows all origins (`*`) and credentials.

### 1.5 Commercial Readiness & Monetization
- **Current State**:
  - Payments use mock simulation (`/api/pay/simulate`) without verification against real payment gateways (Razorpay, Stripe, PhonePe, Cashfree).
  - No automated subscription expiry calculation or renewal notification engine.
  - Franchisee wallet recharges are manual via Admin input, rather than automated online payments.

---

## 📋 Section 2: Prioritized Product Tasks

### Phase 1: Base Architectural Refactoring & Foundation

#### [ ] Task 1.1: Implement Declarative Client-Side Routing (`react-router-dom`)
- **Priority**: High | **Component**: Frontend Architecture
- **Rationale**: Enable real URLs, browser back/forward history, deep linking, and protected route wrappers.
- **Scope**:
  - Install and configure `react-router-dom` v7.
  - Create dedicated routes:
    - `/` ➔ Landing Page
    - `/card/:slug` ➔ Public Digital Visiting Card
    - `/login`, `/register` ➔ Authentication Views
    - `/panel` ➔ Customer Dashboard
    - `/panel/builder/:id?` ➔ Card Builder Studio
    - `/franchisee` ➔ Franchisee Reseller Hub
    - `/admin` ➔ Super Admin Control Center
  - Add `<ProtectedRoute allowedRoles={['customer', 'franchisee', 'admin']} />` wrapper.
- **Acceptance Criteria**: Navigating with browser back/forward buttons works smoothly without resetting state; direct links to `/admin` redirect unauthenticated visitors to `/login`.

#### [ ] Task 1.2: Centralize API Client & Service Layer
- **Priority**: High | **Component**: Frontend / Networking
- **Rationale**: Eliminate scattered `fetch()` calls and duplicate authorization headers.
- **Scope**:
  - Create `src/services/api.js` with unified request methods (`get`, `post`, `put`, `del`).
  - Implement automatic credentials handling, error interceptors, and user-friendly toast notifications.
  - Create resource services: `authService`, `cardService`, `franchiseService`, `adminService`.
- **Acceptance Criteria**: All components consume services instead of raw fetch calls; network errors trigger unified toast alerts.

#### [ ] Task 1.3: Modularize Complex Monolithic Components
- **Priority**: Medium | **Component**: Frontend Architecture
- **Rationale**: `CardBuilder.jsx` is 38KB and difficult to maintain.
- **Scope**:
  - Decompose `CardBuilder.jsx` into standalone step components:
    - `src/components/builder/CompanyDetailsStep.jsx`
    - `src/components/builder/SocialLinksStep.jsx`
    - `src/components/builder/PaymentSettingsStep.jsx`
    - `src/components/builder/ProductsCatalogStep.jsx`
    - `src/components/builder/ImageGalleryStep.jsx`
    - `src/components/builder/ThemeSelectorStep.jsx`
  - Extract the live smartphone preview into `src/components/common/PhoneMockupPreview.jsx`.
- **Acceptance Criteria**: Each step is isolated with its own form validation; `CardBuilder.jsx` acts purely as an orchestrator under 200 lines of code.

#### [ ] Task 1.4: Unify Branding & UI Consistency
- **Priority**: Medium | **Component**: Frontend / UI
- **Rationale**: Remove residual "DesiCard" strings and align 100% on "DigiCards".
- **Scope**:
  - Update `Navbar.jsx`, `LandingPage.jsx`, `index.html`, and `README.md` to consistently display **DigiCards**.
  - Standardize SVG icons, theme categories, and footer copyright notices.
- **Acceptance Criteria**: Zero references to "DesiCard" in UI or page titles.

---

### Phase 2: Production Readiness, Security & Real Users

#### [ ] Task 2.1: Implement Cryptographic Password Hashing
- **Priority**: Critical | **Component**: Backend / Security
- **Rationale**: Plaintext passwords are a critical security vulnerability.
- **Scope**:
  - Implement PBKDF2 / SHA-256 via the Web Crypto API (`crypto.subtle`) so that the exact same hashing code runs identically in Node.js and Cloudflare Edge Workers without native C++ dependencies.
  - Add salt generation and hash verification during login and registration.
  - Create a migration script to hash existing demo accounts.
- **Acceptance Criteria**: Passwords stored in D1 / SQLite are secure salted hashes; plaintext passwords never appear in the database.

#### [ ] Task 2.2: Cryptographically Signed Session Tokens / JWTs
- **Priority**: Critical | **Component**: Backend / Security
- **Rationale**: Raw `user_id` cookie allows trivial account takeover.
- **Scope**:
  - Implement lightweight JWT or HMAC-SHA256 token generation and verification using Web Crypto API.
  - Sign tokens with `JWT_SECRET` environment variable (configured in `wrangler.toml` and `.env`).
  - Store tokens in `HttpOnly; Secure; SameSite=Lax` cookies.
- **Acceptance Criteria**: Tampering with the session cookie causes immediate authentication rejection; role and user ID cannot be forged.

#### [ ] Task 2.3: Environment-Aware Demo Mode Toggle
- **Priority**: High | **Component**: Frontend / Security
- **Rationale**: The Quick Demo Login bar should not appear in production for real users.
- **Scope**:
  - Add `VITE_ENABLE_DEMO_BAR=false` configuration.
  - Conditionally render the top demo toolbar only when running locally or on a staging environment.
  - Provide standard `/login` and `/register` pages with error feedback.
- **Acceptance Criteria**: Production deployment at `digicards-app.pages.dev` displays a clean professional navbar without the demo login bar when toggled off.

#### [ ] Task 2.4: Database Optimization & D1 Indexes
- **Priority**: High | **Component**: Database / Performance
- **Rationale**: Ensure sub-millisecond query responses on Cloudflare D1 under heavy traffic.
- **Scope**:
  - Add indexes:
    ```sql
    CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);
    CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
    CREATE INDEX IF NOT EXISTS idx_products_card_id ON products(card_id);
    CREATE INDEX IF NOT EXISTS idx_gallery_card_id ON gallery(card_id);
    CREATE INDEX IF NOT EXISTS idx_enquiries_card_id ON enquiries(card_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    ```
  - Apply migrations to remote D1.
- **Acceptance Criteria**: Queries on card slugs and user dashboards execute using index scans with minimum row read counts on D1.

#### [ ] Task 2.5: Email Verification & Password Reset
- **Priority**: Medium | **Component**: Backend / Auth
- **Rationale**: Prevent spam account creation and allow real users to recover accounts.
- **Scope**:
  - Integrate Cloudflare Email Routing or Resend API for transactional emails.
  - Generate 6-digit verification OTP or secure time-limited token.
  - Implement `/api/auth/forgot-password` and `/api/auth/reset-password`.
- **Acceptance Criteria**: Users receive an email with reset instructions and can securely update forgotten passwords.

---

### Phase 3: Commercial Monetization & Real Payment Gateways

#### [ ] Task 3.1: Live Payment Gateway Integration (Razorpay / Stripe)
- **Priority**: High | **Component**: Billing / Payments
- **Rationale**: Replace `/api/pay/simulate` with real automated payment collection.
- **Scope**:
  - Create `/api/pay/create-order` returning Razorpay / Stripe Order ID.
  - Implement client-side checkout popup modal using standard checkout SDK.
  - Implement webhook endpoint `/api/pay/webhook` with cryptographic signature verification (HMAC SHA-256) to confirm payments asynchronously.
  - Automatically update `payment_status = 'paid'`, `status = 'active'`, and set `valid_until = CURRENT_TIMESTAMP + 1 YEAR`.
- **Acceptance Criteria**: Real test and live transactions process successfully; card activates instantly upon verified webhook confirmation.

#### [ ] Task 3.2: Automated Subscription Expiry & Renewal Engine
- **Priority**: Medium | **Component**: Billing / Subscriptions
- **Rationale**: Transition cards from one-time creation to recurring annual SaaS subscriptions.
- **Scope**:
  - Add `valid_until DATETIME` and `auto_renew BOOLEAN` to `cards` table.
  - Create a Cloudflare Cron Trigger (Scheduled Worker) running daily to mark expired cards as `payment_status = 'expired'`.
  - Send email/WhatsApp reminder alerts at 30 days, 7 days, and 1 day before expiration.
- **Acceptance Criteria**: Expired cards automatically display an "Activate / Renew Now" screen; renewals extend validity by 365 days.

#### [ ] Task 3.3: Franchisee Online Wallet Recharge
- **Priority**: Medium | **Component**: Franchisee / Billing
- **Rationale**: Enable franchisees to self-recharge wallet balance 24/7 without manual Admin intervention.
- **Scope**:
  - Add "Recharge Wallet" payment button inside `FranchiseeDashboard.jsx`.
  - On payment success, automatically credit `users.wallet_balance` and append entry to `wallet_transactions`.
- **Acceptance Criteria**: Franchisee balance increments instantly upon payment completion.

---

### Phase 4: Advanced Features & Product Market Fit

#### [ ] Task 4.1: Custom Domain Mapping for Digital Cards
- **Priority**: High | **Component**: Edge / Infrastructure
- **Rationale**: Allow premium users and enterprises to use their own domains (e.g. `card.johnsmith.com` or `card.brandname.in`).
- **Scope**:
  - Leverage Cloudflare for SaaS (Custom Hostnames) API.
  - Provide instructions in customer panel for setting up a CNAME record.
  - Dynamic host routing in `functions/api/[[route]].js` to resolve card by custom domain.
- **Acceptance Criteria**: Visiting `card.clientdomain.com` directly renders the user's digital visiting card with automated SSL.

#### [ ] Task 4.2: Real-time Analytics & Click Tracking
- **Priority**: Medium | **Component**: Analytics / Reporting
- **Rationale**: Show card owners actionable ROI metrics (who clicked Call, WhatsApp, Email, or Saved vCard).
- **Scope**:
  - Create `card_analytics` table (`card_id`, `event_type`, `visitor_country`, `device_type`, `created_at`).
  - Track events: `view`, `click_call`, `click_whatsapp`, `click_vcard`, `click_payment_qr`.
  - Render interactive analytics charts (views over time, conversion rate) in `CustomerDashboard.jsx`.
- **Acceptance Criteria**: Dashboard displays daily views and click breakdown per communication channel.

#### [ ] Task 4.3: Progressive Web App (PWA) & Offline Contact Card
- **Priority**: Medium | **Component**: Mobile / Frontend
- **Rationale**: Enable recipients to "Add to Home Screen" so the visiting card behaves like an app icon on Android & iOS.
- **Scope**:
  - Add `manifest.webmanifest` and Service Worker (`sw.js`).
  - Cache core visiting card data and theme assets for offline viewing.
  - Display "Install App" button on mobile browsers.
- **Acceptance Criteria**: Users can install visiting cards to mobile home screens; cards load even when the phone is in Airplane Mode.

#### [ ] Task 4.4: Dynamic QR Code Studio
- **Priority**: Low | **Component**: Visual / Branding
- **Rationale**: Allow business owners to download high-resolution QR codes with custom branding for print materials, brochures, and NFC cards.
- **Scope**:
  - Custom color pickers for QR code background and foreground.
  - Embedded logo upload in the center of the QR code.
  - Export options: PNG (high-res), SVG (vector), and printable PDF with "Scan to Connect" frames.
- **Acceptance Criteria**: Generated QR codes scan reliably while displaying custom brand colors and embedded logos.

#### [ ] Task 4.5: WhatsApp Lead Notification Webhook
- **Priority**: Medium | **Component**: Integrations / Leads
- **Rationale**: Instant lead alerts when a prospective customer fills out the enquiry form on a card.
- **Scope**:
  - Integrate WhatsApp Cloud API or webhook service.
  - Trigger instant WhatsApp alert to the card owner's phone when an enquiry is submitted.
- **Acceptance Criteria**: Card owner receives a WhatsApp notification with the lead's name, phone, and message within seconds.

---

### Phase 5: Automated Testing, CI/CD & Observability

#### [ ] Task 5.1: Unit & API Integration Test Suite (Vitest)
- **Priority**: Medium | **Component**: Quality Assurance
- **Rationale**: Catch regressions before deploying to Cloudflare.
- **Scope**:
  - Set up Vitest with Miniflare / `@cloudflare/workers-types` for local edge simulation.
  - Test authentication hashing, vCard RFC-6350 generation, and wallet deduction logic.
- **Acceptance Criteria**: `npm run test` executes all unit and API tests with 100% pass rate.

#### [ ] Task 5.2: End-to-End Automated Testing (Playwright)
- **Priority**: Medium | **Component**: Quality Assurance
- **Rationale**: Ensure full multi-user workflows (Admin, Franchisee, Customer, Public card) work flawlessly.
- **Scope**:
  - Expand `verify_app.py` into a full Playwright test suite.
  - Test:
    1. Public card rendering & vCard download.
    2. Customer registration & card creation.
    3. Franchisee balance deduction.
    4. Admin user and settings management.
- **Acceptance Criteria**: Playwright tests run automatically in headless mode and capture visual snapshots.

#### [ ] Task 5.3: GitHub Actions CI/CD Pipeline
- **Priority**: Medium | **Component**: DevOps / Automation
- **Rationale**: Automate linting, testing, building, and deployment upon every `git push`.
- **Scope**:
  - Create `.github/workflows/deploy.yml`.
  - Run linting, testing, and `npm run build`.
  - Deploy to Cloudflare Pages using `cloudflare/pages-action` using repository secrets.
- **Acceptance Criteria**: Pushing to `main` branch automatically triggers CI tests and updates `https://digicards-app.pages.dev`.