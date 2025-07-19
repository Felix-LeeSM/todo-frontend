import type { ITodo } from "@domain/todo/types/Todo.interface";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";

export type TodoAction =
  | { type: "SET_TODOS"; payload: ITodo[] }
  | { type: "ADD_TODO"; payload: ITodo }
  | { type: "DELETE_TODO"; payload: { id: number } }
  | { type: "UPDATE_TODO"; payload: ITodo }
  | {
      type: "MOVE_TODO";
      payload: { id: number; status: TodoStatus; order: string };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "REVERT_STATE"; payload: ITodo[] };
