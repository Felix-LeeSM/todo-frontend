import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function GuestRoute() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/groups" replace />;
  }

  return <Outlet />;
}
