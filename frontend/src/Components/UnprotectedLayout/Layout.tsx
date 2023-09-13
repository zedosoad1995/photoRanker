import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <>
      <Topbar />
      <Outlet />
    </>
  );
}
