import { GroupContext } from "@domain/group/contexts/GroupContext";
import { type ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";

export function GroupRoute({ children }: { children: ReactNode }) {
  const { group } = useContext(GroupContext);

  if (!group) {
    return <Navigate to="/group" replace />;
  }

  return children;
}
