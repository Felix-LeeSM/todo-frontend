import type { TodoWithStarred } from "../types/Todo";

export type TodoState = TodoWithStarred[];

export type TodoAction =
  | { type: "INITIALIZE_TODOS"; payload: TodoWithStarred[] }
  | { type: "APPLY_OPTIMISTIC_UPDATE"; payload: TodoWithStarred[] }
  | { type: "REVERT_STATE"; payload: TodoWithStarred[] };

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "INITIALIZE_TODOS":
      return action.payload;
    case "APPLY_OPTIMISTIC_UPDATE":
      return action.payload;
    case "REVERT_STATE":
      return action.payload;
    default:
      return state;
  }
}
