import type { Group, GroupRole } from "@domain/group/types/Group";
import type { Member } from "@domain/group/types/Member";
import type { CreateTodoParams, UpdateTodoMetadataParams, UpdateTodoRequestDTO } from "@domain/todo/types/dto/todo.dto";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { createContext } from "react";

export interface GroupInfoContextType {
  group?: Group;
  myRole?: GroupRole;
}
export const GroupInfoContext = createContext<GroupInfoContextType>({});

export interface MembersContextType {
  members?: Member[];
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
