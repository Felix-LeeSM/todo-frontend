import type { ITodo } from "@domain/todo/types/Todo.interface";

export type CreateTodoRequestDTO = Pick<ITodo, "title" | "description" | "order">;
