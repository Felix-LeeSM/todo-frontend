import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { useContext, useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export function UserRoute() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const prevUserRef = useRef(user);

  useEffect(() => {
    prevUserRef.current = user;
  }, [user]);

  if (!user) {
    if (!prevUserRef.current) toast.warning("로그인을 먼저 진행해주십시오.");

    return <Navigate to="/signin" state={{ from: location.pathname + location.search }} replace />;
  }

  return <Outlet />;
}
