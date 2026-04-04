/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "error": "#ba1a1a",
        "surface-container-low": "#eff4ff",
        "secondary-fixed-dim": "#b9c7e0",
        "error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#004c6e",
        "on-tertiary-container": "#b8e0ff",
        "on-surface": "#0b1c30",
        "secondary-container": "#d5e3fd",
        "on-primary-fixed": "#0f0069",
        "on-background": "#0b1c30",
        "on-error": "#ffffff",
        "on-primary-fixed-variant": "#3323cc",
        "outline": "#777587",
        "primary-fixed-dim": "#c3c0ff",
        "surface-container-highest": "#d3e4fe",
        "on-error-container": "#93000a",
        "tertiary-fixed": "#c9e6ff",
        "outline-variant": "#c7c4d8",
        "surface-dim": "#cbdbf5",
        "primary-fixed": "#e2dfff",
        "inverse-primary": "#c3c0ff",
        "secondary": "#515f74",
        "secondary-fixed": "#d5e3fd",
        "tertiary-container": "#006693",
        "on-secondary-fixed-variant": "#3a485c",
        "background": "#f8f9ff",
        "on-primary": "#ffffff",
        "tertiary-fixed-dim": "#89ceff",
        "on-surface-variant": "#464555",
        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#0d1c2f",
        "surface-variant": "#d3e4fe",
        "primary": "#3525cd",
        "on-primary-container": "#dad7ff",
        "on-tertiary": "#ffffff",
        "primary-container": "#4f46e5",
        "surface-bright": "#f8f9ff",
        "inverse-on-surface": "#eaf1ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#dce9ff",
        "on-tertiary-fixed": "#001e2f",
        "on-secondary-container": "#57657b",
        "inverse-surface": "#213145",
        "tertiary": "#004d70",
        "surface-tint": "#4d44e3",
        "surface-container": "#e5eeff",
        "surface": "#f8f9ff"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      boxShadow: {
        'ambient': '0px 20px 40px rgba(11, 28, 48, 0.06)'
      }
    },
  },
  plugins: [],
}
