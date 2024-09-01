import { useAuth } from "@/Contexts/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { HOME } from "@/Constants/routes";
import FullPageLoading from "../Loading/FullPageLoading";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate(HOME);
    }
  }, [user]);

  if (!user || isLoading) {
    return <FullPageLoading />;
  }

  return <Outlet />;
}
