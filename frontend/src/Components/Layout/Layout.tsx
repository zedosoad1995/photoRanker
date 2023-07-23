import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/Contexts/auth";
import { LOGIN } from "@/constants/routes";
import { Outlet, useNavigate } from "react-router-dom";

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

  const user = localStorage.getItem("user");
  useEffect(() => {
    if (!user) {
      navigate(LOGIN);
    }
  }, []);

  if (!user) {
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
