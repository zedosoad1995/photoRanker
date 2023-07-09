import { LOGIN, NON_PROTECTED_ROUTES } from "@/constants/routes";
import { getMe } from "@/services/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import NavbarLayout from "@/components/NavbarLayout";
import { getPathname } from "@/helpers/path";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  if (!NON_PROTECTED_ROUTES.includes(getPathname())) {
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
