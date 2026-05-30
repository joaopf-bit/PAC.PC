/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal do PAC
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          400: "#818cf8",
          500: "#6366f1",  // cor primária
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        surface: {
          DEFAULT: "#0f1117",  // fundo principal (dark)
          card:    "#1a1d27",  // cards
          hover:   "#1f2235",  // hover state
          border:  "#2a2d3e",  // bordas
        },
        // Status das submissões
        verdict: {
          accepted:    "#22c55e",
          wrong:       "#ef4444",
          tle:         "#f97316",
          mle:         "#a855f7",
          error:       "#ec4899",
          pending:     "#64748b",
          processing:  "#3b82f6",
        },
        // Dificuldade dos problemas
        difficulty: {
          easy:   "#22c55e",
          medium: "#f59e0b",
          hard:   "#ef4444",
          expert: "#a855f7",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      animation: {
        "fade-in":     "fadeIn 0.4s ease-out forwards",
        "slide-up":    "slideUp 0.4s ease-out forwards",
        "pulse-brand": "pulseBrand 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulseBrand: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.4)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(99, 102, 241, 0)" },
        },
      },
    },
  },
  plugins: [],
};
