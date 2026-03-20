import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        bg: "#0a0a0f",
        surface: "#111118",
        "surface-2": "#1a1a24",
        "surface-3": "#22222f",
        border: "#2a2a3a",
        "border-bright": "#3a3a50",
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        text: {
          primary: "#e8e8f0",
          muted: "#7878a0",
          dim: "#4a4a6a",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease",
        "slide-up": "slideUp 0.3s ease",
        "pulse-amber": "pulseAmber 2s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseAmber: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(251,191,36,0.2)" },
          "50%": { boxShadow: "0 0 0 6px rgba(251,191,36,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
