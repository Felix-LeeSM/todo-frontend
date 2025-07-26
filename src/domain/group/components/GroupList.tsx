import { useAuth } from "@domain/auth/hooks/useAuth";
import { GroupCard } from "@domain/group/components/GroupCard";
import GroupForm from "@domain/group/components/GroupForm";
import { groupApi } from "@domain/group/services/groupApi";
import type { DetailedGroup } from "@domain/group/types/Group";
import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toastErrorMessage } from "@/shared/toastErrorMessage";
import type { CreateGroupRequestDTO } from "../types/dto/group.dto";

export default function GroupList() {
  const { user } = useAuth();
  const [detailedGroups, setDtailedGroups] = useState<DetailedGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    groupApi
      .getGroups()
      .then((response) => setDtailedGroups(response))
      .catch(toastErrorMessage)
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = (group: CreateGroupRequestDTO) => {
    return groupApi
      .createGroup(group)
      .then((created) => {
        const detailedGroup: DetailedGroup = {
          ...created,
          todoCount: 0,
          completedTodoCount: 0,
          members: [
            {
              id: user.id,
              groupId: created.id,
              role: "OWNER",
              nickname: user.nickname,
            },
          ],
          memberCount: 1,
          myRole: "OWNER",
        };

        setDtailedGroups((groups) => [...groups, detailedGroup]);
      })
      .catch(toastErrorMessage);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Your Groups</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
          aria-label="Add new group"
        >
          <Plus className="w-5 h-5" />
          <span>Add Group</span>
        </button>
      </div>
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoaderCircle className="animate-spin h-10 w-10 mt-20" />
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? null
          : detailedGroups.map((group) => (
              <GroupCard to={`/groups/${group.id}`} group={group} key={`group-${group.id}`} />
            ))}
      </div>
      {isModalOpen && <GroupForm onSubmit={onSubmit} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
