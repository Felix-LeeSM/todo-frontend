import { DroppableTodoColumn } from "@domain/todo/components/DroppableTodoColumn";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus, TodoStatusArray } from "@domain/todo/types/TodoStatus";
import { DragDropContext, type OnDragEndResponder } from "@hello-pangea/dnd";
import { generateOrderedString } from "@/shared/order";

interface TodoKanbanBoardProps {
  todos: TodoWithStarred[];
  moveTodo: (todoId: number, newStatus: TodoStatus, order: string) => void;
}

export function TodoKanbanBoard({ todos, moveTodo }: TodoKanbanBoardProps) {
  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const todoId = Number(draggableId.replace("todo-", ""));
    const todoToMove = todos.find((t) => t.id === todoId);
    if (!todoToMove) return;

    const newStatus = destination.droppableId.replace("column-", "") as TodoStatus;

    const sortedTodosInColumn = todos
      .filter((t) => t.status === newStatus)
      .sort((a, b) => a.order.localeCompare(b.order));

    let newOrder: string;

    if (source.droppableId === destination.droppableId) {
      const newSortedTodos = [...sortedTodosInColumn];
      const [removed] = newSortedTodos.splice(source.index, 1);
      newSortedTodos.splice(destination.index, 0, removed);

      const leftTodo = newSortedTodos[destination.index - 1];
      const rightTodo = newSortedTodos[destination.index + 1];
      newOrder = generateOrderedString(leftTodo?.order, rightTodo?.order);
    } else {
      const leftTodo = sortedTodosInColumn[destination.index - 1];
      const rightTodo = sortedTodosInColumn[destination.index];
      newOrder = generateOrderedString(leftTodo?.order, rightTodo?.order);
    }

    if (todoToMove.status === newStatus && todoToMove.order === newOrder) return;

    moveTodo(todoToMove.id, newStatus, newOrder);
  };

  const todoStatuses: TodoStatusArray = ["TO_DO", "IN_PROGRESS", "ON_HOLD", "DONE"];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {todoStatuses.map((status) => (
          <DroppableTodoColumn key={status} status={status} todos={todos.filter((todo) => todo.status === status)} />
        ))}
      </div>
    </DragDropContext>
  );
}
