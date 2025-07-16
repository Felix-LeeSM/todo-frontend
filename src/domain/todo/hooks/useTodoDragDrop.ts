import type { TodoInterface } from "@domain/todo/types/Todo.interface";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import type { DropResult } from "@hello-pangea/dnd";
import { handleApiError } from "@/shared/handleApiError";
import { generateOrderedString } from "@/shared/order";

interface UseTodoDragDropProps {
  todos: TodoInterface[];
  todosByStatus: Record<TodoStatus, TodoInterface[]>;
  moveTodo: (todoId: number, newStatus: TodoStatus, newOrder: string) => Promise<void>;
}

export function useTodoDragDrop({ todos, todosByStatus, moveTodo }: UseTodoDragDropProps) {
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { destination, draggableId } = result;
    const movedTodo = todos.find((todo) => todo.id.toString() === draggableId);

    if (!movedTodo) return;

    const newStatus = destination.droppableId as TodoStatus;
    const statusTodos = todosByStatus[newStatus];

    const tempStatusTodos = statusTodos.filter((todo) => todo.id.toString() !== draggableId);

    let prevTodo: TodoInterface | undefined;
    let nextTodo: TodoInterface | undefined;

    if (destination.index > 0) {
      prevTodo = tempStatusTodos[destination.index - 1];
    }
    if (destination.index < tempStatusTodos.length) {
      nextTodo = tempStatusTodos[destination.index];
    }

    const newOrder = generateOrderedString(prevTodo?.order, nextTodo?.order);

    try {
      await moveTodo(movedTodo.id, newStatus, newOrder);
    } catch (error) {
      handleApiError(error);
    }
  };

  return { handleDragEnd };
}
