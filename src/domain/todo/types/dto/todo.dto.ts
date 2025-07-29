import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import type { Nullable } from "@/shared/types.util";

export interface CreateTodoRequestDTO {
  title: string;
  description: string;
  dueDate?: string;
  assigneeId?: number;
}

export interface CreateTodoParams {
  title: string;
  description: string;
  dueDate?: Date;
  assigneeId?: number;
}

export interface UpdateTodoRequestDTO {
  title: string;
  description: string;
}

export interface MoveTodoRequestDTO {
  order: string;
  todoStatus: TodoStatus;
}

export interface UpdateTodoMetadataParams {
  isImportant?: boolean;
  dueDate?: Nullable<Date>;
  assigneeId?: Nullable<number>;
}

export interface UpdateTodoMetadataRequestDTO {
  isImportant?: boolean;
  dueDate?: Nullable<string>;
  assigneeId?: Nullable<number>;
}

export interface TodoResponseDTO {
  id: number;
  title: string;
  description: string;
  order: string;
  status: TodoStatus;
  dueDate?: string;
  authorId: number;
  groupId: number;
  assigneeId?: number;
  isImportant?: boolean;
}

export interface TodoWithStarredStatusResponseDTO {
  id: number;
  title: string;
  description: string;
  order: string;
  isStarred: boolean;
  status: TodoStatus;
  dueDate?: string;
  authorId: number;
  groupId: number;
  assigneeId?: number;
  isImportant?: boolean;
}
