import { GroupInfoContext, GroupMembersContext, GroupTodosContext } from "@domain/group/contexts/GroupContext";
import { groupApi } from "@domain/group/services/groupApi";
import type { Group, GroupRole } from "@domain/group/types/Group";
import type { Member } from "@domain/group/types/Member";
import { todoApi } from "@domain/todo/services/todoApi";
import type { CreateTodoParams, UpdateTodoMetadataParams, UpdateTodoRequestDTO } from "@domain/todo/types/dto/todo.dto";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { toastErrorMessage } from "@/shared/toastErrorMessage";

interface GroupProviderProps {
  onNotFound: () => void;
}

export const GroupProvider = ({ onNotFound }: GroupProviderProps) => {
  const { groupId } = useParams<{ groupId: string }>();
  const parsedId = Number(groupId);

  const [group, setGroup] = useState<Group>();
  const [members, setMembers] = useState<Member[]>([]);
  const [todos, setTodos] = useState<TodoWithStarred[]>([]);
  const [myRole, setMyRole] = useState<GroupRole>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Number.isNaN(parsedId)) onNotFound();
  }, [parsedId, onNotFound]);

  useEffect(() => {
    if (!Number.isNaN(parsedId)) {
      setIsLoading(true);
      groupApi
        .getGroupById(parsedId)
        .then(({ members, todos, myRole, ...groupInfo }) => {
          setGroup(groupInfo);
          setMembers(members);
          setTodos(todos);
          setMyRole(myRole);
        })
        .catch(toastErrorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [parsedId]);

  const handleCreateTodo = useCallback(
    (todo: CreateTodoParams) => {
      if (!parsedId) return;

      todoApi
        .createTodo(todo, parsedId)
        .then((newTodo) => {
          setTodos((prev) => [{ ...newTodo, isStarred: false }, ...prev]);
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );

  const handleUpdateTodoDetails = useCallback(
    (todoId: number, updates: UpdateTodoRequestDTO) => {
      if (!parsedId) return;

      todoApi
        .updateTodo(parsedId, todoId, updates)
        .then((updatedTodo) => {
          setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, ...updatedTodo } : t)));
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );

  const handleUpdateTodoMetadata = useCallback(
    (todoId: number, params: UpdateTodoMetadataParams) => {
      if (!parsedId) return;

      todoApi
        .updateMetadata(parsedId, todoId, params)
        .then((updatedTodo) => {
          setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, ...updatedTodo } : t)));
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );

  const handleStarTodo = useCallback(
    (todoId: number) => {
      if (!parsedId) return;

      todoApi
        .starTodo(parsedId, todoId)
        .then(() => {
          setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, isStarred: true } : t)));
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );

  const handleUnstarTodo = useCallback(
    (todoId: number) => {
      if (!parsedId) return;

      todoApi
        .unstarTodo(parsedId, todoId)
        .then(() => {
          setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, isStarred: false } : t)));
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );

  const handleMoveTodo = useCallback(
    (todoId: number, newStatus: TodoStatus, destinationId?: number) => {
      if (!parsedId) return;

      todoApi
        .moveTodo(parsedId, todoId, { todoStatus: newStatus, destinationId: destinationId })
        .then((movedTodo) => {
          setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, ...movedTodo } : t)));
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );

  const handleDeleteTodo = useCallback(
    (todoId: number) => {
      if (!parsedId) return;
      todoApi
        .deleteTodo(parsedId, todoId)
        .then(() => {
          setTodos((prev) => prev.filter((t) => t.id !== todoId));
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );

  const infoContextValue = useMemo(() => ({ group, myRole }), [group, myRole]);
  const membersContextValue = useMemo(() => ({ members }), [members]);
  const todosContextValue = useMemo(
    () => ({
      todos,
      createTodo: handleCreateTodo,
      updateTodoDetails: handleUpdateTodoDetails,
      updateTodoMetadata: handleUpdateTodoMetadata,
      starTodo: handleStarTodo,
      unstarTodo: handleUnstarTodo,
      moveTodo: handleMoveTodo,
      deleteTodo: handleDeleteTodo,
    }),
    [
      todos,
      handleCreateTodo,
      handleUpdateTodoDetails,
      handleUpdateTodoMetadata,
      handleStarTodo,
      handleUnstarTodo,
      handleMoveTodo,
      handleDeleteTodo,
    ],
  );

  return isLoading ? null : (
    <GroupInfoContext.Provider value={infoContextValue}>
      <GroupMembersContext.Provider value={membersContextValue}>
        <GroupTodosContext.Provider value={todosContextValue}>
          <Outlet />
        </GroupTodosContext.Provider>
      </GroupMembersContext.Provider>
    </GroupInfoContext.Provider>
  );
};
