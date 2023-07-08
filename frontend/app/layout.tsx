import { AuthProvider } from "../contexts/auth";
import "./global.css";

export const metadata = {};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <html className="h-full bg-white" lang="en">
        <body className="h-full text-normal-text">{children}</body>
      </html>
    </AuthProvider>
  );
};

export default RootLayout;
