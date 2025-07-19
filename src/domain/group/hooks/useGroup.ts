import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { WithRequired } from "@/shared/types.util";
import { GroupContext, type GroupContextType } from "../contexts/GroupContext";

export const useGroup = () => {
  const context = useContext(GroupContext);
  const navigate = useNavigate();

  if (context === undefined) throw new Error("useGroup는 GroupProvider 안에서만 사용해야 합니다.");

  if (!context.groupDetails) {
    navigate("/groups");
    throw new Error("group이 없습니다. 보호된 라우트 등을 확인하세요.");
  }

  return context as WithRequired<GroupContextType, "groupDetails" | "groupMembersInfo" | "todos">;
};
