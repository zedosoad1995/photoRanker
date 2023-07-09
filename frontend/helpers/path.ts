import { headers } from "next/headers";

export const getPathname = () => {
  const headersList = headers();
  const fullUrl = headersList.get("referer") || "";
  const [, pathname] = fullUrl.match(/^https?:\/\/[^/]+(\/[^?#]*)/i) || [];

  return pathname;
};
