"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/auth";
import { LOGIN } from "../constants/routes";
import { useRouter } from "next/navigation";

export default function NavbarLayout() {
  const router = useRouter();
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
    router.push(LOGIN);
  };

  return (
    <>
      <Navbar onClickMenu={handleClickMenu} onLogout={handleLogout} />
      <Sidebar open={open} onClose={handleClose} onLogout={handleLogout} />
    </>
  );
}
