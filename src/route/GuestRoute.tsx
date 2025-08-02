import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function GuestRoute() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (user) {
    const redirectTo = location.state?.from || "/groups";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
