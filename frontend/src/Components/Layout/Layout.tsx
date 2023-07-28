import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/Contexts/auth";
import { LOGIN, REGISTER } from "@/constants/routes";
import { Outlet, useNavigate } from "react-router-dom";
import { getLoggedUser } from "@/Utils/user";

export default function Layout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickMenu = () => {
    setOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate(LOGIN);
  };

  const user = getLoggedUser();
  useEffect(() => {
    if (!user) {
      navigate(LOGIN);
    } else if (user.isProfileCompleted === false) {
      navigate(REGISTER);
    }
  }, []);

  if (!user || user.isProfileCompleted === false) {
    return <></>;
  }

  return (
    <>
      <Navbar onClickMenu={handleClickMenu} onLogout={handleLogout} />
      <Sidebar open={open} onClose={handleClose} onLogout={handleLogout} />
      <div className="p-4 md:p-12 h-[calc(100%-4rem)]">
        <Outlet />
      </div>
    </>
  );
}
