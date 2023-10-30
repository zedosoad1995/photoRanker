import { useAuth } from "@/Contexts/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { VOTE } from "@/Constants/routes";
import FullPageLoading from "./Loading/FullPageLoading";

export default function RedirectLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (Boolean(user)) {
      navigate(VOTE);
    }
  }, [user]);

  if (Boolean(user) || isLoading) {
    return <FullPageLoading />;
  }

  return <Outlet />;
}
