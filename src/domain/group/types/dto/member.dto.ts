export interface MemberDTO {
  id: number;
  nickname: string;
  groupId: number;
  role: GroupRole;
}

export type GroupRole = "OWNER" | "MANAGER" | "MEMBER" | "VIEWER";
