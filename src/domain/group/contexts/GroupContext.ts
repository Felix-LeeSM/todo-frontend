import type { UpdateGroupRequestDTO } from "@domain/group/types/dto/group.dto";
import type { UpdateMemberRequestDTO } from "@domain/group/types/dto/member.dto";
import type { Group, Invitation } from "@domain/group/types/Group";
import type { GroupRole } from "@domain/group/types/GroupRole";
import type { Member } from "@domain/group/types/Member";
import type { CreateTodoParams, UpdateTodoMetadataParams, UpdateTodoRequestDTO } from "@domain/todo/types/dto/todo.dto";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { createContext } from "react";

export interface GroupInfoContextType {
  group?: Group;
  myRole?: GroupRole;
  updateGroup?: (data: UpdateGroupRequestDTO) => Promise<void>;
  createInvitation?: () => Promise<Invitation>;
}
export const GroupInfoContext = createContext<GroupInfoContextType>({});

export interface MembersContextType {
  members?: Member[];
  updateMember?: (memberId: number, data: UpdateMemberRequestDTO) => void;
  deleteMember?: (memberId: number) => void;
}
export const GroupMembersContext = createContext<MembersContextType>({});

export interface GroupTodosContextType {
  todos?: TodoWithStarred[];
  createTodo?: (todo: CreateTodoParams) => void;
  updateTodoDetails?: (todoId: number, updates: UpdateTodoRequestDTO) => void;
  updateTodoMetadata?: (todoId: number, params: UpdateTodoMetadataParams) => void;
  starTodo?: (todoId: number) => void;
  unstarTodo?: (todoId: number) => void;
  moveTodo?: (todoId: number, newStatus: TodoStatus, destinationId?: number) => void;
  deleteTodo?: (todoId: number) => void;
}
export const GroupTodosContext = createContext<GroupTodosContextType>({});
