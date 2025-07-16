import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { type ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/group" replace />;
  }

  return children;
}
