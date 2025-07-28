import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import TodoCard from "./TodoCard";

interface DraggableTodoCardProps {
  todo: TodoWithStarred;
}

export function DraggableTodoCard({ todo }: DraggableTodoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `todo-${todo.id}`,
    data: {
      type: "TODO_ITEM",
      data: todo,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TodoCard todo={todo} />
    </div>
  );
}
