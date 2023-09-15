import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/Contexts/auth";
import { HOME, LOGIN } from "@/Constants/routes";
import { Outlet, useNavigate } from "react-router-dom";
import CreateProfile from "./CreateProfile";
import UnverifiedEmail from "./UnverifiedEmail";
import Banned from "./Banned";
import FullPageLoading from "../Loading/FullPageLoading";

export default function Layout() {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();

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
    if (!isLoading) {
      if (!user) {
        navigate(LOGIN);
      } else if (!user.isProfileCompleted || !user.isEmailVerified) {
        navigate(HOME);
      }
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return <FullPageLoading />;
  } else if (!user.isProfileCompleted) {
    return (
      <>
        <Navbar onLogout={handleLogout} isProfileCreated={false} />
        <div className="flex flex-col justify-center px-6 py-8">
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
  } else if (user.isBanned) {
    return (
      <>
        <Navbar onLogout={handleLogout} isProfileCreated={false} />
        <div className="p-4 md:p-12">
          <Banned email={user.email} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onClickMenu={handleClickMenu} onLogout={handleLogout} />
      <Sidebar open={open} onClose={handleClose} onLogout={handleLogout} />
      <div className="p-4 md:p-12 h-auto">
        <Outlet />
      </div>
    </>
  );
}
