import os
from PIL import Image, ImageDraw, ImageFont

dest = 'public/assets/img/demo'
os.makedirs(dest, exist_ok=True)

# 1. ABC Marketing Logo (Circular with gold background and "ABC MARKETING")
img = Image.new('RGBA', (300, 300), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)
draw.ellipse([10, 10, 290, 290], fill='#ffffff', outline='#d97706', width=8)
draw.ellipse([25, 25, 275, 275], fill='#f59e0b', outline='#b45309', width=4)
draw.text((80, 105), "abc", fill='#1e293b', font_size=58)
draw.text((65, 175), "MARKETING", fill='#ffffff', font_size=28)
img.save(os.path.join(dest, 'logo.png'))

# 2. Profile Photo
p_img = Image.new('RGB', (400, 400), '#3b82f6')
p_draw = ImageDraw.Draw(p_img)
p_draw.rectangle([0, 0, 400, 400], fill='#1e293b')
p_draw.ellipse([130, 80, 270, 220], fill='#cbd5e1')
p_draw.ellipse([80, 250, 320, 480], fill='#475569')
p_draw.text((115, 300), "Irshad Kamil", fill='#ffffff', font_size=28)
p_img.save(os.path.join(dest, 'profile.jpg'))

# 3. Sample UPI QR Code
qr_img = Image.new('RGB', (350, 350), '#ffffff')
q_draw = ImageDraw.Draw(qr_img)
# Draw outer finder boxes
for pos in [(30, 30), (220, 30), (30, 220)]:
    q_draw.rectangle([pos[0], pos[1], pos[0]+100, pos[1]+100], fill='#000000')
    q_draw.rectangle([pos[0]+15, pos[1]+15, pos[0]+85, pos[1]+85], fill='#ffffff')
    q_draw.rectangle([pos[0]+30, pos[1]+30, pos[0]+70, pos[1]+70], fill='#000000')
# Draw some data modules
for i in range(15):
    for j in range(15):
        if (i+j*3) % 4 == 0:
            x, y = 50 + i*16, 50 + j*16
            if not ((x < 150 and y < 150) or (x > 200 and y < 150) or (x < 150 and y > 200)):
                q_draw.rectangle([x, y, x+12, y+12], fill='#000000')
# Add center UPI logo text
q_draw.rectangle([130, 145, 220, 205], fill='#004c8f')
q_draw.text((145, 160), "UPI", fill='#ffffff', font_size=32)
qr_img.save(os.path.join(dest, 'sample-qr.png'))

# 4. Product 1: Source Code
prod1 = Image.new('RGB', (600, 400), '#4f46e5')
d1 = ImageDraw.Draw(prod1)
d1.rectangle([40, 40, 560, 360], outline='#ffffff', width=4)
d1.text((70, 120), "100 THEMES PORTAL", fill='#ffffff', font_size=36)
d1.text((70, 180), "PHP / Node.js Source Code", fill='#facc15', font_size=28)
d1.text((70, 240), "SaaS & Franchisee Ready", fill='#e0e7ff', font_size=22)
prod1.save(os.path.join(dest, 'prod1.png'))

# 5. Product 2: NFC Metal Card
prod2 = Image.new('RGB', (600, 400), '#0f172a')
d2 = ImageDraw.Draw(prod2)
d2.rounded_rectangle([80, 70, 520, 330], radius=20, fill='#1e293b', outline='#d4af37', width=5)
d2.text((140, 130), "NFC SMART CARD", fill='#d4af37', font_size=34)
d2.text((140, 190), "Matte Black Metal Finish", fill='#ffffff', font_size=24)
d2.text((140, 240), "Tap & Share Instant Profile", fill='#94a3b8', font_size=20)
prod2.save(os.path.join(dest, 'prod2.png'))

# 6. Product 3: Mini Ecommerce
prod3 = Image.new('RGB', (600, 400), '#059669')
d3 = ImageDraw.Draw(prod3)
d3.rectangle([40, 40, 560, 360], outline='#ffffff', width=4)
d3.text((70, 120), "MINI E-COMMERCE STORE", fill='#ffffff', font_size=32)
d3.text((70, 180), "WhatsApp 1-Click Checkout", fill='#fef08a', font_size=26)
d3.text((70, 240), "Products, Pricing & Inquiries", fill='#e6fffa', font_size=22)
prod3.save(os.path.join(dest, 'prod3.png'))

# 7. Gallery Images
for idx, (title, color) in enumerate([('Studio & Team', '#2563eb'), ('Card Mockups', '#7c3aed'), ('Client Summit', '#db2777')], 1):
    g_img = Image.new('RGB', (600, 450), color)
    gd = ImageDraw.Draw(g_img)
    gd.rectangle([30, 30, 570, 420], outline='#ffffff', width=3)
    gd.text((120, 200), title, fill='#ffffff', font_size=36)
    g_img.save(os.path.join(dest, f'gallery{idx}.jpg'))

print('Demo assets created successfully!')
