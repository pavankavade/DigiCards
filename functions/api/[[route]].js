// Cloudflare Pages Functions - Full API Router for DigiCards

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

async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  const userId = getCookie(request, 'user_id') || (authHeader && authHeader.replace('Bearer ', ''));
  if (!userId) return null;

  const user = await env.DB.prepare(
    'SELECT id, role, name, email, phone, wallet_balance, status FROM users WHERE id = ?'
  ).bind(userId).first();

  if (!user || user.status !== 'active') return null;
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

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

      let query = 'SELECT * FROM users WHERE (email = ? OR phone = ?) AND password = ?';
      const bindParams = [identifier, identifier, password];
      if (role) {
        query += ' AND role = ?';
        bindParams.push(role);
      }

      const user = await env.DB.prepare(query).bind(...bindParams).first();
      if (!user) return json({ error: 'Invalid email/phone or password' }, 401);
      if (user.status !== 'active') return json({ error: 'Account is deactivated' }, 403);

      const { password: _, ...userData } = user;
      const headers = new Headers();
      headers.set('Set-Cookie', `user_id=${user.id}; Path=/; Max-Age=86400; SameSite=Lax; Secure`);
      return json({ message: 'Login successful', user: userData }, 200, Object.fromEntries(headers));
    }

    if (pathStr === 'auth/register' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const { name, email, phone, password } = body;
      if (!name || !email || !password) return json({ error: 'All fields are required' }, 400);

      try {
        const info = await env.DB.prepare(`
          INSERT INTO users (role, name, email, phone, password, wallet_balance, status)
          VALUES ('customer', ?, ?, ?, ?, 0, 'active')
        `).bind(name, email, phone || '', password).run();

        const user = await env.DB.prepare('SELECT id, role, name, email, phone, wallet_balance FROM users WHERE id = ?')
          .bind(info.meta.last_row_id).first();

        const headers = new Headers();
        headers.set('Set-Cookie', `user_id=${user.id}; Path=/; Max-Age=86400; SameSite=Lax; Secure`);
        return json({ message: 'Registration successful', user }, 200, Object.fromEntries(headers));
      } catch (err) {
        if (err.message && err.message.includes('UNIQUE')) {
          return json({ error: 'Email already registered' }, 400);
        }
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
    // 2. PUBLIC CARD ROUTES
    // ==========================================
    // GET /api/cards/public/:slug
    if (route[0] === 'cards' && route[1] === 'public' && route[2] && route.length === 3 && method === 'GET') {
      const slug = route[2];
      const card = await env.DB.prepare('SELECT * FROM cards WHERE slug = ? COLLATE NOCASE').bind(slug).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      // Increment view counter
      await env.DB.prepare('UPDATE cards SET views_count = views_count + 1 WHERE id = ?').bind(card.id).run();

      const { results: products } = await env.DB.prepare('SELECT * FROM products WHERE card_id = ? ORDER BY id DESC').bind(card.id).all();
      const { results: gallery } = await env.DB.prepare('SELECT * FROM gallery WHERE card_id = ? ORDER BY id DESC').bind(card.id).all();
      const { results: settingsRows } = await env.DB.prepare('SELECT key, value FROM settings').all();
      const settings = (settingsRows || []).reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});

      return json({ card, products, gallery, settings });
    }

    // GET /api/cards/public/:slug/vcard
    if (route[0] === 'cards' && route[1] === 'public' && route[2] && route[3] === 'vcard' && method === 'GET') {
      const slug = route[2];
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
      ].join('\r\n');

      return new Response(vcard, {
        headers: {
          'Content-Type': 'text/vcard; charset=utf-8',
          'Content-Disposition': `attachment; filename="${slug}.vcf"`
        }
      });
    }

    // ==========================================
    // 3. ENQUIRIES (PUBLIC & PRIVATE)
    // ==========================================
    // POST /api/cards/:slug/enquiries
    if (route[0] === 'cards' && route[2] === 'enquiries' && method === 'POST') {
      const slug = route[1];
      const card = await env.DB.prepare('SELECT id FROM cards WHERE slug = ?').bind(slug).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      const body = await request.json().catch(() => ({}));
      const { name, phone, email, message } = body;
      if (!name || !phone) return json({ error: 'Name and phone are required' }, 400);

      await env.DB.prepare(
        'INSERT INTO enquiries (card_id, name, phone, email, message) VALUES (?, ?, ?, ?, ?)'
      ).bind(card.id, name, phone, email || '', message || '').run();

      return json({ message: 'Enquiry submitted successfully! Thank you.' });
    }

    // GET /api/cards/:id/enquiries
    if (route[0] === 'cards' && route[2] === 'enquiries' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const cardId = route[1];
      const { results: enquiries } = await env.DB.prepare('SELECT * FROM enquiries WHERE card_id = ? ORDER BY id DESC')
        .bind(cardId).all();
      return json({ enquiries });
    }

    // ==========================================
    // 4. USER CARD CRUD ROUTES (AUTH REQUIRED)
    // ==========================================
    // GET /api/cards
    if (pathStr === 'cards' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      let cards;
      if (user.role === 'admin') {
        const res = await env.DB.prepare(`
          SELECT c.*, u.name as owner_name, u.email as owner_email, u.role as owner_role
          FROM cards c
          LEFT JOIN users u ON c.user_id = u.id
          ORDER BY c.id DESC
        `).all();
        cards = res.results;
      } else {
        const res = await env.DB.prepare('SELECT * FROM cards WHERE user_id = ? ORDER BY id DESC').bind(user.id).all();
        cards = res.results;
      }
      return json({ cards });
    }

    // POST /api/cards
    if (pathStr === 'cards' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const body = await request.json().catch(() => ({}));
      const { company_name, theme_id = 26, slug } = body;
      if (!company_name) return json({ error: 'Company Name is required' }, 400);

      if (user.role === 'franchisee') {
        const costSetting = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('franchise_card_price').first();
        const cardCost = parseFloat(costSetting?.value || '150');

        if (user.wallet_balance < cardCost) {
          return json({
            error: `Insufficient wallet balance. You need ₹${cardCost}, current balance is ₹${user.wallet_balance}. Please recharge wallet.`
          }, 400);
        }

        await env.DB.prepare('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?').bind(cardCost, user.id).run();
        await env.DB.prepare('INSERT INTO wallet_transactions (user_id, amount, type, comment) VALUES (?, ?, ?, ?)').bind(
          user.id, cardCost, 'debit', `Card creation fee for: ${company_name}`
        ).run();
      }

      let cardSlug = (slug || company_name)
        .trim()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();

      let finalSlug = cardSlug;
      let counter = 1;
      while (await env.DB.prepare('SELECT id FROM cards WHERE slug = ?').bind(finalSlug).first()) {
        finalSlug = `${cardSlug}-${counter}`;
        counter++;
      }

      const result = await env.DB.prepare(`
        INSERT INTO cards (
          user_id, created_by_role, slug, company_name, theme_id,
          status, payment_status, phone, email
        ) VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?)
      `).bind(
        user.id,
        user.role,
        finalSlug,
        company_name,
        theme_id,
        user.role === 'franchisee' ? 'paid' : 'trial',
        user.phone || '',
        user.email || ''
      ).run();

      const newCard = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(result.meta.last_row_id).first();
      return json({ message: 'Card created successfully', card: newCard });
    }

    // POST /api/cards/:id/toggle-status
    if (route[0] === 'cards' && route[2] === 'toggle-status' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const cardId = route[1];
      const card = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(cardId).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      const newStatus = card.status === 'active' ? 'deactivated' : 'active';
      await env.DB.prepare('UPDATE cards SET status = ? WHERE id = ?').bind(newStatus, cardId).run();
      return json({ message: `Card ${newStatus}`, status: newStatus });
    }

    // PUT /api/cards/:id
    if (route[0] === 'cards' && route.length === 2 && method === 'PUT') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const cardId = route[1];
      const card = await env.DB.prepare('SELECT * FROM cards WHERE id = ?').bind(cardId).first();
      if (!card) return json({ error: 'Card not found' }, 404);

      if (user.role !== 'admin' && card.user_id !== user.id) {
        return json({ error: 'Unauthorized to edit this card' }, 403);
      }

      const body = await request.json().catch(() => ({}));
      const fields = [
        'company_name', 'theme_id', 'theme_style', 'personal_name', 'designation',
        'phone', 'alt_phone', 'whatsapp', 'email', 'address', 'website', 'location_map',
        'company_est_date', 'about_us', 'logo_url', 'profile_url',
        'social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin',
        'social_youtube', 'social_pinterest', 'social_telegram', 'youtube_video',
        'payment_paytm', 'payment_gpay', 'payment_phonepe', 'payment_upi_id', 'payment_qr_url',
        'bank_name', 'bank_account_no', 'bank_ifsc', 'bank_holder_name', 'status'
      ];

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

      if (user.role !== 'admin' && card.user_id !== user.id) {
        return json({ error: 'Unauthorized' }, 403);
      }

      await env.DB.prepare('DELETE FROM cards WHERE id = ?').bind(cardId).run();
      return json({ message: 'Card deleted successfully' });
    }

    // ==========================================
    // 5. PRODUCTS ROUTES
    // ==========================================
    // POST /api/cards/:id/products
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

    // DELETE /api/products/:id
    if (route[0] === 'products' && route.length === 2 && method === 'DELETE') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(route[1]).run();
      return json({ message: 'Product deleted' });
    }

    // ==========================================
    // 6. GALLERY ROUTES
    // ==========================================
    // POST /api/cards/:id/gallery
    if (route[0] === 'cards' && route[2] === 'gallery' && method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      const cardId = route[1];
      const body = await request.json().catch(() => ({}));
      const { image_url, caption } = body;
      if (!image_url) return json({ error: 'Image URL is required' }, 400);

      const info = await env.DB.prepare('INSERT INTO gallery (card_id, image_url, caption) VALUES (?, ?, ?)')
        .bind(cardId, image_url, caption || '').run();
      const item = await env.DB.prepare('SELECT * FROM gallery WHERE id = ?').bind(info.meta.last_row_id).first();
      return json({ message: 'Gallery item added', item });
    }

    // DELETE /api/gallery/:id
    if (route[0] === 'gallery' && route.length === 2 && method === 'DELETE') {
      const user = await getAuthUser(request, env);
      if (!user) return json({ error: 'Unauthorized' }, 401);

      await env.DB.prepare('DELETE FROM gallery WHERE id = ?').bind(route[1]).run();
      return json({ message: 'Gallery item deleted' });
    }

    // ==========================================
    // 7. PAYMENT SIMULATION
    // ==========================================
    // POST /api/pay/simulate
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
    // 8. FRANCHISEE ROUTES
    // ==========================================
    // GET /api/franchise/dashboard
    if (pathStr === 'franchise/dashboard' && method === 'GET') {
      const user = await getAuthUser(request, env);
      if (!user || (user.role !== 'franchisee' && user.role !== 'admin')) {
        return json({ error: 'Franchisee access required' }, 403);
      }

      const { results: clientCards } = await env.DB.prepare('SELECT * FROM cards WHERE user_id = ? ORDER BY id DESC').bind(user.id).all();
      const { results: transactions } = await env.DB.prepare('SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY id DESC').bind(user.id).all();
      const { results: settingsRows } = await env.DB.prepare('SELECT key, value FROM settings').all();
      const settings = (settingsRows || []).reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {});

      return json({
        wallet_balance: user.wallet_balance,
        clientCards,
        transactions,
        franchise_card_price: parseFloat(settings.franchise_card_price || '150')
      });
    }

    // ==========================================
    // 9. SUPER ADMIN ROUTES
    // ==========================================
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

      return json({ users });
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

    // ==========================================
    // 10. FILE UPLOADS (R2 / Base64 Fallback)
    // ==========================================
    if (pathStr === 'upload' && method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file) return json({ error: 'No file uploaded' }, 400);

      const safeName = (file.name || 'image.png').replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`;

      if (env.UPLOADS) {
        // Upload to Cloudflare R2 bucket
        await env.UPLOADS.put(filename, file.stream(), {
          httpMetadata: { contentType: file.type || 'application/octet-stream' }
        });
        return json({ url: `/uploads/${filename}`, filename });
      } else {
        // Fallback: Return Data URL if R2 bucket is not bound yet
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