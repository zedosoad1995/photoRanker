import defaultTheme from "tailwindcss/defaultTheme";

export const isScreenSmallerOrEqualTo = (size: "sm" | "md" | "lg" | "xl" | "2xl" | number) => {
  if (typeof size === "number") {
    return window.innerWidth < size;
  }

  return window.innerWidth < Number(defaultTheme.screens[size].slice(0, -2));
};
