import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        muted: "#5b6875",
        paper: "#fbfaf7",
        line: "#dfe5e8",
        mint: "#18a57a",
        ocean: "#2563eb",
        sun: "#f4b740",
        blush: "#f06f6f"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 33, 43, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
