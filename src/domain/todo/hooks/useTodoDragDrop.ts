import type { Todo } from "@domain/todo/types/Todo";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import type { DropResult } from "@hello-pangea/dnd";
import { generateOrderedString } from "@/shared/order";
import { toastErrorMessage } from "@/shared/toastErrorMessage";

interface UseTodoDragDropProps {
  todos: Todo[];
  todosByStatus: Record<TodoStatus, Todo[]>;
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

    let prevTodo: Todo | undefined;
    let nextTodo: Todo | undefined;

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
      toastErrorMessage(error);
    }
  };

  return { handleDragEnd };
}
