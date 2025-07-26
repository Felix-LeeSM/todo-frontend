import type { TodoWithStarred } from "@domain/todo/types/Todo";
import { addDays, endOfDay, endOfWeek, isSameDay, isWithinInterval, startOfToday, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { useCallback, useMemo, useReducer } from "react";
import type { todoFilter } from "../types/props";

interface FilterState {
  filterType: todoFilter;
  customDays: number;
  assigneeId: number | null;
}

type FilterAction =
  | { type: "SET_FILTER_TYPE"; payload: todoFilter }
  | { type: "SET_CUSTOM_DAYS"; payload: number }
  | { type: "SET_ASSIGNEE"; payload: number | null };

const initialState: FilterState = {
  filterType: "all",
  customDays: 30,
  assigneeId: null,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_FILTER_TYPE":
      if (state.filterType === action.payload) return state;
      return { ...state, filterType: action.payload };
    case "SET_CUSTOM_DAYS":
      return { ...state, customDays: action.payload, filterType: "custom" }; // customDays 변경 시 자동으로 탭도 변경
    case "SET_ASSIGNEE":
      return { ...state, assigneeId: action.payload };
    default:
      return state;
  }
}

const createDateFilter = (
  filterType: todoFilter,
  now: Date,
  customDays: number,
): ((todo: TodoWithStarred) => boolean) => {
  switch (filterType) {
    case "all":
      return () => true;
    case "today":
      return (todo: TodoWithStarred) => {
        if (!todo.dueDate) return false;
        return isSameDay(todo.dueDate, now);
      };
    case "thisWeek":
      return (todo: TodoWithStarred) => {
        if (!todo.dueDate) return false;
        return isWithinInterval(todo.dueDate, {
          start: startOfWeek(now, { locale: ko }),
          end: endOfWeek(now, { locale: ko }),
        });
      };
    case "custom":
      return (todo: TodoWithStarred) => {
        if (!todo.dueDate) return false;
        return isWithinInterval(todo.dueDate, {
          start: new Date(0),
          end: endOfDay(addDays(startOfToday(), customDays)),
        });
      };
  }
};

export function useTodoFiltering({ todos }: { todos: TodoWithStarred[] }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const { filterType, customDays, assigneeId } = state;

  const filteredTodos = useMemo(() => {
    const now = new Date();
    const assigneeFilter: (todo: TodoWithStarred) => boolean =
      assigneeId !== null ? (todo) => todo.assigneeId === assigneeId : () => true;
    const dateFilter = createDateFilter(filterType, now, customDays);
    return todos.filter(assigneeFilter).filter(dateFilter);
  }, [todos, filterType, customDays, assigneeId]);

  const handleFilterTypeChange = useCallback((type: todoFilter) => {
    dispatch({ type: "SET_FILTER_TYPE", payload: type });
  }, []);

  const handleCustomDaysChange = useCallback((days: number) => {
    dispatch({ type: "SET_CUSTOM_DAYS", payload: days });
  }, []);

  const handleAssigneeChange = useCallback((id: number | null) => {
    dispatch({ type: "SET_ASSIGNEE", payload: id });
  }, []);

  return {
    filterState: state,
    filteredTodos,
    actions: {
      onFilterTypeChange: handleFilterTypeChange,
      onCustomDaysChange: handleCustomDaysChange,
      onAssigneeChange: handleAssigneeChange,
    },
  };
}
