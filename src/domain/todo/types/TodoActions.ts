import type { TodoInterface } from "@domain/todo/types/Todo.interface";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";

export type TodoAction =
  | { type: "SET_TODOS"; payload: TodoInterface[] }
  | { type: "ADD_TODO"; payload: TodoInterface }
  | { type: "DELETE_TODO"; payload: { id: number } }
  | { type: "UPDATE_TODO"; payload: TodoInterface }
  | {
      type: "MOVE_TODO";
      payload: { id: number; status: TodoStatus; order: string };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "REVERT_STATE"; payload: TodoInterface[] };
