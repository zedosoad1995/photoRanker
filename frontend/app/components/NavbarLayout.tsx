"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function NavbarLayout() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickMenu = () => {
    setOpen(true);
  };

  return (
    <>
      <Navbar onClickMenu={handleClickMenu} />
      <Sidebar open={open} onClose={handleClose} />
    </>
  );
}
