import type { GroupRole } from "../GroupRole";

export interface MemberDTO {
  id: number;
  nickname: string;
  groupId: number;
  role: GroupRole;
}

export interface UpdateMemberRequestDTO {
  role: GroupRole;
}
