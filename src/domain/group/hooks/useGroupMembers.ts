import { GroupMembersContext, type MembersContextType } from "@domain/group/contexts/GroupContext";
import { useContext } from "react";
import type { WithRequired } from "@/shared/types.util";

export const useGroupMembers = () => {
  const context = useContext(GroupMembersContext);

  if (context === undefined) throw new Error("useGroupMembers는 GroupProvider 안에서만 사용해야 합니다.");
  if (!context.members) throw new Error("updateGroup 함수가 GroupProvider 에 의해 제공되지 않았습니다.");
  if (!context.updateMember) throw new Error("updateMember 함수가 GroupProvider에 의해 제공되지 않았습니다.");
  if (!context.deleteMember) throw new Error("deleteMember 함수가 GroupProvider에 의해 제공되지 않았습니다.");

  return context as WithRequired<MembersContextType, "members" | "updateMember" | "deleteMember">;
};
