import { Bars3Icon } from "@heroicons/react/20/solid";
import Button from "./Button";

export default function Navbar() {
  return (
    <nav className="top-0 bg-white border-b border-light-contour px-6 h-16 flex">
      <div className="flex sm:hidden items-center gap-8 justify-end w-full">
        <Bars3Icon className="h-6 w-6 cursor-pointer" />
      </div>
      <div className="hidden sm:flex items-center justify-between gap-8 w-full">
        <div className="text-lg font-semibold hover:text-primary-hover cursor-pointer">Vote</div>
        <div className="flex-1 text-lg font-semibold hover:text-primary-hover cursor-pointer">
          My Photos
        </div>
        <div className="">
          <Button size="large">Logout</Button>
        </div>
      </div>
    </nav>
  );
}
