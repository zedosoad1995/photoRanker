import { Bars3Icon } from "@heroicons/react/20/solid";
import Button from "../Button";
import { NavLink } from "react-router-dom";
import Logo from "../Logo";
import { VOTE } from "@/Constants/routes";

interface INavbar {
  onClickMenu?: () => void;
  onLogout: () => void;
  isProfileCreated?: boolean;
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

export default function Navbar({
  onClickMenu: handleClickMenu,
  onLogout: handleLogout,
  isProfileCreated = true,
}: INavbar) {
  return (
    <nav className="top-0 bg-primary border-b border-light-contour px-4 sm:px-8 lg:px-12 h-16 flex">
      {isProfileCreated && (
        <>
          <div className="flex w-full md:hidden justify-between items-center">
            <Logo navigatePath={VOTE} color="contrast" />
            <div className="flex items-center gap-8 justify-end">
              <Bars3Icon
                onClick={handleClickMenu}
                className="h-6 w-6 cursor-pointer text-white"
              />
            </div>
          </div>
          <div className="hidden md:flex items-center justify-between gap-8 w-full">
            {navbarOptions.map(({ label, url }) => (
              <NavLink
                key={label}
                to={url}
                className={({ isActive }) =>
                  `text-lg font-semibold cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-[#FFFFFFC0] hover:text-[#FFFFFFE0]"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="ml-auto">
              <button
                onClick={handleLogout}
                className={`text-lg font-semibold cursor-pointer text-[#FFFFFF] hover:text-[#FFFFFFE0]`}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
      {!isProfileCreated && (
        <div className="flex w-full justify-between items-center">
          <Logo navigatePath={VOTE} color="contrast" />
          <Button onClick={handleLogout} size="large" isFull={false}>
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
