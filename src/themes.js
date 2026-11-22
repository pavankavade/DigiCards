// 100 Modern Curated Themes & Design Systems for Digital Business Cards (QRCodeChimp Inspired)

export const THEME_CATEGORIES = [
  "All",
  "Luxury & Executive",
  "Modern Glassmorphism",
  "Dark & Cyber Glow",
  "Vibrant Gradients",
  "Minimalist & Clean"
];

export const LAYOUT_STYLES = [
  { id: 'executive', name: 'Neo-Executive', desc: 'Curved banner, centered glowing avatar, glass action dock' },
  { id: 'glassmorphic', name: 'Glassmorphic Modern', desc: 'Frosted blur surfaces, neon border glow, floating widgets' },
  { id: 'minimalist', name: 'Sleek Minimalist', desc: 'Clean high contrast, crisp typography, badge chips' },
  { id: 'cyber', name: 'Cyberpunk Matrix', desc: 'Obsidian dark, neon borders, futuristic tech glow' },
  { id: 'split', name: 'Vibrant Split', desc: 'Diagonal geometric header, high-energy buttons, bold colors' }
];

const PALETTE_TEMPLATES = [
  // 1-5 Luxury & Executive
  { name: "24K Royal Gold", primary: "#d97706", secondary: "#f59e0b", accent: "#fbbf24", gradient: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)", cardBg: "#141417", dark: true, category: "Luxury & Executive", layout: "executive", borderGlow: "rgba(217, 119, 6, 0.4)", glassBg: "rgba(30, 27, 24, 0.75)" },
  { name: "Rose Gold Luxe", primary: "#be185d", secondary: "#f472b6", accent: "#fb7185", gradient: "linear-gradient(135deg, #4c0519 0%, #881337 50%, #be123c 100%)", cardBg: "#1c0711", dark: true, category: "Luxury & Executive", layout: "executive", borderGlow: "rgba(244, 114, 182, 0.4)", glassBg: "rgba(45, 10, 25, 0.75)" },
  { name: "Champagne Silk", primary: "#ca8a04", secondary: "#eab308", accent: "#fef08a", gradient: "linear-gradient(135deg, #fefce8 0%, #fef08a 50%, #fde047 100%)", cardBg: "#ffffff", dark: false, category: "Luxury & Executive", layout: "executive", borderGlow: "rgba(202, 138, 4, 0.3)", glassBg: "rgba(255, 255, 255, 0.85)" },
  { name: "Imperial Platinum", primary: "#475569", secondary: "#94a3b8", accent: "#cbd5e1", gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", cardBg: "#0b0f19", dark: true, category: "Luxury & Executive", layout: "executive", borderGlow: "rgba(148, 163, 184, 0.3)", glassBg: "rgba(20, 27, 45, 0.75)" },
  { name: "Monaco Emerald", primary: "#047857", secondary: "#10b981", accent: "#34d399", gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)", cardBg: "#021c16", dark: true, category: "Luxury & Executive", layout: "executive", borderGlow: "rgba(16, 185, 129, 0.4)", glassBg: "rgba(6, 40, 30, 0.75)" },

  // 6-10 Modern Glassmorphism
  { name: "Frosted Azure", primary: "#0284c7", secondary: "#38bdf8", accent: "#7dd3fc", gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)", cardBg: "#f8fafc", dark: false, category: "Modern Glassmorphism", layout: "glassmorphic", borderGlow: "rgba(56, 189, 248, 0.4)", glassBg: "rgba(255, 255, 255, 0.75)" },
  { name: "Amethyst Crystal", primary: "#7c3aed", secondary: "#a855f7", accent: "#c084fc", gradient: "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)", cardBg: "#ffffff", dark: false, category: "Modern Glassmorphism", layout: "glassmorphic", borderGlow: "rgba(168, 85, 247, 0.35)", glassBg: "rgba(255, 255, 255, 0.8)" },
  { name: "Emerald Glass", primary: "#059669", secondary: "#34d399", accent: "#6ee7b7", gradient: "linear-gradient(135deg, #059669 0%, #34d399 100%)", cardBg: "#f0fdf4", dark: false, category: "Modern Glassmorphism", layout: "glassmorphic", borderGlow: "rgba(52, 211, 153, 0.4)", glassBg: "rgba(255, 255, 255, 0.82)" },
  { name: "Rose Quartz", primary: "#e11d48", secondary: "#fb7185", accent: "#fda4af", gradient: "linear-gradient(135deg, #e11d48 0%, #fb7185 100%)", cardBg: "#fff1f2", dark: false, category: "Modern Glassmorphism", layout: "glassmorphic", borderGlow: "rgba(251, 113, 133, 0.35)", glassBg: "rgba(255, 255, 255, 0.85)" },
  { name: "Arctic Mist", primary: "#0d9488", secondary: "#2dd4bf", accent: "#5eead4", gradient: "linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)", cardBg: "#f0fdfa", dark: false, category: "Modern Glassmorphism", layout: "glassmorphic", borderGlow: "rgba(45, 212, 191, 0.35)", glassBg: "rgba(255, 255, 255, 0.8)" },

  // 11-15 Dark & Cyber Glow
  { name: "Cyberpunk 2077", primary: "#06b6d4", secondary: "#ec4899", accent: "#f43f5e", gradient: "linear-gradient(135deg, #080f1e 0%, #1e112a 50%, #2e081f 100%)", cardBg: "#090d16", dark: true, category: "Dark & Cyber Glow", layout: "cyber", borderGlow: "rgba(6, 182, 212, 0.5)", glassBg: "rgba(15, 23, 42, 0.8)" },
  { name: "Midnight Stealth", primary: "#38bdf8", secondary: "#818cf8", accent: "#0284c7", gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", cardBg: "#0a0f1d", dark: true, category: "Dark & Cyber Glow", layout: "cyber", borderGlow: "rgba(56, 189, 248, 0.35)", glassBg: "rgba(15, 23, 42, 0.8)" },
  { name: "Matrix Code Neon", primary: "#84cc16", secondary: "#a3e635", accent: "#4ade80", gradient: "linear-gradient(135deg, #022c22 0%, #052e16 100%)", cardBg: "#021a12", dark: true, category: "Dark & Cyber Glow", layout: "cyber", borderGlow: "rgba(132, 204, 22, 0.5)", glassBg: "rgba(5, 35, 25, 0.8)" },
  { name: "Carbon Fiber Pro", primary: "#f1f5f9", secondary: "#94a3b8", accent: "#38bdf8", gradient: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", cardBg: "#121215", dark: true, category: "Dark & Cyber Glow", layout: "cyber", borderGlow: "rgba(255, 255, 255, 0.2)", glassBg: "rgba(28, 28, 35, 0.8)" },
  { name: "Cosmic Nebula", primary: "#8b5cf6", secondary: "#d946ef", accent: "#6366f1", gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4a044e 100%)", cardBg: "#0e0d22", dark: true, category: "Dark & Cyber Glow", layout: "cyber", borderGlow: "rgba(217, 70, 239, 0.4)", glassBg: "rgba(25, 20, 50, 0.8)" },

  // 16-20 Vibrant Gradients
  { name: "Sunset Blaze", primary: "#ea580c", secondary: "#f97316", accent: "#fbbf24", gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fbbf24 100%)", cardBg: "#ffffff", dark: false, category: "Vibrant Gradients", layout: "split", borderGlow: "rgba(249, 115, 22, 0.4)", glassBg: "rgba(255, 255, 255, 0.85)" },
  { name: "Oceanic Depth", primary: "#2563eb", secondary: "#60a5fa", accent: "#1d4ed8", gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)", cardBg: "#ffffff", dark: false, category: "Vibrant Gradients", layout: "split", borderGlow: "rgba(37, 99, 235, 0.35)", glassBg: "rgba(255, 255, 255, 0.85)" },
  { name: "Velvet Crimson", primary: "#be123c", secondary: "#e11d48", accent: "#f43f5e", gradient: "linear-gradient(135deg, #881337 0%, #be123c 50%, #fb7185 100%)", cardBg: "#ffffff", dark: false, category: "Vibrant Gradients", layout: "split", borderGlow: "rgba(225, 29, 72, 0.35)", glassBg: "rgba(255, 255, 255, 0.85)" },
  { name: "Electric Indigo", primary: "#4338ca", secondary: "#4f46e5", accent: "#818cf8", gradient: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)", cardBg: "#ffffff", dark: false, category: "Vibrant Gradients", layout: "split", borderGlow: "rgba(79, 70, 229, 0.4)", glassBg: "rgba(255, 255, 255, 0.85)" },
  { name: "Tropical Mango", primary: "#d97706", secondary: "#f59e0b", accent: "#10b981", gradient: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)", cardBg: "#ffffff", dark: false, category: "Vibrant Gradients", layout: "split", borderGlow: "rgba(245, 158, 11, 0.35)", glassBg: "rgba(255, 255, 255, 0.85)" },

  // 21-25 Minimalist & Clean
  { name: "Nordic Slate", primary: "#0284c7", secondary: "#38bdf8", accent: "#0369a1", gradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", cardBg: "#ffffff", dark: false, category: "Minimalist & Clean", layout: "minimalist", borderGlow: "rgba(2, 132, 199, 0.25)", glassBg: "rgba(255, 255, 255, 0.9)" },
  { name: "Tokyo Monochrome", primary: "#18181b", secondary: "#52525b", accent: "#71717a", gradient: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", cardBg: "#ffffff", dark: false, category: "Minimalist & Clean", layout: "minimalist", borderGlow: "rgba(24, 24, 27, 0.2)", glassBg: "rgba(255, 255, 255, 0.92)" },
  { name: "Titanium Studio", primary: "#3b82f6", secondary: "#64748b", accent: "#1e293b", gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", cardBg: "#ffffff", dark: false, category: "Minimalist & Clean", layout: "minimalist", borderGlow: "rgba(59, 130, 246, 0.25)", glassBg: "rgba(255, 255, 255, 0.9)" },
  { name: "Desert Sand", primary: "#b45309", secondary: "#d97706", accent: "#92400e", gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", cardBg: "#ffffff", dark: false, category: "Minimalist & Clean", layout: "minimalist", borderGlow: "rgba(180, 83, 9, 0.25)", glassBg: "rgba(255, 255, 255, 0.9)" },
  { name: "Botanical Sage", primary: "#15803d", secondary: "#22c55e", accent: "#86efac", gradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", cardBg: "#ffffff", dark: false, category: "Minimalist & Clean", layout: "minimalist", borderGlow: "rgba(21, 128, 61, 0.25)", glassBg: "rgba(255, 255, 255, 0.9)" }
];

export const THEMES = [];

// Generate full 100 Themes
for (let i = 1; i <= 100; i++) {
  const baseIndex = (i - 1) % PALETTE_TEMPLATES.length;
  const base = PALETTE_TEMPLATES[baseIndex];
  const cycle = Math.floor((i - 1) / PALETTE_TEMPLATES.length);

  let themeName = `Theme ${i}: ${base.name}`;
  let cat = base.category;
  let layout = base.layout;

  if (cycle === 1) {
    themeName += " Wave Edition";
    layout = "glassmorphic";
  } else if (cycle === 2) {
    themeName += " Dark Edge";
    cat = "Dark & Cyber Glow";
    layout = "cyber";
  } else if (cycle === 3) {
    themeName += " Neo-Executive";
    layout = "executive";
  } else if (cycle === 4) {
    themeName += " High-Energy Split";
    layout = "split";
  }

  // Exact match for Theme 26 shown in Demo / Video
  if (i === 26) {
    themeName = "Theme 26: DesiCard Sunset (Video Featured)";
    cat = "Vibrant Gradients";
    layout = "executive";
  }

  const isDark = base.dark || cycle === 2 || (cycle === 4 && i % 2 === 0);

  THEMES.push({
    id: i,
    name: themeName,
    category: cat,
    layoutStyle: layout,
    primary: base.primary,
    secondary: base.secondary,
    accent: base.accent,
    gradient: base.gradient,
    cardBg: isDark ? (base.dark ? base.cardBg : "#0f172a") : base.cardBg,
    dark: isDark,
    textColor: isDark ? "#f8fafc" : "#1e293b",
    subtextColor: isDark ? "#94a3b8" : "#64748b",
    buttonBg: base.primary,
    buttonText: isDark && base.primary === "#ffffff" ? "#000000" : "#ffffff",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.07)",
    borderGlow: base.borderGlow || (isDark ? "rgba(56, 189, 248, 0.3)" : "rgba(0, 0, 0, 0.1)"),
    glassBg: isDark ? "rgba(15, 23, 42, 0.78)" : (base.glassBg || "rgba(255, 255, 255, 0.85)"),
    accentBg: base.primary
  });
}

export function getThemeById(id) {
  const num = parseInt(id) || 26;
  return THEMES.find(t => t.id === num) || THEMES[25]; // default 26
}
