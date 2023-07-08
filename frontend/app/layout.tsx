import "./global.css";

export const metadata = {};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="h-full bg-white" lang="en">
      <body className="h-full text-normal-text">{children}</body>
    </html>
  );
};

export default RootLayout;
