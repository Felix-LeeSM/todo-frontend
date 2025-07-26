import { GroupInfoContext } from "@domain/group/contexts/GroupContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function GroupRoute() {
  const { group } = useContext(GroupInfoContext);

  return group ? <Outlet /> : <Navigate to="/groups" replace />;
}
