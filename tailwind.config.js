// tailwind.config.js — versão atualizada com tokens do design system do Stitch
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Paleta Material You do design system do Stitch ──────
      colors: {
        // Primárias
        "primary":               "#003ec7",
        "on-primary":            "#ffffff",
        "primary-container":     "#0052ff",
        "on-primary-container":  "#dfe3ff",
        "inverse-primary":       "#b7c4ff",
        "primary-fixed":         "#dde1ff",
        "primary-fixed-dim":     "#b7c4ff",
        "on-primary-fixed":      "#001452",
        "on-primary-fixed-variant": "#0038b6",
        "surface-tint":          "#004ced",

        // Secundárias
        "secondary":             "#505f76",
        "on-secondary":          "#ffffff",
        "secondary-container":   "#d0e1fb",
        "on-secondary-container":"#54647a",
        "secondary-fixed":       "#d3e4fe",
        "secondary-fixed-dim":   "#b7c8e1",
        "on-secondary-fixed":    "#0b1c30",
        "on-secondary-fixed-variant": "#38485d",

        // Terciárias
        "tertiary":              "#4b4e50",
        "on-tertiary":           "#ffffff",
        "tertiary-container":    "#636668",
        "on-tertiary-container": "#e2e4e6",
        "tertiary-fixed":        "#e0e3e5",
        "tertiary-fixed-dim":    "#c4c7c9",
        "on-tertiary-fixed":     "#191c1e",
        "on-tertiary-fixed-variant": "#444749",

        // Superfícies
        "background":            "#faf8ff",
        "on-background":         "#131b2e",
        "surface":               "#faf8ff",
        "surface-dim":           "#d2d9f4",
        "surface-bright":        "#faf8ff",
        "surface-variant":       "#dae2fd",
        "on-surface":            "#131b2e",
        "on-surface-variant":    "#434656",
        "surface-container-lowest":  "#ffffff",
        "surface-container-low":     "#f2f3ff",
        "surface-container":         "#eaedff",
        "surface-container-high":    "#e2e7ff",
        "surface-container-highest": "#dae2fd",
        "inverse-surface":       "#283044",
        "inverse-on-surface":    "#eef0ff",

        // Bordas
        "outline":               "#737688",
        "outline-variant":       "#c3c5d9",

        // Erro
        "error":                 "#ba1a1a",
        "on-error":              "#ffffff",
        "error-container":       "#ffdad6",
        "on-error-container":    "#93000a",

        // Status de veredicto (extras PAC)
        verdict: {
          accepted:   "#22c55e",
          wrong:      "#ef4444",
          tle:        "#f97316",
          mle:        "#a855f7",
          error:      "#ec4899",
          pending:    "#64748b",
          processing: "#3b82f6",
        },

        // Dificuldade dos problemas (extras PAC)
        difficulty: {
          easy:   "#22c55e",
          medium: "#f59e0b",
          hard:   "#ef4444",
          expert: "#a855f7",
        },
      },

      // ── Tipografia ───────────────────────────────────────────
      fontFamily: {
        "sans":            ["Inter", "system-ui", "sans-serif"],
        "inter":           ["Inter", "sans-serif"],
        "grotesk":         ["Hanken Grotesk", "sans-serif"],
        "mono":            ["JetBrains Mono", "monospace"],
        "titulo-lg":       ["Hanken Grotesk"],
        "titulo-md":       ["Hanken Grotesk"],
        "titulo-sm":       ["Hanken Grotesk"],
        "corpo-principal": ["Inter"],
        "corpo-secundario":["Inter"],
        "etiqueta-mono":   ["JetBrains Mono"],
      },

      fontSize: {
        "titulo-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "titulo-md": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "titulo-sm": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "corpo-principal":  ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "corpo-secundario": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "etiqueta-mono":    ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },

      // ── Border Radius (do Stitch) ────────────────────────────
      borderRadius: {
        DEFAULT: "0.125rem",
        sm:      "0.125rem",
        md:      "0.375rem",
        lg:      "0.25rem",
        xl:      "0.5rem",
        "2xl":   "1rem",
        full:    "9999px",
      },

      // ── Espaçamento ──────────────────────────────────────────
      spacing: {
        base:             "4px",
        xs:               "8px",
        sm:               "16px",
        md:               "24px",
        lg:               "40px",
        xl:               "64px",
        gutter:           "24px",
        margin_mobile:    "16px",
        margin_desktop:   "32px",
        sidebar_expanded: "280px",
        sidebar_collapsed:"72px",
      },
    },
  },
  plugins: [],
};
