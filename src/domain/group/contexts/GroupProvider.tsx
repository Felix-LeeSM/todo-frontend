import { GroupContext } from "@domain/group/contexts/GroupContext";
import { groupApi } from "@domain/group/services/groupApi";
import type { IGroupDetails, IGroupMembersInfo } from "@domain/group/types/Group.interface";
import type { ITodo } from "@domain/todo/types/Todo.interface";
import type React from "react";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

export function GroupProvider({ loadingComponent }: { loadingComponent?: React.ReactNode }): React.ReactElement {
  const [groupDetails, setGroupDetails] = useState<IGroupDetails>();
  const [groupMembersInfo, setGroupMembersInfo] = useState<IGroupMembersInfo>();
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { groupId } = useParams<{ groupId: string }>();

  useEffect(() => {
    if (!groupId) return;
    const parsedId = parseInt(groupId, 10);
    if (Number.isNaN(parsedId)) return;

    groupApi
      .getGroupById(parsedId)
      .then((res) => {
        setGroupDetails({ id: res.id, name: res.name, description: res.description });
        setGroupMembersInfo({ members: res.members, memberCount: res.memberCount, myRole: res.myRole });
        setTodos(res.todos);
      })
      .catch(() => {
        setGroupDetails(undefined);
        setGroupMembersInfo(undefined);
        setTodos([]);
      })
      .finally(() => setIsLoading(false));
  }, [groupId]);

  const contextValue = { groupDetails, setGroupDetails, groupMembersInfo, setGroupMembersInfo, todos, setTodos };

  return (
    <>
      {isLoading ? (
        loadingComponent
      ) : (
        <GroupContext.Provider value={contextValue}>
          <Outlet />
        </GroupContext.Provider>
      )}
    </>
  );
}
