"use client";

import { Bars3Icon } from "@heroicons/react/20/solid";
import Button from "./Button";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface INavbar {
  onClickMenu: () => void;
  onLogout: () => void;
}

const navbarOptions = [
  {
    label: "Vote",
    url: "/vote",
  },
  {
    label: "My Photos",
    url: "/photos",
  },
  {
    label: "Settings",
    url: "/settings",
  },
];

export default function Navbar({ onClickMenu: handleClickMenu, onLogout: handleLogout }: INavbar) {
  const pathname = usePathname();

  return (
    <nav className="top-0 bg-white border-b border-light-contour px-8 lg:px-12 h-16 flex">
      <div className="flex md:hidden items-center gap-8 justify-end w-full">
        <Bars3Icon onClick={handleClickMenu} className="h-6 w-6 cursor-pointer" />
      </div>
      <div className="hidden md:flex items-center justify-between gap-8 w-full">
        {navbarOptions.map((option, index) => {
          const isLast = index === navbarOptions.length - 1;
          const isCurrPath = pathname === option.url;

          return (
            <NextLink
              key={option.label}
              href={option.url}
              className={`text-lg font-semibold hover:text-primary-hover cursor-pointer ${
                isLast ? "flex-1" : ""
              } ${isCurrPath ? "text-primary-hover" : ""}`}
            >
              {option.label}
            </NextLink>
          );
        })}
        <div className="">
          <Button onClick={handleLogout} size="large">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
