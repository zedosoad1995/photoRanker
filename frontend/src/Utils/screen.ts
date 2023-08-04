import defaultTheme from "tailwindcss/defaultTheme";

export const isScreenSmallerOrEqualTo = (size: "sm" | "md" | "lg" | "xl" | "2xl") => {
  return window.innerWidth < Number(defaultTheme.screens[size].slice(0, -2));
};
