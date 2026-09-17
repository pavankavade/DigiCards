// 100 Themes Engine for Digital Business Card Portal
// Supports 100 distinct styled themes with gradients, dark modes, luxury accents, and dynamic CSS variables

const THEMES_LIST = [];

// Base color palettes and design variations to generate 100 rich themes
const BASE_PALETTES = [
    { name: "Sunset Gold", p: "#f97316", s: "#eab308", a: "#ea580c", bg: "linear-gradient(135deg, #ff7e5f, #feb47b)", cardBg: "#ffffff", dark: false },
    { name: "Emerald Forest", p: "#059669", s: "#10b981", a: "#047857", bg: "linear-gradient(135deg, #0ba360, #3cba92)", cardBg: "#ffffff", dark: false },
    { name: "Royal Purple", p: "#7c3aed", s: "#a855f7", a: "#6d28d9", bg: "linear-gradient(135deg, #7F00FF, #E100FF)", cardBg: "#ffffff", dark: false },
    { name: "Midnight Obsidian", p: "#38bdf8", s: "#818cf8", a: "#0284c7", bg: "linear-gradient(135deg, #0f172a, #1e293b)", cardBg: "#111827", dark: true },
    { name: "Cyber Neon", p: "#06b6d4", s: "#ec4899", a: "#0891b2", bg: "linear-gradient(135deg, #00f2fe, #4facfe)", cardBg: "#0f172a", dark: true },
    { name: "Luxury Gold", p: "#d97706", s: "#f59e0b", a: "#b45309", bg: "linear-gradient(135deg, #1c1917, #292524)", cardBg: "#18181b", dark: true, gold: true },
    { name: "Ruby Crimson", p: "#e11d48", s: "#f43f5e", a: "#be123c", bg: "linear-gradient(135deg, #ff0844, #ffb199)", cardBg: "#ffffff", dark: false },
    { name: "Oceanic Blue", p: "#2563eb", s: "#3b82f6", a: "#1d4ed8", bg: "linear-gradient(135deg, #2b5876, #4e4376)", cardBg: "#ffffff", dark: false },
    { name: "Velvet Plum", p: "#9333ea", s: "#c084fc", a: "#7e22ce", bg: "linear-gradient(135deg, #654ea3, #eaafc8)", cardBg: "#ffffff", dark: false },
    { name: "Electric Lime", p: "#65a30d", s: "#84cc16", a: "#4d7c0f", bg: "linear-gradient(135deg, #134e5e, #71b280)", cardBg: "#ffffff", dark: false },
    { name: "Deep Space", p: "#6366f1", s: "#a855f7", a: "#4f46e5", bg: "linear-gradient(135deg, #000428, #004e92)", cardBg: "#0a0f1d", dark: true },
    { name: "Citrus Punch", p: "#ea580c", s: "#f97316", a: "#c2410c", bg: "linear-gradient(135deg, #f12711, #f5af19)", cardBg: "#ffffff", dark: false },
    { name: "Rose Quartz", p: "#db2777", s: "#f472b6", a: "#be185d", bg: "linear-gradient(135deg, #f857a6, #ff5858)", cardBg: "#ffffff", dark: false },
    { name: "Aqua Marine", p: "#0d9488", s: "#14b8a6", a: "#0f766e", bg: "linear-gradient(135deg, #13547a, #80d0c7)", cardBg: "#ffffff", dark: false },
    { name: "Dark Carbon", p: "#e2e8f0", s: "#94a3b8", a: "#f8fafc", bg: "linear-gradient(135deg, #232526, #414345)", cardBg: "#1e293b", dark: true },
    { name: "Cosmic Indigo", p: "#4f46e5", s: "#818cf8", a: "#3730a3", bg: "linear-gradient(135deg, #373b44, #4286f4)", cardBg: "#ffffff", dark: false },
    { name: "Tangerine Glow", p: "#f97316", s: "#fb923c", a: "#ea580c", bg: "linear-gradient(135deg, #ff9966, #ff5e62)", cardBg: "#ffffff", dark: false },
    { name: "Mint Fresh", p: "#10b981", s: "#34d399", a: "#059669", bg: "linear-gradient(135deg, #00b09b, #96c93d)", cardBg: "#ffffff", dark: false },
    { name: "Black & Neon Yellow", p: "#eab308", s: "#facc15", a: "#ca8a04", bg: "linear-gradient(135deg, #18181b, #000000)", cardBg: "#09090b", dark: true },
    { name: "Lavender Dream", p: "#8b5cf6", s: "#a78bfa", a: "#7c3aed", bg: "linear-gradient(135deg, #a18cd1, #fbc2eb)", cardBg: "#ffffff", dark: false }
];

