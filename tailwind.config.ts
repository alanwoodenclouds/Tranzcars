import type { Config } from "tailwindcss";

/**
 * Light Premium Skeuomorphic — locked palette.
 * Surface elevation uses borders only — no box-shadow utilities.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--bg-base)",
        "surface-panel": "var(--surface-panel)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
        "brand-orange": "var(--brand-orange)",
        /* Semantic aliases used across the app */
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: "var(--brand)",
        muted: "var(--muted)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        ring: "var(--ring)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        ink: "var(--text-main)",
        teal: "#1a6b63",
        "teal-deep": "#0d3d39",
        chrome: "#CBD5E1",
        amber: "#ED5527",
        "amber-soft": "#FF6F47",
        onyx: "var(--text-main)",
        leather: "#F0F3F7",
        lacquer: "var(--surface-panel)",
      },
      borderRadius: {
        panel: "24px",
        inset: "12px",
        pill: "99px",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        gauge: [
          "Arial Narrow",
          "Helvetica Condensed",
          "Roboto Condensed",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "brushed-silver": "var(--brushed-silver)",
      },
    },
  },
  plugins: [],
};

export default config;
