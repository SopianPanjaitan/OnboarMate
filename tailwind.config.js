/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* OnboardMate design tokens */
        brand: {
          navy: "#1B2B4B",      /* primary navy blue */
          "navy-dark": "#12203A",
          "navy-light": "#243459",
          blue: "#3B82F6",      /* soft accent blue */
          "blue-light": "#EFF6FF",
          "blue-muted": "#93C5FD",
        },
        surface: {
          white: "#FFFFFF",
          gray: "#F8FAFC",       /* light neutral gray */
          "gray-mid": "#F1F5F9",
          border: "#E2E8F0",
        },
        text: {
          primary: "#1E293B",
          secondary: "#64748B",
          muted: "#94A3B8",
          inverse: "#FFFFFF",
        },
        status: {
          success: "#16A34A",
          "success-bg": "#DCFCE7",
          warning: "#D97706",
          "warning-bg": "#FEF3C7",
          error: "#DC2626",
          "error-bg": "#FEE2E2",
          info: "#2563EB",
          "info-bg": "#DBEAFE",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
