import type { TodoStatus } from "@domain/todo/types/TodoStatus";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  authorId: number;
  groupId: number;
  order: string;
  dueDate?: Date;
  assigneeId?: number;
  important?: boolean;
}

export interface TodoWithStarred {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  isStarred: boolean;
  authorId: number;
  groupId: number;
  order: string;
  dueDate?: Date;
  assigneeId?: number;
  important?: boolean;
}
