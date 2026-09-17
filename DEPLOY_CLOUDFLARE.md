# Deploying DigiCards on Cloudflare (100% Free Tier)

This guide walks you through deploying **DigiCards** to **Cloudflare Pages**, **Cloudflare D1 (Serverless SQLite)**, and **Cloudflare R2** on the generous free tier.

---

## ⚡ Quick Prerequisites
- A free [Cloudflare Account](https://dash.cloudflare.com/sign-up).
- The repository pushed to your GitHub account: [https://github.com/pavankavade/DigiCards](https://github.com/pavankavade/DigiCards).

---

## 🛠️ Method 1: Using Cloudflare Dashboard (Recommended)

### Step 1: Create the Cloudflare D1 SQLite Database
1. Open the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Storage & Databases** > **D1 SQL Database**.
3. Click **Create database** > Name it `digicards-db` > Click **Create**.
4. Inside your new database, go to the **Console** tab.
5. Open the `schema.sql` file from your DigiCards repository, copy its entire contents, paste it into the D1 console, and click **Execute**.
   *(This creates all tables and seeds the demo Admin, Franchisee, Customer, and ABC Marketing card!)*

---

### Step 2: Create the Cloudflare R2 Uploads Bucket
1. In the left navigation, click **Storage & Databases** > **R2 Object Storage**.
2. Click **Create bucket** > Name it `digicards-uploads` > Click **Create bucket**.
   *(Note: Uploads will automatically fall back to Base64 data URLs if you skip this step).*

---

### Step 3: Deploy Frontend & APIs on Cloudflare Pages
1. In the left navigation, go to **Compute (Workers)** > **Workers & Pages** > **Create application** > **Pages** tab.
2. Click **Connect to Git** and select `pavankavade/DigiCards`.
3. Configure the build settings:
   - **Project name**: `digicards`
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**. Cloudflare will build the React app.

---

### Step 4: Bind D1 Database and R2 Bucket to Pages
Once the initial deployment completes:
1. Go to your Pages project in the dashboard > **Settings** > **Functions**.
2. Scroll down to **D1 Database Bindings**:
   - Click **Add binding**.
   - **Variable name**: `DB` *(must be uppercase `DB`)*.
   - **D1 Database**: Select `digicards-db`.
   - Click **Save**.
3. Scroll down to **R2 Bucket Bindings**:
   - Click **Add binding**.
   - **Variable name**: `UPLOADS` *(must be uppercase `UPLOADS`)*.
   - **R2 Bucket**: Select `digicards-uploads`.
   - Click **Save**.
4. Go to the **Deployments** tab > Click the `...` menu on your latest deployment > **Retry deployment** (so the new bindings take effect).

---

## 💻 Method 2: Using Wrangler CLI (Fastest via Terminal)

If you prefer terminal commands:

```bash
# 1. Install Wrangler and authenticate
npm install -g wrangler
wrangler login

# 2. Create the D1 Database
wrangler d1 create digicards-db
# Copy the database_id from the terminal output and paste it into wrangler.toml

# 3. Seed D1 with schema and demo data
wrangler d1 execute digicards-db --file=./schema.sql --remote

# 4. Create R2 bucket for uploads
wrangler r2 bucket create digicards-uploads

# 5. Build and deploy to Cloudflare Pages
npm run build
wrangler pages deploy dist --project-name=digicards
```

---

## 🔑 Default Logins on Cloudflare
Once deployed, you can access your public URL (e.g. `https://digicards.pages.dev`):

| Role | Email / Phone | Password |
|---|---|---|
| **Super Admin** | `admin@example.com` | `admin123` |
| **Franchisee** | `franchise@example.com` | `franchise123` |
| **Customer** | `user@example.com` | `user123` |
| **Demo Card** | `https://<your-project>.pages.dev/card/ABC-Marketing` | — |

---

## 🌐 Custom Domain Setup
In your Cloudflare Pages dashboard:
1. Go to **Custom domains** tab.
2. Click **Set up a custom domain** (e.g. `cards.yourdomain.com`).
3. Cloudflare automatically sets up DNS and provisions a free SSL certificate.