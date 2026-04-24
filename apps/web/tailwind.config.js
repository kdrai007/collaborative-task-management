/** @type {import('tailwindcss').Config} */
// NOTE: This project uses Tailwind v4. The primary source of truth for design
// tokens is the `@theme` block in `src/index.css`. These color values reference
// the CSS custom properties defined in `:root` and `.dark` so they automatically
// respond to dark mode — no hardcoded hex values here.
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Surface Hierarchy (DESIGN.md §2 "Surface Hierarchy & Nesting") ──
        // The "floor" of the application
        "surface":                    "var(--surface)",
        // Used for large structural areas like sidebars (Level 1)
        "surface-container-low":      "var(--surface-container-low)",
        // Primary workspace / "Board" (Level 2)
        "surface-container":          "var(--surface-container)",
        // Active task cards / floating modals (Level 3)
        "surface-container-highest":  "var(--surface-container-highest)",
        // Intermediate lift — sits between level 1 and level 3
        "surface-container-high":     "var(--surface-container-high)",
        // Pure white in light / darkest navy in dark — for inner card surfaces
        "surface-container-lowest":   "var(--surface-container-lowest)",
        // Glassmorphic nav background (Glass & Gradient rule)
        "surface-bright":             "var(--surface-bright)",
        // surface-dim for muted tonal areas
        "surface-dim":                "var(--surface-dim)",
        // Tint overlay applied on top of surfaces for elevation
        "surface-tint":               "var(--surface-tint)",
        // Inverse surface for tooltips / snackbars
        "inverse-surface":            "var(--inverse-surface)",

        // ── On-Surface Text Colors ──────────────────────────────────────────
        // Primary text — navy-charcoal (never pure #000)
        "on-surface":                 "var(--on-surface)",
        // Secondary text / metadata — muted blue-grey
        "on-surface-variant":         "var(--on-surface-variant)",
        // Inverse text applied over inverse-surface
        "inverse-on-surface":         "var(--inverse-on-surface)",
        // Backgrounds (alias of surface for semantic clarity)
        "background":                 "var(--background)",
        "on-background":              "var(--on-background)",

        // ── Primary Brand ───────────────────────────────────────────────────
        // "Deep Indigo" — the pulse of the system (#3525cd light / #4f46e5 dark)
        "primary":                    "var(--primary)",
        "on-primary":                 "var(--on-primary)",
        // Used for the "Pulse Gradient" CTA (#4f46e5)
        "primary-container":          "var(--primary-container)",
        "on-primary-container":       "var(--on-primary-container)",
        "primary-fixed":              "var(--primary-fixed)",
        "primary-fixed-dim":          "var(--primary-fixed-dim)",
        "on-primary-fixed":           "var(--on-primary-fixed)",
        "on-primary-fixed-variant":   "var(--on-primary-fixed-variant)",
        "inverse-primary":            "var(--inverse-primary)",

        // ── Secondary ───────────────────────────────────────────────────────
        "secondary":                  "var(--secondary)",
        "on-secondary":               "var(--on-secondary)",
        "secondary-container":        "var(--secondary-container)",
        "on-secondary-container":     "var(--on-secondary-container)",
        "secondary-fixed":            "var(--secondary-fixed)",
        "secondary-fixed-dim":        "var(--secondary-fixed-dim)",
        "on-secondary-fixed":         "var(--on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",

        // ── Tertiary (Collaborative Presence indicators, #004d70) ───────────
        "tertiary":                   "var(--tertiary)",
        "on-tertiary":                "var(--on-tertiary)",
        "tertiary-container":         "var(--tertiary-container)",
        "on-tertiary-container":      "var(--on-tertiary-container)",
        "tertiary-fixed":             "var(--tertiary-fixed)",
        "tertiary-fixed-dim":         "var(--tertiary-fixed-dim)",
        "on-tertiary-fixed":          "var(--on-tertiary-fixed)",
        "on-tertiary-fixed-variant":  "var(--on-tertiary-fixed-variant)",

        // ── Error ───────────────────────────────────────────────────────────
        "error":                      "var(--error)",
        "on-error":                   "var(--on-error)",
        "error-container":            "var(--error-container)",
        "on-error-container":         "var(--on-error-container)",

        // ── Outline / Ghost Borders (DESIGN.md §4 "Ghost Border Fallback") ──
        // At 15% opacity (applied as outline-variant/15) — never 100% opaque
        "outline":                    "var(--outline)",
        "outline-variant":            "var(--outline-variant)",

        // ── Surface Variant ─────────────────────────────────────────────────
        "surface-variant":            "var(--surface-variant)",
      },

      fontFamily: {
        // Display & Headlines — geometric, editorial (DESIGN.md §3)
        "headline": ["Manrope", "sans-serif"],
        // Functional UI text — exceptional legibility at small sizes
        "body":     ["Inter", "sans-serif"],
        "label":    ["Inter", "sans-serif"],
      },

      borderRadius: {
        // Matches DESIGN.md §5 Buttons: rounded-md = 0.75rem
        "DEFAULT": "0.25rem",
        "lg":      "0.5rem",
        "xl":      "0.75rem",
        "full":    "9999px",
      },

      boxShadow: {
        // DESIGN.md §4 Ambient Shadows — tinted with on-surface, never pure grey
        "ambient": "0px 20px 40px rgba(11, 28, 48, 0.06)",
      },
    },
  },
  plugins: [],
}
