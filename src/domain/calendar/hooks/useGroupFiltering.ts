import type { TodoWithStarred } from "@domain/todo/types/Todo";
import { isSameMonth } from "date-fns";
import { type Map as ImmutableMap, Set as ImmutableSet } from "immutable";
import { useMemo, useReducer } from "react";

interface FilterState {
  showMyTodos: boolean;
  showStarredOnly: boolean;
  showImportantOnly: boolean;
  groupIdsFilter: ImmutableSet<number>;
  selectedMonth: Date;
}

type FilterAction =
  | { type: "SET_My_TODOS_ONLY"; payload: boolean }
  | { type: "SET_STARRED_ONLY"; payload: boolean }
  | { type: "SET_IMPORTANT_ONLY"; payload: boolean }
  | { type: "SET_GROUP_FILTER"; payload: number[] }
  | { type: "ADD_GROUP_FILTER"; payload: number }
  | { type: "REMOVE_GROUP_FILTER"; payload: number }
  | { type: "SET_MONTH"; payload: Date };

const initialState: Omit<FilterState, "selectedMonth"> = {
  showMyTodos: false,
  showStarredOnly: false,
  showImportantOnly: false,
  groupIdsFilter: ImmutableSet(),
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_My_TODOS_ONLY":
      return { ...state, showMyTodos: action.payload };
    case "SET_STARRED_ONLY":
      return { ...state, showStarredOnly: action.payload };
    case "SET_IMPORTANT_ONLY":
      return { ...state, showImportantOnly: action.payload };
    case "SET_GROUP_FILTER":
      return { ...state, groupIdsFilter: ImmutableSet(action.payload) };
    case "ADD_GROUP_FILTER":
      return { ...state, groupIdsFilter: state.groupIdsFilter.add(action.payload) };
    case "REMOVE_GROUP_FILTER":
      return { ...state, groupIdsFilter: state.groupIdsFilter.delete(action.payload) };
    case "SET_MONTH":
      return { ...state, selectedMonth: action.payload };
    default:
      return state;
  }
}

export function useGroupTodoFiltering({
  groupTodos,
  myId,
  now,
}: {
  groupTodos: ImmutableMap<number, TodoWithStarred[]>;
  myId: number;
  now: Date;
}): {
  actions: {
    onMyTodosOnlyChange: (showMine: boolean) => void;
    onImportantOnlyChange: (showImportant: boolean) => void;
    onStarredOnlyChange: (showStarred: boolean) => void;
    onSetGroupsFilter: (ids: number[]) => void;
    onAddGroupFilter: (id: number) => void;
    onRemoveGroupFilter: (id: number) => void;
    onMonthChange: (date: Date) => void;
  };
  filterState: FilterState;
  filteredTodos: TodoWithStarred[];
} {
  const [state, dispatch] = useReducer(filterReducer, { ...initialState, selectedMonth: now });

  const filteredTodos = useMemo(
    () =>
      groupTodos
        .toArray()
        .filter(([id, _todos]) => state.groupIdsFilter.has(id))
        .flatMap(([_id, todos]) => todos)
        .filter((todo) => !state.showMyTodos || todo.assigneeId === myId)
        .filter((todo) => !state.showStarredOnly || todo.isStarred)
        .filter((todo) => !state.showImportantOnly || todo.important)
        .filter((todo) => todo.dueDate && isSameMonth(todo.dueDate, state.selectedMonth)),
    [myId, groupTodos, state],
  );

  const actions = useMemo(
    () => ({
      onMyTodosOnlyChange: (showMine: boolean) => dispatch({ type: "SET_My_TODOS_ONLY", payload: showMine }),
      onImportantOnlyChange: (showImportant: boolean) =>
        dispatch({ type: "SET_IMPORTANT_ONLY", payload: showImportant }),
      onStarredOnlyChange: (showStarred: boolean) => dispatch({ type: "SET_STARRED_ONLY", payload: showStarred }),
      onSetGroupsFilter: (ids: number[]) => dispatch({ type: "SET_GROUP_FILTER", payload: ids }),
      onAddGroupFilter: (id: number) => dispatch({ type: "ADD_GROUP_FILTER", payload: id }),
      onRemoveGroupFilter: (id: number) => dispatch({ type: "REMOVE_GROUP_FILTER", payload: id }),
      onMonthChange: (date: Date) => dispatch({ type: "SET_MONTH", payload: date }),
    }),
    [],
  );

  return {
    filterState: state,
    filteredTodos,
    actions,
  };
}
