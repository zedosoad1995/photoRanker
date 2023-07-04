/** @type {import('tailwindcss').Config} */

import "tailwindcss/colors";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
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
        "primary-text": "#312e81",
        "primary-contrast": "#e0e7ff",
        "normal-text": "#111827",
        "light-text": "#6b7280",
        "placeholder-text": "#9ca3af",
        "normal-contour": "#d1d5db",
        danger: "#D63230",
      },
      fontSize: {
        label: ["0.875rem", "1.25rem"],
        "error-text": "13px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
