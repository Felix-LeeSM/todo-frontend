import { LoaderCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { groupApi } from "../../services/groupApi";
import type { GroupInterface } from "../../type/Group.interface";
import { GroupContext } from "./GroupContext";

export function GroupProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [group, setGroup] = useState<GroupInterface>();
  const [isLoading, setIsLoading] = useState(true);

  const { groupId } = useParams<{ groupId: string }>();

  const handleSetGroup = (group?: GroupInterface) => {
    setGroup(group);
  };

  useEffect(() => {
    if (!groupId) return;
    const parsedId = parseInt(groupId, 10);
    if (Number.isNaN(parsedId)) return;

    groupApi
      .getGroupById(parsedId)
      .then((res) => setGroup(res))
      .catch(() => setGroup(undefined))
      .finally(() => setIsLoading(false));
  }, [groupId]);

  const contextValue = { group, handleSetGroup };

  return (
    <>
      {isLoading ? (
        <LoaderCircle className="w-10 h-10 mx-auto mt-20 animate-spin" />
      ) : (
        <GroupContext.Provider value={contextValue}>{children}</GroupContext.Provider>
      )}
    </>
  );
}
