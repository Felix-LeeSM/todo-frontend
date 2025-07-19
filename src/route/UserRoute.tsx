import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export function UserRoute() {
  const { user } = useContext(AuthContext);

  if (!user) {
    toast.warning("로그인을 먼저 진행해주십시오.");
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