// Generate exactly 100 themes with variation permutations
for (let i = 1; i <= 100; i++) {
    const base = BASE_PALETTES[(i - 1) % BASE_PALETTES.length];
    const cycle = Math.floor((i - 1) / BASE_PALETTES.length);
    
    let styleName = `${base.name}`;
    if (cycle === 1) styleName += " Wave";
    else if (cycle === 2) styleName += " Dark Edge";
    else if (cycle === 3) styleName += " Minimalist";
    else if (cycle === 4) styleName += " Neo Modern";

    // Specific match for Theme 26 shown in video: Vibrant Sunset Orange
    if (i === 26) {
        styleName = "Sunset Dynamic (DesiCard Default)";
    }

    THEMES_LIST.push({
        id: i,
        cssFile: `card_css${i}.css`,
        name: `Theme ${i}: ${styleName}`,
        primary: base.p,
        secondary: base.s,
        accent: base.a,
        bgGradient: base.bg,
        cardBg: cycle % 2 === 1 && !base.dark ? "#f8fafc" : base.cardBg,
        dark: base.dark || cycle === 2,
        textColor: (base.dark || cycle === 2) ? "#f1f5f9" : "#1e293b",
        subTextColor: (base.dark || cycle === 2) ? "#94a3b8" : "#64748b",
        navBg: (base.dark || cycle === 2) ? "#111827" : base.p,
        buttonBg: base.p,
        buttonColor: "#ffffff",
        headerStyle: cycle === 0 ? "gradient" : cycle === 1 ? "curve-wave" : cycle === 2 ? "diagonal" : "clean-pill"
    });
}

// Function to generate the CSS string for a theme
function getThemeCSS(themeId) {
    const t = THEMES_LIST.find(x => x.id === parseInt(themeId)) || THEMES_LIST[25]; // default 26 (index 25)
    return `
        :root {
            --theme-primary: ${t.primary};
            --theme-secondary: ${t.secondary};
            --theme-accent: ${t.accent};
            --theme-card-bg: ${t.cardBg};
            --theme-text: ${t.textColor};
            --theme-subtext: ${t.subTextColor};
            --theme-btn-bg: ${t.buttonBg};
            --theme-btn-color: ${t.buttonColor};
            --theme-nav-bg: ${t.navBg};
            --theme-bg-gradient: ${t.bgGradient};
        }
        .card-container {
            background-color: var(--theme-card-bg) !important;
            color: var(--theme-text) !important;
        }
        .card-header-banner {
            background: var(--theme-bg-gradient) !important;
        }
        .quick-action-btn {
            background: var(--theme-btn-bg) !important;
            color: var(--theme-btn-color) !important;
            box-shadow: 0 4px 14px ${t.primary}40 !important;
        }
        .theme-accent-bg {
            background: var(--theme-primary) !important;
            color: #ffffff !important;
        }
        .theme-accent-text {
            color: var(--theme-primary) !important;
        }
        .bottom-nav-bar {
            background: var(--theme-nav-bg) !important;
        }
        .bottom-nav-bar a.active, .bottom-nav-bar a:hover {
            color: ${t.dark ? '#38bdf8' : '#ffffff'} !important;
        }
        .product-card {
            border-top: 3px solid var(--theme-primary) !important;
        }
        .order-btn-whatsapp {
            background: #25D366 !important;
            color: white !important;
        }
    `;
}

// Export for browser and node
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { THEMES_LIST, getThemeCSS };
}
