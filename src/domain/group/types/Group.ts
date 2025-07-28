import type { Member } from "@domain/group/types/Member";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { GroupRole } from "./GroupRole";

export interface Group {
  id: number;
  name: string;
  description: string;
}

export interface GroupDetails extends Group {
  members: Member[];
  memberCount: number;
  myRole: GroupRole;
}

export interface FullGroupDetails extends GroupDetails {
  todos: TodoWithStarred[];
}

export interface DetailedGroup extends GroupDetails {
  todoCount: number;
  completedTodoCount: number;
}

export interface Invitation {
  token: string;
  expiresAt: Date;
}

export interface GroupInvitationInfo {
  groupId: number;
  name: string;
  description: string;
  todoCount: number;
  completedTodoCount: number;
  memberCount: number;
  issuer: Member;
  members: Member[];
  expiresAt: string;
}
