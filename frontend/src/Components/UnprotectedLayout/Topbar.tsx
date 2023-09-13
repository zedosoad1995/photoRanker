import Logo from "../Logo";

export default function Topbar() {
  return (
    <nav className="top-0 bg-white border-b border-light-contour px-4 sm:px-8 lg:px-12 h-16 flex">
      <Logo />
    </nav>
  );
}
