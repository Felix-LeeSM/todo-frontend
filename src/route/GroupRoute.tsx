import { GroupContext } from "@domain/group/contexts/GroupContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function GroupRoute() {
  const { groupDetails } = useContext(GroupContext);

  return groupDetails ? <Outlet /> : <Navigate to="/groups" replace />;
}
