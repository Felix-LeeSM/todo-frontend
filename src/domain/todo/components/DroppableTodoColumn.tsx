import { Draggable, Droppable } from "@hello-pangea/dnd";
import { DraggableTodoCard } from "@domain/todo/components/DraggableTodoCard";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { AlertTriangle, CheckCircle2, Clock, Pause } from "lucide-react";

interface DroppableTodoColumnProps {
  status: TodoStatus;
  todos: TodoWithStarred[];
}

export function DroppableTodoColumn({ status, todos }: DroppableTodoColumnProps) {
  const getColumnInfo = (status: TodoStatus) => {
    switch (status) {
      case "TO_DO":
        return {
          title: "할일",
          icon: <Clock className="mr-2 h-4 w-4 text-gray-500" />,
          borderColor: "",
        };
      case "IN_PROGRESS":
        return {
          title: "진행중",
          icon: <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />,
          borderColor: "border-blue-200",
        };
      case "ON_HOLD":
        return {
          title: "보류 중",
          icon: <Pause className="mr-2 h-4 w-4 text-orange-500" />,
          borderColor: "border-orange-200",
        };
      case "DONE":
        return {
          title: "완료",
          icon: <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />,
          borderColor: "border-green-200",
        };
      default:
        return {
          title: "알 수 없음",
          icon: <Clock className="mr-2 h-4 w-4 text-gray-500" />,
          borderColor: "",
        };
    }
  };

  const columnInfo = getColumnInfo(status);

  return (
    <Droppable droppableId={`column-${status}`}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`space-y-4 p-4 rounded-lg transition-colors ${
            snapshot.isDraggingOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : "bg-gray-50 border-2 border-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center">
              {columnInfo.icon}
              {columnInfo.title} ({todos.length})
            </h3>
          </div>
          <div className="space-y-3 min-h-60 pb-20">
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={`todo-${todo.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={columnInfo.borderColor}
                  >
                    <DraggableTodoCard todo={todo} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
