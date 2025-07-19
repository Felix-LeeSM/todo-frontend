import type { GroupRole } from "@domain/group/types/Group.interface";

export interface IMember {
  id: number;
  nickname: string;
  username: string;
  groupId: number;
  role: GroupRole;
}
