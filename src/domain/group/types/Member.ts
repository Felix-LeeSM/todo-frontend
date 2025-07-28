import type { GroupRole } from "@domain/group/types/GroupRole";

export interface Member {
  id: number;
  nickname: string;
  groupId: number;
  role: GroupRole;
}
