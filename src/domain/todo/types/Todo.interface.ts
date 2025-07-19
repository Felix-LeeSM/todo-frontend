import type { TodoStatus } from "@domain/todo/types/TodoStatus";

export interface ITodo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  authorId: number;
  groupId: number;
  order: string;
}
