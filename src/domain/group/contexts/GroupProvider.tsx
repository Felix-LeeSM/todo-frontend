import { GroupInfoContext, GroupMembersContext, GroupTodosContext } from "@domain/group/contexts/GroupContext";
import { groupApi } from "@domain/group/services/groupApi";
import type { Group } from "@domain/group/types/Group";
import type { Member } from "@domain/group/types/Member";
import { todoApi } from "@domain/todo/services/todoApi";
import { todoReducer } from "@domain/todo/state/todoReducer";
import type { CreateTodoParams, UpdateTodoMetadataParams, UpdateTodoRequestDTO } from "@domain/todo/types/dto/todo.dto";
import type { TodoWithStarred } from "@domain/todo/types/Todo";
import type { TodoStatus } from "@domain/todo/types/TodoStatus";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { toastErrorMessage } from "@/shared/toastErrorMessage";
import type { UpdateGroupRequestDTO } from "../types/dto/group.dto";
import type { UpdateMemberRequestDTO } from "../types/dto/member.dto";
import type { GroupRole } from "../types/GroupRole";

interface GroupProviderProps {
  onNotFound: () => void;
}

export const GroupProvider = ({ onNotFound }: GroupProviderProps) => {
  const { groupId } = useParams<{ groupId: string }>();
  const parsedId = Number(groupId);

  const [group, setGroup] = useState<Group>();
  const [members, setMembers] = useState<Member[]>([]);
  const [todos, dispatch] = useReducer(todoReducer, []);
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
          dispatch({ type: "INITIALIZE_TODOS", payload: todos.sort((a, b) => a.order.localeCompare(b.order)) });
          setMyRole(myRole);
        })
        .catch(toastErrorMessage)
        .finally(() => setIsLoading(false));
    }
  }, [parsedId]);

  const handleUpdateGroup = useCallback(
    (data: UpdateGroupRequestDTO) => {
      if (!parsedId) return Promise.resolve();

      return groupApi
        .updateGroup(parsedId, data)
        .then((newGroup) => {
          setGroup({ ...group, ...newGroup });
        })
        .catch(toastErrorMessage);
    },
    [parsedId, group],
  );

  const handleUpdateMember = useCallback(
    (memberId: number, data: UpdateMemberRequestDTO) => {
      if (!parsedId) return;

      groupApi
        .updateMember(parsedId, memberId, data)
        .then(() => {
          setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: data.role } : m)));
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );
  const handleDeleteMember = useCallback(
    (memberId: number) => {
      if (!parsedId) return;

      groupApi
        .deleteMember(parsedId, memberId)
        .then(() => {
          setMembers((prev) => prev.filter((m) => m.id !== memberId));
        })
        .catch(toastErrorMessage);
    },
    [parsedId],
  );

  const handleCreateInvitation = useCallback(() => {
    return groupApi.createGroupInvitation(parsedId);
  }, [parsedId]);

  const handleCreateTodo = useCallback(
    (todo: CreateTodoParams) => {
      if (!parsedId) return;

      todoApi
        .createTodo(todo, parsedId)
        .then((newTodo) => {
          const newTodos = [{ ...newTodo, isStarred: false }, ...todos].sort((a, b) => a.order.localeCompare(b.order));
          dispatch({ type: "APPLY_OPTIMISTIC_UPDATE", payload: newTodos });
        })
        .catch(toastErrorMessage);
    },
    [parsedId, todos],
  );

  const handleUpdateTodoDetails = useCallback(
    (todoId: number, updates: UpdateTodoRequestDTO) => {
      if (!parsedId) return;

      const previousTodos = todos;
      const optimisticTodos = todos.map((t) => (t.id === todoId ? { ...t, ...updates } : t));
      dispatch({ type: "APPLY_OPTIMISTIC_UPDATE", payload: optimisticTodos });

      todoApi
        .updateTodo(parsedId, todoId, updates)
        .then((_updatedTodo) => {
          // The optimistic update already applied, no need to update again unless there's a discrepancy
          // For now, we'll assume the optimistic update is correct.
        })
        .catch((error) => {
          dispatch({ type: "REVERT_STATE", payload: previousTodos });
          toastErrorMessage(error);
        });
    },
    [parsedId, todos],
  );

  const handleUpdateTodoMetadata = useCallback(
    (todoId: number, params: UpdateTodoMetadataParams) => {
      if (!parsedId) return;

      const previousTodos = todos;
      const expectedResult: Partial<TodoWithStarred> = {
        assigneeId: params.assigneeId ? params.assigneeId : undefined,
        dueDate: params.dueDate ? params.dueDate : undefined,
        important: params.isImportant,
      };
      const optimisticTodos = todos.map((t) => (t.id === todoId ? { ...t, ...expectedResult } : t));
      dispatch({ type: "APPLY_OPTIMISTIC_UPDATE", payload: optimisticTodos });

      todoApi
        .updateMetadata(parsedId, todoId, params)
        .then((_updatedTodo) => {
          // The optimistic update already applied, no need to update again unless there's a discrepancy
        })
        .catch((error) => {
          dispatch({ type: "REVERT_STATE", payload: previousTodos });
          toastErrorMessage(error);
        });
    },
    [parsedId, todos],
  );

  const handleStarTodo = useCallback(
    (todoId: number) => {
      if (!parsedId) return;

      const previousTodos = todos;
      const optimisticTodos = todos.map((t) => (t.id === todoId ? { ...t, isStarred: true } : t));
      dispatch({ type: "APPLY_OPTIMISTIC_UPDATE", payload: optimisticTodos });

      todoApi
        .starTodo(parsedId, todoId)
        .then(() => {
          // Optimistic update already applied
        })
        .catch((error) => {
          dispatch({ type: "REVERT_STATE", payload: previousTodos });
          toastErrorMessage(error);
        });
    },
    [parsedId, todos],
  );

  const handleUnstarTodo = useCallback(
    (todoId: number) => {
      if (!parsedId) return;

      const previousTodos = todos;
      const optimisticTodos = todos.map((t) => (t.id === todoId ? { ...t, isStarred: false } : t));
      dispatch({ type: "APPLY_OPTIMISTIC_UPDATE", payload: optimisticTodos });

      todoApi
        .unstarTodo(parsedId, todoId)
        .then(() => {
          // Optimistic update already applied
        })
        .catch((error) => {
          dispatch({ type: "REVERT_STATE", payload: previousTodos });
          toastErrorMessage(error);
        });
    },
    [parsedId, todos],
  );

  const handleMoveTodo = useCallback(
    (todoId: number, newStatus: TodoStatus, order: string) => {
      if (!parsedId) return;

      const previousTodos = todos;
      const optimisticTodos = todos
        .map((t) => (t.id === todoId ? { ...t, status: newStatus, order: order } : t))
        .sort((a, b) => a.order.localeCompare(b.order));
      dispatch({ type: "APPLY_OPTIMISTIC_UPDATE", payload: optimisticTodos });

      todoApi
        .moveTodo(parsedId, todoId, { todoStatus: newStatus, order: order })
        .then((_movedTodo) => {
          // The optimistic update already applied, no need to update again unless there's a discrepancy
          // For now, we'll assume the optimistic update is correct.
        })
        .catch((error) => {
          dispatch({ type: "REVERT_STATE", payload: previousTodos });
          toastErrorMessage(error);
        });
    },
    [parsedId, todos],
  );

  const handleDeleteTodo = useCallback(
    (todoId: number) => {
      if (!parsedId) return;

      const previousTodos = todos;
      const optimisticTodos = todos.filter((t) => t.id !== todoId);
      dispatch({ type: "APPLY_OPTIMISTIC_UPDATE", payload: optimisticTodos });

      todoApi
        .deleteTodo(parsedId, todoId)
        .then(() => {
          // Optimistic update already applied
        })
        .catch((error) => {
          dispatch({ type: "REVERT_STATE", payload: previousTodos });
          toastErrorMessage(error);
        });
    },
    [parsedId, todos],
  );

  const infoContextValue = useMemo(
    () => ({ group, myRole, updateGroup: handleUpdateGroup, createInvitation: handleCreateInvitation }),
    [group, myRole, handleUpdateGroup, handleCreateInvitation],
  );

  const membersContextValue = useMemo(
    () => ({ members, updateMember: handleUpdateMember, deleteMember: handleDeleteMember }),
    [members, handleUpdateMember, handleDeleteMember],
  );

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
