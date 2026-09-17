// 100 Modern Curated Themes for Digital Business Cards

const PALETTE_TEMPLATES = [
  { name: "Sunset Blaze", primary: "#f97316", secondary: "#f59e0b", accent: "#ea580c", gradient: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)", cardBg: "#ffffff", dark: false, category: "Popular" },
  { name: "Emerald Royale", primary: "#059669", secondary: "#10b981", accent: "#047857", gradient: "linear-gradient(135deg, #059669 0%, #34d399 100%)", cardBg: "#ffffff", dark: false, category: "Popular" },
  { name: "Royal Amethyst", primary: "#7c3aed", secondary: "#a855f7", accent: "#6d28d9", gradient: "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)", cardBg: "#ffffff", dark: false, category: "Popular" },
  { name: "Midnight Stealth", primary: "#38bdf8", secondary: "#818cf8", accent: "#0284c7", gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", cardBg: "#0f172a", dark: true, category: "Dark & Cyber" },
  { name: "Cyberpunk 2077", primary: "#06b6d4", secondary: "#ec4899", accent: "#f43f5e", gradient: "linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)", cardBg: "#090d16", dark: true, category: "Dark & Cyber" },
  { name: "Luxury 24K Gold", primary: "#d97706", secondary: "#f59e0b", accent: "#b45309", gradient: "linear-gradient(135deg, #1c1917 0%, #292524 100%)", cardBg: "#141417", dark: true, category: "Luxury" },
  { name: "Oceanic Depth", primary: "#2563eb", secondary: "#60a5fa", accent: "#1d4ed8", gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", cardBg: "#ffffff", dark: false, category: "Popular" },
  { name: "Velvet Crimson", primary: "#e11d48", secondary: "#fb7185", accent: "#be123c", gradient: "linear-gradient(135deg, #be123c 0%, #f43f5e 100%)", cardBg: "#ffffff", dark: false, category: "Popular" },
  { name: "Carbon Fiber Tech", primary: "#e2e8f0", secondary: "#94a3b8", accent: "#38bdf8", gradient: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", cardBg: "#18181b", dark: true, category: "Dark & Cyber" },
  { name: "Frosted Mint", primary: "#0d9488", secondary: "#2dd4bf", accent: "#0f766e", gradient: "linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)", cardBg: "#ffffff", dark: false, category: "Creative Vibrant" },
  { name: "Titanium White", primary: "#3b82f6", secondary: "#64748b", accent: "#1e293b", gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", cardBg: "#ffffff", dark: false, category: "Minimalist" },
  { name: "Tangerine Neon", primary: "#ff5e62", secondary: "#ff9966", accent: "#ea580c", gradient: "linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)", cardBg: "#ffffff", dark: false, category: "Creative Vibrant" },
  { name: "Neon Lime Matrix", primary: "#84cc16", secondary: "#a3e635", accent: "#65a30d", gradient: "linear-gradient(135deg, #052e16 0%, #14532d 100%)", cardBg: "#022c22", dark: true, category: "Dark & Cyber" },
  { name: "Rose Gold Elegance", primary: "#be185d", secondary: "#f472b6", accent: "#9d174d", gradient: "linear-gradient(135deg, #4c0519 0%, #881337 100%)", cardBg: "#1a030c", dark: true, category: "Luxury" },
  { name: "Cosmic Nebula", primary: "#8b5cf6", secondary: "#d946ef", accent: "#6366f1", gradient: "linear-gradient(135deg, #312e81 0%, #701a75 100%)", cardBg: "#0f0d24", dark: true, category: "Dark & Cyber" },
  { name: "Nordic Minimal", primary: "#0284c7", secondary: "#38bdf8", accent: "#0369a1", gradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", cardBg: "#ffffff", dark: false, category: "Minimalist" },
  { name: "Desert Sand", primary: "#b45309", secondary: "#d97706", accent: "#92400e", gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", cardBg: "#ffffff", dark: false, category: "Minimalist" },
  { name: "Electric Indigo", primary: "#4f46e5", secondary: "#818cf8", accent: "#3730a3", gradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)", cardBg: "#ffffff", dark: false, category: "Popular" },
  { name: "Monochrome Black", primary: "#ffffff", secondary: "#a1a1aa", accent: "#71717a", gradient: "linear-gradient(135deg, #000000 0%, #18181b 100%)", cardBg: "#09090b", dark: true, category: "Minimalist" },
  { name: "Coral Sunset", primary: "#f43f5e", secondary: "#fb923c", accent: "#e11d48", gradient: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)", cardBg: "#ffffff", dark: false, category: "Creative Vibrant" }
];

export const THEMES = [];

for (let i = 1; i <= 100; i++) {
  const base = PALETTE_TEMPLATES[(i - 1) % PALETTE_TEMPLATES.length];
  const cycle = Math.floor((i - 1) / PALETTE_TEMPLATES.length);
  
  let themeName = `Theme ${i}: ${base.name}`;
  let cat = base.category;

  if (cycle === 1) {
    themeName += " Wave Edition";
    cat = "Gradient";
  } else if (cycle === 2) {
    themeName += " Dark Edge";
    cat = "Dark & Cyber";
  } else if (cycle === 3) {
    themeName += " Modern Frosted";
    cat = "Creative Vibrant";
  } else if (cycle === 4) {
    themeName += " Executive Pro";
    cat = "Luxury";
  }

  // Exact match for Theme 26 shown in YouTube Video!
  if (i === 26) {
    themeName = "Theme 26: DesiCard Sunset (Video Featured)";
    cat = "Popular";
  }

  const isDark = base.dark || cycle === 2 || (cycle === 4 && i % 2 === 0);

  THEMES.push({
    id: i,
    name: themeName,
    category: cat,
    cssFile: `card_css${i}.css`,
    primary: base.primary,
    secondary: base.secondary,
    accent: base.accent,
    gradient: base.gradient,
    cardBg: isDark ? (base.dark ? base.cardBg : "#111827") : "#ffffff",
    dark: isDark,
    textColor: isDark ? "#f8fafc" : "#1e293b",
    subtextColor: isDark ? "#94a3b8" : "#64748b",
    buttonBg: base.primary,
    buttonText: isDark && base.primary === "#ffffff" ? "#000000" : "#ffffff",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    accentBg: base.primary
  });
}

export function getThemeById(id) {
  const num = parseInt(id) || 26;
  return THEMES.find(t => t.id === num) || THEMES[25]; // default 26
}
