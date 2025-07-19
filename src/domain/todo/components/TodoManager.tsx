import type { IGroup } from "@domain/group/types/Group.interface";
import { TodoForm } from "@domain/todo/components/TodoForm";
import { TodoList } from "@domain/todo/components/TodoList";
import { useTodoDragDrop } from "@domain/todo/hooks/useTodoDragDrop";
import { useTodos } from "@domain/todo/hooks/useTodos";
import type { ITodo } from "@domain/todo/types/Todo.interface";
import { DragDropContext } from "@hello-pangea/dnd";
import { handleApiError } from "@/shared/handleApiError";

interface TodoManagerProps {
  group: IGroup;
}

export default function TodoManager({ group }: TodoManagerProps) {
  const { todos, todosByStatus, loading, addTodo, deleteTodo, moveTodo } = useTodos(group);
  const { handleDragEnd } = useTodoDragDrop({ todos, todosByStatus, moveTodo });

  const handleAddTodo = (title: string, description: string) => {
    addTodo(title, description).catch(handleApiError);
  };

  const handleDeleteTodo = (todo: ITodo) => {
    deleteTodo(todo).catch(handleApiError);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{group.name} - Todos</h2>
        {loading ? (
          <div className="text-center py-8">Loading todos...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
              {(["TO_DO", "IN_PROGRESS", "DONE", "ON_HOLD"] as const).map((status) => (
                <TodoList
                  key={`list-${status}`}
                  todoStatus={status}
                  todos={todosByStatus[status]}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Add New Todo</h3>
              <TodoForm onSubmit={handleAddTodo} />
            </div>
          </>
        )}
      </div>
    </DragDropContext>
  );
}
