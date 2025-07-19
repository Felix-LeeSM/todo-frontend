import type { IGroup } from "@domain/group/types/Group.interface";
import { useTodoReducer } from "@domain/todo/hooks/useTodoReducer";
import { todoApi } from "@domain/todo/services/todoApi";
import type { ITodo } from "@domain/todo/types/Todo.interface";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { useEffect, useMemo } from "react";
import { generateOrderedString } from "@/shared/order";

export function useTodos(group: IGroup) {
  const [state, dispatch] = useTodoReducer();

  // Memoized sorted todos by status
  const todosByStatus = useMemo(() => {
    const sortedTodos = (status: TodoStatus) =>
      state.todos.filter((todo) => todo.status === status).sort((a, b) => a.order.localeCompare(b.order));

    return {
      TO_DO: sortedTodos("TO_DO"),
      IN_PROGRESS: sortedTodos("IN_PROGRESS"),
      DONE: sortedTodos("DONE"),
      ON_HOLD: sortedTodos("ON_HOLD"),
    };
  }, [state.todos]);

  // Load todos on mount
  useEffect(() => {
    todoApi
      .getTodos(group.id)
      .then((todos) => dispatch({ type: "SET_TODOS", payload: todos }))
      .catch(console.error);
  }, [group.id, dispatch]);

  // Actions
  const addTodo = async (title: string, description: string) => {
    const lastTodo = todosByStatus.TO_DO[todosByStatus.TO_DO.length - 1];
    const newOrder = generateOrderedString(lastTodo?.order);

    // Optimistic update (optional, but good for UX)
    // We don't have an ID yet, so we can't add it to the state directly
    // dispatch({ type: "ADD_TODO", payload: { title, description, order: newOrder } });

    try {
      const createdTodo = await todoApi.createTodo({ title, description, order: newOrder }, group.id);
      dispatch({ type: "ADD_TODO", payload: createdTodo });
    } catch (error) {
      // If optimistic update was done, revert it here
      dispatch({ type: "REVERT_STATE", payload: state.previousState });
      throw error;
    }
  };

  const deleteTodo = async (todo: ITodo) => {
    dispatch({ type: "DELETE_TODO", payload: { id: todo.id } });

    try {
      await todoApi.deleteTodo(group.id, todo.id);
    } catch (error) {
      dispatch({ type: "REVERT_STATE", payload: state.previousState });
      throw error;
    }
  };

  const moveTodo = async (todoId: number, newStatus: TodoStatus, newOrder: string) => {
    // Optimistic update
    dispatch({
      type: "MOVE_TODO",
      payload: { id: todoId, status: newStatus, order: newOrder },
    });

    try {
      const todo = state.todos.find((t) => t.id === todoId);
      if (!todo) throw new Error("Todo not found");

      const updatedTodo = { ...todo, status: newStatus, order: newOrder };
      const result = await todoApi.updateTodo(group.id, todoId, updatedTodo);

      dispatch({ type: "UPDATE_TODO", payload: result });
    } catch (error) {
      dispatch({ type: "REVERT_STATE", payload: state.previousState });
      throw error;
    }
  };

  return {
    todos: state.todos,
    todosByStatus,
    loading: state.loading,
    addTodo,
    deleteTodo,
    moveTodo,
  };
}
