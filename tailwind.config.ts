import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        "muted-2": "var(--muted-2)",
        faint: "var(--faint)",
        teal: "var(--teal)",
        orange: "var(--orange)",
        yellow: "var(--yellow)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 18px 40px -28px rgba(20,20,20,0.4)",
        glass: "0 10px 30px rgba(15,15,16,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
