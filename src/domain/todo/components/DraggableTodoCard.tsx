import { useGroupMembers } from "@domain/group/hooks/useGroupMembers";
import { useGroupTodos } from "@domain/group/hooks/useGroupTodos";
import { Card, CardContent, CardHeader } from "@domain/shared/components/ui/card";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import { AssigneeSelector } from "./AssigneeSelector";
import { DueDateSelector } from "./DueDateSelector";
import { TodoDescription } from "./TodoDescription";
import { TodoHeader } from "./TodoHeader";

interface DraggableTodoCardProps {
  todo: TodoWithStarred;
  isDragging: boolean;
}

export function DraggableTodoCard({ todo, isDragging }: DraggableTodoCardProps) {
  const { updateTodoMetadata, starTodo, unstarTodo, deleteTodo } = useGroupTodos();
  const { members } = useGroupMembers();
  const assignee = members.find((m) => m.id === todo.assigneeId);

  const toggleStar = () => (todo.isStarred ? unstarTodo(todo.id) : starTodo(todo.id));
  const toggleImportant = () => updateTodoMetadata(todo.id, { isImportant: !todo.important });
  const selectAssignee = (memberId?: number) => updateTodoMetadata(todo.id, { assigneeId: memberId ?? null });
  const selectDueDate = (dueDate?: Date) => {
    if (!dueDate) {
      updateTodoMetadata(todo.id, { dueDate: null });
      return;
    }
    const timezoneOffset = dueDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dueDate.getTime() - timezoneOffset);
    updateTodoMetadata(todo.id, { dueDate: adjustedDate });
  };

  return (
    <Card
      key={todo.id}
      className={`border border-gray-200 hover:shadow-md transition-shadow duration-200 h-fit ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <CardHeader>
        id는 {todo.id} order는 {todo.order}
        <TodoHeader
          todo={todo}
          onToggleImportant={toggleImportant}
          onToggleStar={toggleStar}
          onDelete={() => deleteTodo(todo.id)}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todo.description && <TodoDescription description={todo.description} />}

          <div className="space-y-2">
            <DueDateSelector dueDate={todo.dueDate} onSelect={selectDueDate} />
            <AssigneeSelector assignee={assignee} members={members} onSelect={selectAssignee} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
