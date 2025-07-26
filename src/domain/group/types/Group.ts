import type { Member } from "@domain/group/types/Member";
import type { TodoWithStarred } from "@domain/todo/types/Todo";

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

export type GroupRole = "OWNER" | "MANAGER" | "MEMBER" | "VIEWER";
