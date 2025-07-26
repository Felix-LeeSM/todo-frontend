import { GroupTodoHeader } from "@domain/group/components/GroupTodoHeader";
import { useGroupInfo } from "@domain/group/hooks/useGroupInfo";
import { useGroupMembers } from "@domain/group/hooks/useGroupMembers";
import { useGroupTodos } from "@domain/group/hooks/useGroupTodos";
import { TodoFilters } from "@domain/todo/components/TodoFilters";
import { TodoKanbanBoard } from "@domain/todo/components/TodoKanbanBoard";
import { useTodoFiltering } from "@domain/todo/hooks/useTodoFiltering";

export function GroupTodoPage() {
  const { group, myRole } = useGroupInfo();
  const { members } = useGroupMembers();
  const { todos, createTodo } = useGroupTodos();

  const { filterState, filteredTodos, actions } = useTodoFiltering({ todos });

  return (
    <main className="container bg-gray-50 mx-auto px-4 py-8">
      <GroupTodoHeader group={group} myRole={myRole} members={members} onCreateTodo={createTodo} />

      <TodoFilters filterState={filterState} members={members} actions={actions} />

      <TodoKanbanBoard todos={filteredTodos} />
    </main>
  );
}
