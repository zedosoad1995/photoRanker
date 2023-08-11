/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
        "light-contour": "#e5e7eb",
        "disabled-button-text": "rgba(0, 0, 0, 0.26)",
        "disabled-button-bg": "rgba(0, 0, 0, 0.12)",
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
