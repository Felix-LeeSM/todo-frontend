import { GroupMembersContext, type MembersContextType } from "@domain/group/contexts/GroupContext";
import { useContext } from "react";
import type { WithRequired } from "@/shared/types.util";

export const useGroupMembers = () => {
  const context = useContext(GroupMembersContext);

  if (context === undefined) throw new Error("useGroupMembers는 GroupProvider 안에서만 사용해야 합니다.");
  if (!context.members) throw new Error("Group Member 정보가 없습니다. Provider 로직을 확인하세요.");

  return context as WithRequired<MembersContextType, "members">;
};
