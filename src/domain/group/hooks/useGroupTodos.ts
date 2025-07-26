import { GroupTodosContext, type GroupTodosContextType } from "@domain/group/contexts/GroupContext";
import { useContext } from "react";
import type { WithRequired } from "@/shared/types.util";

export const useGroupTodos = () => {
  const context = useContext(GroupTodosContext);

  if (context === undefined) throw new Error("useGroupTodos는 GroupProvider 안에서만 사용해야 합니다.");
  if (!context.todos) throw new Error("Group Todo 정보가 없습니다. Provider 로직을 확인하세요.");
  if (!context.createTodo) throw new Error("createTodo 함수가 GroupProvider에 의해 제공되지 않았습니다.");
  if (!context.updateTodoDetails) throw new Error("updateTodoDetails 함수가 GroupProvider에 의해 제공되지 않았습니다.");
  if (!context.updateTodoMetadata)
    throw new Error("updateTodoMetadata 함수가 GroupProvider에 의해 제공되지 않았습니다.");
  if (!context.starTodo) throw new Error("starTodo 함수가 GroupProvider에 의해 제공되지 않았습니다.");
  if (!context.unstarTodo) throw new Error("unstarTodo 함수가 GroupProvider에 의해 제공되지 않았습니다.");
  if (!context.moveTodo) throw new Error("moveTodo 함수가 GroupProvider에 의해 제공되지 않았습니다.");
  if (!context.deleteTodo) throw new Error("deleteTodo 함수가 GroupProvider에 의해 제공되지 않았습니다.");

  return context as WithRequired<
    GroupTodosContextType,
    | "todos"
    | "createTodo"
    | "updateTodoDetails"
    | "updateTodoMetadata"
    | "starTodo"
    | "unstarTodo"
    | "moveTodo"
    | "deleteTodo"
  >;
};
