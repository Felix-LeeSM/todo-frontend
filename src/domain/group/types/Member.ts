import type { GroupRole } from "@domain/group/types/Group";

export interface Member {
  id: number;
  nickname: string;
  groupId: number;
  role: GroupRole;
}
