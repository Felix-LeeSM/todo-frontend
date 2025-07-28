import { GroupInfoContext } from "@domain/group/contexts/GroupContext";
import { compareGroupRole } from "@domain/group/services/compareGroupRole";
import type { GroupRole } from "@domain/group/types/GroupRole";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { CompareOperator } from "@/shared/types.util";

interface RoleRouteProps {
  requiredRole: GroupRole;
  operater: CompareOperator;
}

export function RoleRoute({ requiredRole, operater }: RoleRouteProps) {
  const { myRole } = useContext(GroupInfoContext);

  return myRole && compareGroupRole(myRole, operater, requiredRole) ? <Outlet /> : <Navigate to="/groups" replace />;
}
