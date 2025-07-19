import type { IMember } from "@domain/group/types/Member.interface";
import type { ITodo } from "@domain/todo/types/Todo.interface";

export interface IGroupDetails {
  id: number;
  name: string;
  description: string;
}

export interface IGroupMembersInfo {
  members: IMember[];
  memberCount: number;
  myRole: GroupRole;
}

export interface IFullDetailedGroup extends IGroupDetails, IGroupMembersInfo {
  todos: ITodo[];
}

export interface IDetailedGroup extends IGroupDetails, IGroupMembersInfo {
  todoCount: number;
  completedTodoCount: number;
}

export type GroupRole = "OWNER" | "MANAGER" | "MEMBER" | "VIEWER";
