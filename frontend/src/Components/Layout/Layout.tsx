import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/Contexts/auth";
import { HOME, LOGIN } from "@/Constants/routes";
import { Outlet, useNavigate } from "react-router-dom";
import CreateProfile from "../CreateProfile";
import UnverifiedEmail from "../UnverifiedEmail";

export default function Layout() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

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

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate(LOGIN);
      } else if (!user.isProfileCompleted || !user.isEmailVerified) {
        navigate(HOME);
      }
    }
  }, [loading, user]);

  if (loading || !user) {
    return <></>;
  } else if (!user.isProfileCompleted) {
    return (
      <>
        <Navbar onLogout={handleLogout} isProfileCreated={false} />
        <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center p-4 md:p-12">
          <CreateProfile />
        </div>
      </>
    );
  } else if (!user.isEmailVerified) {
    return (
      <>
        <Navbar onLogout={handleLogout} isProfileCreated={false} />
        <div className="p-4 md:p-12">
          <UnverifiedEmail />
        </div>
      </>
    );
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
