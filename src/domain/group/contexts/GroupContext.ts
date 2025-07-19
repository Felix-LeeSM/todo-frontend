import type { IGroupDetails, IGroupMembersInfo } from "@domain/group/types/Group.interface";
import type { ITodo } from "@domain/todo/types/Todo.interface";
import { createContext } from "react";

export interface GroupContextType {
  groupDetails?: IGroupDetails;
  setGroupDetails: (details?: IGroupDetails) => void;
  groupMembersInfo?: IGroupMembersInfo;
  setGroupMembersInfo: (membersInfo?: IGroupMembersInfo) => void;
  todos: ITodo[];
  setTodos: (todos: ITodo[]) => void;
}

export const GroupContext = createContext<GroupContextType>({
  setGroupDetails: () => {},
  setGroupMembersInfo: () => {},
  todos: [],
  setTodos: () => {},
});
