import TodoCard from "@domain/todo/components/TodoCard";
import type { ITodo } from "@domain/todo/types/Todo.interface";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { Draggable, Droppable } from "@hello-pangea/dnd";

export type TodoItemProps = {
  todos: ITodo[];
  todoStatus: TodoStatus;
  onDelete: (todo: ITodo) => void;
};

export function TodoList({ todos, todoStatus, onDelete }: TodoItemProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg flex flex-col">
      <h3 className="text-lg font-semibold mb-2">{todoStatus}</h3>
      <Droppable droppableId={todoStatus}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow space-y-2 min-h-24 rounded-lg ${snapshot.isDraggingOver ? "bg-gray-200" : ""}`}
          >
            {todos.map((todo, index) => (
              <Draggable key={`item-${todo.id}`} draggableId={todo.id.toString()} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <TodoCard todo={todo} onDelete={onDelete} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
