import type { CompareOperator } from "@/shared/types.util";
import type { GroupRole } from "../types/GroupRole";

const roleHierarchy: Record<GroupRole, number> = {
  OWNER: 4,
  MANAGER: 3,
  MEMBER: 2,
  VIEWER: 1,
};

export const compareGroupRole = (role1: GroupRole, operator: CompareOperator, role2: GroupRole): boolean => {
  const rank1 = roleHierarchy[role1];
  const rank2 = roleHierarchy[role2];

  switch (operator) {
    case "gt":
      return rank1 > rank2;
    case "gte":
      return rank1 >= rank2;
    case "lt":
      return rank1 < rank2;
    case "lte":
      return rank1 <= rank2;
    case "eq":
      return rank1 === rank2;
    default:
      return false;
  }
};
