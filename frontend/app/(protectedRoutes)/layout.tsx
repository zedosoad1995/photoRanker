import { LOGIN, NON_PROTECTED_ROUTES } from "@/constants/routes";
import { getMe } from "@/services/auth";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import NavbarLayout from "@/components/NavbarLayout";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const headersList = headers();
  const fullUrl = headersList.get("referer") || "";
  const [, pathname] = fullUrl.match(/^https?:\/\/[^/]+(\/[^?#]*)/i) || [];

  if (!NON_PROTECTED_ROUTES.includes(pathname)) {
    await getMe(cookies().toString()).catch(() => {
      return redirect(LOGIN);
    });
  }

  return (
    <>
      <NavbarLayout />
      <div className="p-12">{children}</div>
    </>
  );
};

export default Layout;
