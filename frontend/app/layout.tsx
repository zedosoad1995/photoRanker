import "./global.css";

export const metadata = {};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full bg-white" lang="en">
      <body className="h-full">{children}</body>
    </html>
  );
}
