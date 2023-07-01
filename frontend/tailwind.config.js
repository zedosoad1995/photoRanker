/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#4f46e5",
        "primary-hover": "#6366f1",
        "normal-text": "#111827",
        "light-text": "#6b7280",
        "placeholder-text": "#9ca3af",
        "normal-contour": "#d1d5db",
      },
      fontSize: {
        label: ["0.875rem", "1.25rem"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
