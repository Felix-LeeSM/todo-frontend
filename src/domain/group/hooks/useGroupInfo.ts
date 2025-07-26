import { GroupInfoContext, type GroupInfoContextType } from "@domain/group/contexts/GroupContext";
import { useContext } from "react";
import type { WithRequired } from "@/shared/types.util";

export const useGroupInfo = () => {
  const context = useContext(GroupInfoContext);

  if (context === undefined) throw new Error("useGroupInfo는 GroupProvider 안에서만 사용해야 합니다.");
  if (!context.group || !context.myRole) throw new Error("Group 정보가 없습니다. Provider 로직을 확인하세요.");

  return context as WithRequired<GroupInfoContextType, "group" | "myRole">;
};
