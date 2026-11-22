// Cloudflare Pages Functions - Full API Router for DigiCards
// Complete feature parity with server.js (Franchise Ecosystem, Customer Mapping, Self-Service, Auto-Migration)

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith(name + '=')) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return null;
}

function generateCustomerCode() {
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  const hex = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `CUST-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

function generateFranchiseCode(name = '') {
  const clean = (name || 'FRAN').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'PART';
  const arr = new Uint8Array(2);
  crypto.getRandomValues(arr);
  const hex = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `FRAN-${clean}-${hex}`;
}

function generateFranchisePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Auto-migrate schema on Cloudflare D1 so new columns and default seeds are always intact
let schemaMigrated = false;
async function ensureSchema(db) {
  if (schemaMigrated) return;
  try {
    await db.prepare("ALTER TABLE users ADD COLUMN franchise_id INTEGER").run().catch(() => {});
    await db.prepare("ALTER TABLE users ADD COLUMN customer_code TEXT").run().catch(() => {});
    await db.prepare("ALTER TABLE users ADD COLUMN franchise_code TEXT").run().catch(() => {});
    await db.prepare("ALTER TABLE users ADD COLUMN franchise_pin TEXT").run().catch(() => {});
    await db.prepare("ALTER TABLE users ADD COLUMN approval_status TEXT DEFAULT 'approved'").run().catch(() => {});
    await db.prepare("ALTER TABLE users ADD COLUMN card_quota INTEGER DEFAULT 50").run().catch(() => {});
    await db.prepare("ALTER TABLE cards ADD COLUMN is_self_service INTEGER DEFAULT 0").run().catch(() => {});
    await db.prepare("ALTER TABLE cards ADD COLUMN created_by_user_id INTEGER").run().catch(() => {});
    await db.prepare("ALTER TABLE cards ADD COLUMN layout_template TEXT DEFAULT 'executive'").run().catch(() => {});

    // Ensure demo franchise credentials exist
    await db.prepare(`
      UPDATE users 
      SET franchise_code = COALESCE(franchise_code, 'FRAN-PUNE-8910'),
          franchise_pin = COALESCE(franchise_pin, '8910'),
          approval_status = COALESCE(approval_status, 'approved'),
          card_quota = COALESCE(card_quota, 50)
      WHERE role = 'franchisee' AND (franchise_code IS NULL OR franchise_pin IS NULL)
    `).run().catch(() => {});

    // Ensure demo customer code exists
    await db.prepare(`
      UPDATE users 
      SET customer_code = COALESCE(customer_code, 'CUST-ALEX-7712'),
          approval_status = COALESCE(approval_status, 'approved')
      WHERE role = 'customer' AND customer_code IS NULL
    `).run().catch(() => {});

    schemaMigrated = true;
  } catch (e) {
    // schema already up to date
  }
}

async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  const userId = getCookie(request, 'user_id') || (authHeader && authHeader.replace('Bearer ', ''));
  if (!userId) return null;

  const user = await env.DB.prepare(`
    SELECT id, role, name, email, phone, wallet_balance, card_quota, status,
           customer_code, franchise_code, franchise_pin, franchise_id, approval_status
    FROM users WHERE id = ?
  `).bind(userId).first();

  if (!user || user.status !== 'active') return null;
  if (user.approval_status === 'pending') return null;
  return user;
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();
  const route = params.route || []; // array of path segments after /api/
  const pathStr = route.join('/');

  if (!env.DB) {
    return json({ error: 'Cloudflare D1 Database binding "DB" is not configured.' }, 500);
  }

  // Ensure database schema has all columns needed
  await ensureSchema(env.DB);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  try {
    // ==========================================
    // 1. AUTH ROUTES
    // ==========================================
    if (pathStr === 'auth/login' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const { identifier, password, role } = body;
      if (!identifier || !password) return json({ error: 'Identifier and password required' }, 400);

      let query = 'SELECT * FROM users WHERE (email = ? OR phone = ? OR customer_code = ? OR franchise_code = ?) AND password = ?';
      const bindParams = [identifier, identifier, identifier, identifier, password];
      if (role) {
        query += ' AND role = ?';
        bindParams.push(role);
      }

      const user = await env.DB.prepare(query).bind(...bindParams).first();
      if (!user) return json({ error: 'Invalid login credentials or wrong portal selected' }, 401);
      if (user.status !== 'active') return json({ error: 'Account has been deactivated. Please contact support.' }, 403);

      if (user.role === 'franchisee' && user.approval_status === 'pending') {
        return json({
          error: 'Your Franchise Partner application is pending review by Super Admin. You will be able to log in once approved.'
        }, 403);
      }

      const { password: _, ...userData } = user;
      const headers = new Headers();
      headers.set('Set-Cookie', `user_id=${user.id}; Path=/; Max-Age=86400; SameSite=Lax; Secure`);
      return json({ message: 'Login successful', user: userData }, 200, Object.fromEntries(headers));
    }

    if (pathStr === 'auth/register' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const { 
        name, email, phone, password, role = 'customer',
        franchise_code, franchise_pin, agency_name
      } = body;

      if (!name || !email || !password) return json({ error: 'Name, email, and password are required' }, 400);

      // Strictly block public Admin registration (Single Tenant Super Admin)
      if (role === 'admin') {
        return json({ error: 'Admin registration is disabled. Super Admin is single-tenant and pre-configured.' }, 403);
      }

      // 1. Franchise Partner Registration (Requires Super Admin Approval)
      if (role === 'franchisee') {
        try {
          const fCode = generateFranchiseCode(agency_name || name);
          const fPin = generateFranchisePin();

          await env.DB.prepare(`
            INSERT INTO users (
              role, name, email, phone, password, wallet_balance, card_quota, 
              status, approval_status, franchise_code, franchise_pin
            )
            VALUES ('franchisee', ?, ?, ?, ?, 0, 0, 'active', 'pending', ?, ?)
          `).bind(
            name + (agency_name ? ` (${agency_name})` : ''),
            email.trim().toLowerCase(),
            phone || '',
            password,
            fCode,
            fPin
          ).run();

          return json({
            message: 'Franchise Partner application submitted! Super Admin has received your request and will review & approve your account.',
            status: 'pending',
            franchise_code: fCode
          });
        } catch (err) {
          if (err.message && err.message.includes('UNIQUE')) return json({ error: 'This email is already registered.' }, 400);
          return json({ error: err.message }, 500);
        }
      }

      // 2. Customer Registration
      try {
        let targetFranchiseId = null;

        if (franchise_code && franchise_code.trim()) {
          const cleanCode = franchise_code.trim().toUpperCase();
          const franchise = await env.DB.prepare(`
            SELECT id, name, franchise_pin, approval_status 
            FROM users 
            WHERE role = 'franchisee' AND franchise_code = ? COLLATE NOCASE
          `).bind(cleanCode).first();

          if (!franchise || franchise.approval_status !== 'approved') {
            return json({ error: `Invalid or unapproved Franchise Code "${franchise_code}". Please verify with your Franchise Partner.` }, 400);
          }

          if (franchise_pin && franchise.franchise_pin && franchise.franchise_pin !== franchise_pin.trim()) {
            return json({ error: 'Invalid Franchise Security PIN. Please contact your partner.' }, 400);
          }

          targetFranchiseId = franchise.id;
        }

        const cCode = generateCustomerCode();

        const info = await env.DB.prepare(`
          INSERT INTO users (
            role, name, email, phone, password, wallet_balance, card_quota, 
            status, approval_status, franchise_id, customer_code
          )
          VALUES ('customer', ?, ?, ?, ?, 0, 0, 'active', 'approved', ?, ?)
        `).bind(
          name,
          email.trim().toLowerCase(),
          phone || '',
          password,
          targetFranchiseId,
          cCode
        ).run();

        const user = await env.DB.prepare(`
          SELECT id, role, name, email, phone, wallet_balance, card_quota, customer_code, franchise_id, approval_status 
          FROM users WHERE id = ?
        `).bind(info.meta.last_row_id).first();

        const headers = new Headers();
        headers.set('Set-Cookie', `user_id=${user.id}; Path=/; Max-Age=86400; SameSite=Lax; Secure`);
        return json({
          message: 'Registration successful!',
          user,
          customer_code: cCode,
          has_franchise: Boolean(targetFranchiseId)
        }, 200, Object.fromEntries(headers));
      } catch (err) {
        if (err.message && err.message.includes('UNIQUE')) return json({ error: 'This email is already registered' }, 400);
        return json({ error: err.message }, 500);
      }
    }

    if (pathStr === 'auth/me' && method === 'GET') {
      const user = await getAuthUser(request, env);
      return json({ user });
    }

    if (pathStr === 'auth/logout' && method === 'POST') {
      const headers = new Headers();
      headers.set('Set-Cookie', 'user_id=; Path=/; Max-Age=0; SameSite=Lax; Secure');
      return json({ message: 'Logged out successfully' }, 200, Object.fromEntries(headers));
    }

    // ==========================================
    // 2. PUBLIC CARD & VCARD ROUTES
    // ==========================================
    // GET /api/cards/public/:slug
    if (route[0] === 'cards' && route[1] === 'public' && route[2] && route.length === 3 && method === 'GET') {
      const slug = route[2];
      const card = await env.DB.prepare('SELECT * FROM cards WHERE slug = ? COLLATE NOCASE').bind(slug).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      await env.DB.prepare('UPDATE cards SET views_count = views_count + 1 WHERE id = ?').bind(card.id).run();

      const { results: products } = await env.DB.prepare('SELECT * FROM products WHERE card_id = ? ORDER BY id DESC').bind(card.id).all();
      const { results: gallery } = await env.DB.prepare('SELECT * FROM gallery WHERE card_id = ? ORDER BY id DESC').bind(card.id).all();
      const { results: settingsRows } = await env.DB.prepare('SELECT key, value FROM settings').all();
      const settings = (settingsRows || []).reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});

      return json({ card, products, gallery, settings });
    }

    // GET /api/cards/public/:slug/vcard or /api/cards/:slug/vcard
    if ((route[0] === 'cards' && route[1] === 'public' && route[2] && route[3] === 'vcard' && method === 'GET') ||
        (route[0] === 'cards' && route[1] && route[2] === 'vcard' && method === 'GET')) {
      const slug = route[1] === 'public' ? route[2] : route[1];
      const card = await env.DB.prepare('SELECT * FROM cards WHERE slug = ? COLLATE NOCASE').bind(slug).first();
      if (!card) return new Response('Card not found', { status: 404 });

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
      ].join('\\r\\n');

      return new Response(vcard, {
        status: 200,
        headers: {
          'Content-Type': 'text/vcard; charset=utf-8',
          'Content-Disposition': `attachment; filename="${slug}.vcf"`
        }
      });
    }

    // ==========================================
    // 3. CARD MANAGEMENT ROUTES
    // ==========================================
    // GET /api/cards
    if (pathStr === 'cards' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      let cards;
      if (user.role === 'admin') {
        const res = await env.DB.prepare(`
          SELECT c.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.role as owner_role,
                 creator.name as creator_name
          FROM cards c
          LEFT JOIN users u ON c.user_id = u.id
          LEFT JOIN users creator ON c.created_by_user_id = creator.id
          ORDER BY c.id DESC
        `).all();
        cards = res.results;
      } else if (user.role === 'franchisee') {
        const res = await env.DB.prepare(`
          SELECT c.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.role as owner_role
          FROM cards c
          LEFT JOIN users u ON c.user_id = u.id
          WHERE c.created_by_user_id = ? OR c.user_id = ?
          ORDER BY c.id DESC
        `).bind(user.id, user.id).all();
        cards = res.results;
      } else {
        const res = await env.DB.prepare(`
          SELECT c.*, creator.name as creator_name, creator.phone as creator_phone
          FROM cards c
          LEFT JOIN users creator ON c.created_by_user_id = creator.id
          WHERE c.user_id = ?
          ORDER BY c.id DESC
        `).bind(user.id).all();
        cards = res.results;
      }
      return json({ cards });
    }

    // POST /api/cards (Franchisee & Admin card creation)
    if (pathStr === 'cards' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      if (user.role === 'customer') {
        return json({
          error: 'Customer accounts cannot create cards through the franchise endpoint. Please contact your appointed Franchise Partner or use Direct Self-Service.'
        }, 403);
      }

      const body = await request.json().catch(() => ({}));
      const {
        company_name, theme_id = 1, slug, layout_template = 'executive',
        customer_name, customer_email, customer_phone, customer_code
      } = body;

      if (!company_name) return json({ error: 'Company Name is required' }, 400);

      let targetUserId = user.id;

      if (user.role === 'franchisee') {
        const franchiseUser = await env.DB.prepare('SELECT card_quota, wallet_balance FROM users WHERE id = ?').bind(user.id).first();
        const quota = franchiseUser?.card_quota !== undefined ? franchiseUser.card_quota : 50;

        if (quota <= 0) {
          return json({ error: 'Card creation quota exhausted. Please contact Super Admin to recharge your franchise card quota pack.' }, 400);
        }

        if (customer_code && customer_code.trim()) {
          const cleanCode = customer_code.trim().toUpperCase();
          const existingClient = await env.DB.prepare('SELECT id, name, email, phone FROM users WHERE customer_code = ? COLLATE NOCASE').bind(cleanCode).first();
          if (existingClient) {
            targetUserId = existingClient.id;
            await env.DB.prepare('UPDATE users SET franchise_id = ? WHERE id = ?').bind(user.id, existingClient.id).run();
          } else {
            return json({ error: `Customer with Security Code "${customer_code}" not found. Please double-check the code.` }, 400);
          }
        } else if (customer_email && customer_email.trim()) {
          const trimmedEmail = customer_email.trim().toLowerCase();
          let existingCustomer = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(trimmedEmail).first();
          if (existingCustomer) {
            targetUserId = existingCustomer.id;
            await env.DB.prepare('UPDATE users SET franchise_id = ? WHERE id = ?').bind(user.id, existingCustomer.id).run();
          } else {
            const cCode = generateCustomerCode();
            const newCust = await env.DB.prepare(`
              INSERT INTO users (role, name, email, phone, password, wallet_balance, card_quota, status, franchise_id, customer_code)
              VALUES ('customer', ?, ?, ?, 'user123', 0, 0, 'active', ?, ?)
            `).bind(
              customer_name || company_name,
              trimmedEmail,
              customer_phone || body.phone || '',
              user.id,
              cCode
            ).run();
            targetUserId = newCust.meta.last_row_id;
          }
        }

        // Deduct 1 card from quota
        await env.DB.prepare('UPDATE users SET card_quota = card_quota - 1 WHERE id = ?').bind(user.id).run();
      }

      let cardSlug = (slug || company_name).trim().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase();
      let finalSlug = cardSlug;
      let counter = 1;
      while (await env.DB.prepare('SELECT id FROM cards WHERE slug = ?').bind(finalSlug).first()) {
        finalSlug = `${cardSlug}-${counter}`;
        counter++;
      }

      const result = await env.DB.prepare(`
        INSERT INTO cards (
          user_id, created_by_user_id, created_by_role, slug, company_name, theme_id, layout_template,
          status, payment_status, phone, email, personal_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
      `).bind(
        targetUserId,
        user.id,
        user.role,
        finalSlug,
        company_name,
        theme_id || 1,
        layout_template || 'executive',
        user.role === 'franchisee' ? 'paid' : 'trial',
        body.phone || customer_phone || '',
        body.email || customer_email || '',
        customer_name || body.personal_name || ''
      ).run();

      const newCard = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(result.meta.last_row_id).first();
      return json({ message: 'Card created successfully', card: newCard });
    }

    // POST /api/cards/self-service (Direct Customer Card Creation)
    if (pathStr === 'cards/self-service' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      if (user.role !== 'customer') return json({ error: 'Customer access required' }, 403);

      const body = await request.json().catch(() => ({}));
      const { company_name, layout_template = 'executive', theme_id = 1, phone, email, personal_name, slug } = body;
      if (!company_name) return json({ error: 'Company Name is required' }, 400);

      let cardSlug = (slug || company_name).trim().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase();
      let finalSlug = cardSlug;
      let counter = 1;
      while (await env.DB.prepare('SELECT id FROM cards WHERE slug = ?').bind(finalSlug).first()) {
        finalSlug = `${cardSlug}-${counter}`;
        counter++;
      }

      const result = await env.DB.prepare(`
        INSERT INTO cards (
          user_id, created_by_user_id, created_by_role, slug, company_name, theme_id, layout_template,
          status, payment_status, phone, email, personal_name, is_self_service
        ) VALUES (?, NULL, 'direct', ?, ?, ?, ?, 'active', 'paid', ?, ?, ?, 1)
      `).bind(
        user.id,
        finalSlug,
        company_name,
        theme_id || 1,
        layout_template || 'executive',
        phone || user.phone || '',
        email || user.email || '',
        personal_name || user.name || ''
      ).run();

      const newCard = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(result.meta.last_row_id).first();
      return json({ message: 'Self-service direct card activated successfully!', card: newCard });
    }

    // POST /api/cards/:id/toggle-status
    if (route[0] === 'cards' && route[2] === 'toggle-status' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      if (user.role === 'customer') {
        return json({ error: 'Customer accounts cannot toggle card status.' }, 403);
      }

      const cardId = route[1];
      const card = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(cardId).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      if (user.role === 'franchisee' && card.created_by_user_id !== user.id && card.user_id !== user.id) {
        return json({ error: 'Unauthorized to manage this card' }, 403);
      }

      const newStatus = card.status === 'active' ? 'deactivated' : 'active';
      await env.DB.prepare('UPDATE cards SET status = ? WHERE id = ?').bind(newStatus, cardId).run();
      return json({ message: `Card ${newStatus}`, status: newStatus });
    }

    // POST /api/cards/:id/set-payment-status
    if (route[0] === 'cards' && route[2] === 'set-payment-status' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      if (user.role === 'customer') {
        return json({ error: 'Customer accounts cannot modify subscription status.' }, 403);
      }

      const cardId = route[1];
      const body = await request.json().catch(() => ({}));
      const { payment_status } = body;
      if (!['trial', 'paid', 'expired'].includes(payment_status)) {
        return json({ error: 'Invalid payment status' }, 400);
      }

      const card = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(cardId).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      if (user.role === 'franchisee' && card.created_by_user_id !== user.id && card.user_id !== user.id) {
        return json({ error: 'Unauthorized to manage this card' }, 403);
      }

      await env.DB.prepare('UPDATE cards SET payment_status = ? WHERE id = ?').bind(payment_status, cardId).run();
      return json({ message: `Card subscription set to ${payment_status}`, payment_status });
    }

    // PUT /api/cards/:id
    if (route[0] === 'cards' && route.length === 2 && method === 'PUT') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const cardId = route[1];
      const card = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(cardId).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      const isAuthorized = user.role === 'admin' ||
                           (user.role === 'franchisee' && (card.created_by_user_id === user.id || card.user_id === user.id)) ||
                           (user.role === 'customer' && card.user_id === user.id);

      if (!isAuthorized) return json({ error: 'Unauthorized to edit this card' }, 403);

      const body = await request.json().catch(() => ({}));
      const fields = [
        'company_name', 'theme_id', 'layout_template', 'theme_style', 'personal_name', 'designation',
        'phone', 'alt_phone', 'whatsapp', 'email', 'address', 'website', 'location_map',
        'company_est_date', 'about_us', 'logo_url', 'profile_url',
        'social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin',
        'social_youtube', 'social_pinterest', 'social_telegram', 'youtube_video',
        'payment_paytm', 'payment_gpay', 'payment_phonepe', 'payment_upi_id', 'payment_qr_url',
        'bank_name', 'bank_account_no', 'bank_ifsc', 'bank_holder_name', 'status'
      ];

      if (user.role === 'customer' && body.status !== undefined) {
        delete body.status;
      }

      const updates = [];
      const values = [];

      for (const f of fields) {
        if (body[f] !== undefined) {
          updates.push(`${f} = ?`);
          values.push(body[f]);
        }
      }

      if (updates.length > 0) {
        values.push(cardId);
        await env.DB.prepare(`UPDATE cards SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
      }

      const updatedCard = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(cardId).first();
      return json({ message: 'Card updated successfully', card: updatedCard });
    }

    // DELETE /api/cards/:id
    if (route[0] === 'cards' && route.length === 2 && method === 'DELETE') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const cardId = route[1];
      const card = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(cardId).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      if (user.role !== 'admin' && card.created_by_user_id !== user.id) {
        return json({ error: 'Customer cannot delete cards. Please request your Franchise Partner.' }, 403);
      }

      await env.DB.prepare('DELETE FROM cards WHERE id = ?').bind(cardId).run();
      return json({ message: 'Card deleted successfully' });
    }

    // ==========================================
    // 4. PRODUCTS & GALLERY ROUTES
    // ==========================================
    if (route[0] === 'cards' && route[2] === 'products' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const cardId = route[1];
      const body = await request.json().catch(() => ({}));
      const { title, price, discount_price, description, image_url } = body;
      if (!title) return json({ error: 'Product title is required' }, 400);

      const info = await env.DB.prepare(`
        INSERT INTO products (card_id, title, price, discount_price, description, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(cardId, title, price || 0, discount_price || 0, description || '', image_url || '').run();

      const product = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(info.meta.last_row_id).first();
      return json({ message: 'Product added', product });
    }

    if (route[0] === 'products' && route[1] && method === 'DELETE') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(route[1]).run();
      return json({ message: 'Product deleted' });
    }

    if (route[0] === 'cards' && route[2] === 'gallery' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const cardId = route[1];
      const body = await request.json().catch(() => ({}));
      const { image_url, caption } = body;
      if (!image_url) return json({ error: 'Image URL is required' }, 400);

      const info = await env.DB.prepare('INSERT INTO gallery (card_id, image_url, caption) VALUES (?, ?, ?)').bind(cardId, image_url, caption || '').run();
      const item = await env.DB.prepare('SELECT * FROM gallery WHERE id = ?').bind(info.meta.last_row_id).first();
      return json({ message: 'Gallery item added', item });
    }

    if (route[0] === 'gallery' && route[1] && method === 'DELETE') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      await env.DB.prepare('DELETE FROM gallery WHERE id = ?').bind(route[1]).run();
      return json({ message: 'Gallery item deleted' });
    }

    // ==========================================
    // 5. ENQUIRIES & PAYMENT ROUTES
    // ==========================================
    if (route[0] === 'cards' && route[2] === 'enquiries' && method === 'POST') {
      const slug = route[1];
      const card = await env.DB.prepare('SELECT id FROM cards WHERE slug = ?').bind(slug).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      const body = await request.json().catch(() => ({}));
      const { name, phone, email, message } = body;
      if (!name || !phone) return json({ error: 'Name and phone are required' }, 400);

      await env.DB.prepare('INSERT INTO enquiries (card_id, name, phone, email, message) VALUES (?, ?, ?, ?, ?)').bind(
        card.id, name, phone, email || '', message || ''
      ).run();

      return json({ message: 'Enquiry submitted successfully! Thank you.' });
    }

    if (route[0] === 'cards' && route[2] === 'enquiries' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const { results: enquiries } = await env.DB.prepare('SELECT * FROM enquiries WHERE card_id = ? ORDER BY id DESC').bind(route[1]).all();
      return json({ enquiries });
    }

    if (pathStr === 'pay/simulate' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const body = await request.json().catch(() => ({}));
      const { card_id } = body;
      const card = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(card_id).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      await env.DB.prepare("UPDATE cards SET payment_status = 'paid', status = 'active' WHERE id = ?").bind(card_id).run();
      return json({ message: 'Payment successful! Your digital card is now fully active for 1 year.' });
    }

    // ==========================================
    // 6. FRANCHISEE ROUTES
    // ==========================================
    if (pathStr === 'franchise/dashboard' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user || (user.role !== 'franchisee' && user.role !== 'admin')) {
        return json({ error: 'Franchisee access required' }, 403);
      }

      const franchiseUser = await env.DB.prepare(`
        SELECT card_quota, wallet_balance, franchise_code, franchise_pin 
        FROM users WHERE id = ?
      `).bind(user.id).first();

      const { results: clientCards } = await env.DB.prepare(`
        SELECT c.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone, u.customer_code
        FROM cards c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.created_by_user_id = ? OR c.user_id = ?
        ORDER BY c.id DESC
      `).bind(user.id, user.id).all();

      const { results: clients } = await env.DB.prepare(`
        SELECT u.id, u.name, u.email, u.phone, u.customer_code, u.status, u.created_at,
               (SELECT COUNT(*) FROM cards WHERE user_id = u.id AND created_by_user_id = ?) as cards_count
        FROM users u
        WHERE u.franchise_id = ?
        ORDER BY u.id DESC
      `).bind(user.id, user.id).all();

      const { results: transactions } = await env.DB.prepare('SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY id DESC').bind(user.id).all();
      const { results: settingsRows } = await env.DB.prepare('SELECT key, value FROM settings').all();
      const settings = (settingsRows || []).reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});

      return json({
        card_quota: franchiseUser?.card_quota !== undefined ? franchiseUser.card_quota : 50,
        wallet_balance: user.wallet_balance || 0,
        franchise_code: franchiseUser?.franchise_code || 'FRAN-PUNE-8910',
        franchise_pin: franchiseUser?.franchise_pin || '8910',
        clientCards: clientCards || [],
        clients: clients || [],
        transactions: transactions || [],
        franchise_card_price: parseFloat(settings.franchise_card_price || '150')
      });
    }

    // ==========================================
    // 7. SUPER ADMIN ROUTES
    // ==========================================
    // GET /api/admin/franchises
    if (pathStr === 'admin/franchises' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const { results: franchises } = await env.DB.prepare(`
        SELECT u.id, u.name, u.email, u.phone, u.wallet_balance, COALESCE(u.card_quota, 50) as card_quota, 
               u.status, u.approval_status, u.franchise_code, u.franchise_pin, u.created_at,
               (SELECT COUNT(*) FROM cards WHERE created_by_user_id = u.id) as cards_created,
               (SELECT COUNT(*) FROM users WHERE franchise_id = u.id) as customers_count
        FROM users u
        WHERE u.role = 'franchisee' AND (u.approval_status = 'approved' OR u.approval_status IS NULL)
        ORDER BY u.id DESC
      `).all();

      return json({ franchises: franchises || [] });
    }

    // POST /api/admin/franchises (Appoint Franchise)
    if (pathStr === 'admin/franchises' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const body = await request.json().catch(() => ({}));
      const { name, email, phone, password, card_quota = 50 } = body;
      if (!name || !email || !password) return json({ error: 'Name, email, and password required' }, 400);

      try {
        const fCode = generateFranchiseCode(name);
        const fPin = generateFranchisePin();

        const info = await env.DB.prepare(`
          INSERT INTO users (
            role, name, email, phone, password, card_quota, wallet_balance, 
            status, approval_status, franchise_code, franchise_pin
          )
          VALUES ('franchisee', ?, ?, ?, ?, ?, 0, 'active', 'approved', ?, ?)
        `).bind(name, email.trim().toLowerCase(), phone || '', password, parseInt(card_quota) || 50, fCode, fPin).run();

        const newFranchise = await env.DB.prepare(`
          SELECT id, role, name, email, phone, card_quota, franchise_code, franchise_pin 
          FROM users WHERE id = ?
        `).bind(info.meta.last_row_id).first();

        return json({ message: 'Franchise appointed successfully', franchise: newFranchise });
      } catch (err) {
        if (err.message && err.message.includes('UNIQUE')) return json({ error: 'Email already registered' }, 400);
        return json({ error: err.message }, 500);
      }
    }

    // GET /api/admin/franchise-requests
    if (pathStr === 'admin/franchise-requests' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const { results: requests } = await env.DB.prepare(`
        SELECT id, name, email, phone, franchise_code, franchise_pin, status, approval_status, created_at
        FROM users
        WHERE role = 'franchisee' AND approval_status = 'pending'
        ORDER BY id DESC
      `).all();

      return json({ requests: requests || [] });
    }

    // POST /api/admin/franchises/:id/approve
    if (route[0] === 'admin' && route[1] === 'franchises' && route[3] === 'approve' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const franchiseId = route[2];
      const body = await request.json().catch(() => ({}));
      const { card_quota = 50 } = body;

      await env.DB.prepare(`
        UPDATE users 
        SET approval_status = 'approved', status = 'active', card_quota = ?
        WHERE id = ? AND role = 'franchisee'
      `).bind(parseInt(card_quota) || 50, franchiseId).run();

      const approved = await env.DB.prepare('SELECT id, name, email, phone, franchise_code, card_quota FROM users WHERE id = ?').bind(franchiseId).first();
      return json({ message: 'Franchise Partner application approved successfully!', franchise: approved });
    }

    // POST /api/admin/franchises/:id/reject
    if (route[0] === 'admin' && route[1] === 'franchises' && route[3] === 'reject' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const franchiseId = route[2];
      await env.DB.prepare("DELETE FROM users WHERE id = ? AND role = 'franchisee' AND approval_status = 'pending'").bind(franchiseId).run();
      return json({ message: 'Franchise application rejected and removed.' });
    }

    // DELETE /api/admin/franchises/:id
    if (route[0] === 'admin' && route[1] === 'franchises' && route.length === 3 && method === 'DELETE') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const franchiseId = route[2];
      const fran = await env.DB.prepare("SELECT * FROM users WHERE id = ? AND role = 'franchisee'").bind(franchiseId).first();
      if (!fran) return json({ error: 'Franchise Partner not found' }, 404);

      await env.DB.prepare('UPDATE cards SET created_by_user_id = NULL WHERE created_by_user_id = ?').bind(franchiseId).run();
      await env.DB.prepare('UPDATE users SET franchise_id = NULL WHERE franchise_id = ?').bind(franchiseId).run();
      await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(franchiseId).run();

      return json({ message: `Franchise partner "${fran.name}" has been removed. All customer cards have been reassigned directly to Super Admin.` });
    }

    // POST /api/admin/franchises/:id/recharge
    if (route[0] === 'admin' && route[1] === 'franchises' && route[3] === 'recharge' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const franchiseId = route[2];
      const body = await request.json().catch(() => ({}));
      const { additional_quota = 0, amount = 0, pack_name = 'Custom Pack' } = body;

      const franchise = await env.DB.prepare('SELECT * FROM users WHERE id = ? AND role = "franchisee"').bind(franchiseId).first();
      if (!franchise) return json({ error: 'Franchise not found' }, 404);

      const quotaToAdd = parseInt(additional_quota) || 0;
      await env.DB.prepare('UPDATE users SET card_quota = COALESCE(card_quota, 0) + ? WHERE id = ?').bind(quotaToAdd, franchiseId).run();

      if (amount > 0) {
        await env.DB.prepare('INSERT INTO wallet_transactions (user_id, amount, type, comment) VALUES (?, ?, "credit", ?)').bind(
          franchiseId,
          parseFloat(amount),
          `Quota Pack Recharge: ${pack_name} (+${quotaToAdd} cards)`
        ).run();
      }

      const updated = await env.DB.prepare('SELECT id, name, email, card_quota, wallet_balance FROM users WHERE id = ?').bind(franchiseId).first();
      return json({ message: `Successfully allocated +${quotaToAdd} cards to franchise quota`, franchise: updated });
    }

    // GET /api/admin/customers
    if (pathStr === 'admin/customers' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const { results: customers } = await env.DB.prepare(`
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

      return json({ customers: customers || [] });
    }

    // DELETE /api/admin/users/:id
    if (route[0] === 'admin' && route[1] === 'users' && route.length === 3 && method === 'DELETE') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const userId = route[2];
      const targetUser = await env.DB.prepare('SELECT id, name, role FROM users WHERE id = ?').bind(userId).first();
      if (!targetUser) return json({ error: 'User not found' }, 404);
      if (targetUser.role === 'admin') return json({ error: 'Super Admin cannot be deleted.' }, 403);

      await env.DB.prepare('DELETE FROM cards WHERE user_id = ?').bind(userId).run();
      await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

      return json({ message: `Customer "${targetUser.name}" and their cards have been deleted.` });
    }

    // POST /api/admin/users/:id/toggle-status
    if (route[0] === 'admin' && route[1] === 'users' && route[3] === 'toggle-status' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const userId = route[2];
      const targetUser = await env.DB.prepare('SELECT id, status, name, role FROM users WHERE id = ?').bind(userId).first();
      if (!targetUser) return json({ error: 'User not found' }, 404);
      if (targetUser.role === 'admin') return json({ error: 'Cannot deactivate Super Admin.' }, 403);

      const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
      await env.DB.prepare('UPDATE users SET status = ? WHERE id = ?').bind(newStatus, userId).run();
      return json({ message: `User status changed to ${newStatus}`, status: newStatus });
    }

    // GET /api/admin/dashboard
    if (pathStr === 'admin/dashboard' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const totalCards = (await env.DB.prepare('SELECT COUNT(*) as c FROM cards').first())?.c || 0;
      const userCards = (await env.DB.prepare("SELECT COUNT(*) as c FROM cards WHERE created_by_role = 'customer'").first())?.c || 0;
      const franchiseeCards = (await env.DB.prepare("SELECT COUNT(*) as c FROM cards WHERE created_by_role = 'franchisee'").first())?.c || 0;
      const activeCards = (await env.DB.prepare("SELECT COUNT(*) as c FROM cards WHERE status = 'active'").first())?.c || 0;
      const inactiveCards = (await env.DB.prepare("SELECT COUNT(*) as c FROM cards WHERE status = 'deactivated'").first())?.c || 0;
      const trialCards = (await env.DB.prepare("SELECT COUNT(*) as c FROM cards WHERE payment_status = 'trial'").first())?.c || 0;
      const paidCards = (await env.DB.prepare("SELECT COUNT(*) as c FROM cards WHERE payment_status = 'paid'").first())?.c || 0;

      const allFranchisees = (await env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'franchisee'").first())?.c || 0;
      const allUsers = (await env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").first())?.c || 0;

      const cardPriceSetting = await env.DB.prepare("SELECT value FROM settings WHERE key = 'card_price'").first();
      const cardPrice = parseFloat(cardPriceSetting?.value || '999');
      const paymentTotal = paidCards * cardPrice;

      return json({
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
    }

    // GET /api/admin/users
    if (pathStr === 'admin/users' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const { results: users } = await env.DB.prepare(`
        SELECT u.id, u.role, u.name, u.email, u.phone, u.wallet_balance, u.status, u.created_at,
               COUNT(c.id) as cards_count
        FROM users u
        LEFT JOIN cards c ON u.id = c.user_id
        GROUP BY u.id
        ORDER BY u.id DESC
      `).all();

      return json({ users: users || [] });
    }

    // POST /api/admin/recharge-wallet
    if (pathStr === 'admin/recharge-wallet' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const body = await request.json().catch(() => ({}));
      const { email, amount, comment } = body;
      if (!email || !amount) return json({ error: 'Email and amount required' }, 400);

      const franchisee = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND role = 'franchisee'").bind(email).first();
      if (!franchisee) return json({ error: 'Franchisee with this email not found' }, 404);

      const rechargeAmount = parseFloat(amount);
      if (isNaN(rechargeAmount) || rechargeAmount <= 0) return json({ error: 'Valid amount required' }, 400);

      await env.DB.prepare('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?').bind(rechargeAmount, franchisee.id).run();
      await env.DB.prepare('INSERT INTO wallet_transactions (user_id, amount, type, comment) VALUES (?, ?, ?, ?)').bind(
        franchisee.id, rechargeAmount, 'credit', comment || 'Admin manual recharge'
      ).run();

      const updatedFranchisee = await env.DB.prepare('SELECT id, name, email, wallet_balance FROM users WHERE id = ?').bind(franchisee.id).first();
      return json({ message: `Successfully recharged ₹${rechargeAmount} to ${franchisee.name}`, franchisee: updatedFranchisee });
    }

    // GET & POST /api/admin/settings
    if (pathStr === 'admin/settings') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      if (method === 'GET') {
        const { results: rows } = await env.DB.prepare('SELECT key, value FROM settings').all();
        const settings = (rows || []).reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});
        return json({ settings });
      }

      if (method === 'POST') {
        const body = await request.json().catch(() => ({}));
        for (const [k, v] of Object.entries(body)) {
          await env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind(k, String(v)).run();
        }
        return json({ message: 'Settings saved successfully' });
      }
    }

    // GET /api/admin/enquiries
    if (pathStr === 'admin/enquiries' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const { results: enquiries } = await env.DB.prepare(`
        SELECT e.*, c.company_name, c.slug, u.name as owner_name, u.email as owner_email
        FROM enquiries e
        JOIN cards c ON e.card_id = c.id
        LEFT JOIN users u ON c.user_id = u.id
        ORDER BY e.id DESC
      `).all();

      return json({ enquiries: enquiries || [] });
    }

    // POST /api/admin/cards/:id/payment-status
    if (route[0] === 'admin' && route[1] === 'cards' && route[3] === 'payment-status' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user || user.role !== 'admin') return json({ error: 'Admin access required' }, 403);

      const cardId = route[2];
      const body = await request.json().catch(() => ({}));
      const { payment_status, status } = body;
      const card = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(cardId).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      const newPayStatus = payment_status || (card.payment_status === 'paid' ? 'trial' : 'paid');
      const newStatus = status || (newPayStatus === 'paid' ? 'active' : card.status);

      await env.DB.prepare('UPDATE cards SET payment_status = ?, status = ? WHERE id = ?').bind(newPayStatus, newStatus, cardId).run();
      return json({ message: `Card updated to ${newPayStatus} / ${newStatus}`, cardId, payment_status: newPayStatus, status: newStatus });
    }

    // ==========================================
    // 8. FILE UPLOADS (R2 / Base64 Fallback)
    // ==========================================
    if (pathStr === 'upload' && method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file) return json({ error: 'No file uploaded' }, 400);

      const safeName = (file.name || 'image.png').replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`;

      if (env.UPLOADS) {
        await env.UPLOADS.put(filename, file.stream(), {
          httpMetadata: { contentType: file.type || 'application/octet-stream' }
        });
        return json({ url: `/uploads/${filename}`, filename });
      } else {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        const dataUrl = `data:${file.type || 'image/png'};base64,${base64}`;
        return json({ url: dataUrl, filename });
      }
    }

    return json({ error: `Not Found: ${method} /api/${pathStr}` }, 404);
  } catch (error) {
    return json({ error: error.message || 'Internal Server Error' }, 500);
  }
}
