import type { Todo } from "@domain/todo/types/Todo";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";

export type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: { id: number } }
  | { type: "UPDATE_TODO"; payload: Todo }
  | {
      type: "MOVE_TODO";
      payload: { id: number; status: TodoStatus; order: string };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "REVERT_STATE"; payload: Todo[] };
