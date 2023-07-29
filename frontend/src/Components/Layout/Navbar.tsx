import { Bars3Icon } from "@heroicons/react/20/solid";
import Button from "../Button";
import { NavLink } from "react-router-dom";

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
    <nav className="top-0 bg-white border-b border-light-contour px-8 lg:px-12 h-16 flex">
      {isProfileCreated && (
        <>
          <div className="flex md:hidden items-center gap-8 justify-end w-full">
            <Bars3Icon onClick={handleClickMenu} className="h-6 w-6 cursor-pointer" />
          </div>
          <div className="hidden md:flex items-center justify-between gap-8 w-full">
            {navbarOptions.map(({ label, url }, index) => {
              const isLast = index === navbarOptions.length - 1;

              return (
                <NavLink
                  key={label}
                  to={url}
                  className={({ isActive }) =>
                    `text-lg font-semibold hover:text-primary-hover cursor-pointer ${
                      isLast ? "flex-1" : ""
                    } ${isActive ? "text-primary-hover" : ""}`
                  }
                >
                  {label}
                </NavLink>
              );
            })}
            <div>
              <Button onClick={handleLogout} size="large">
                Logout
              </Button>
            </div>
          </div>
        </>
      )}
      {!isProfileCreated && (
        <div className="flex w-full items-center justify-end">
          <Button onClick={handleLogout} size="large" isFull={false}>
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
