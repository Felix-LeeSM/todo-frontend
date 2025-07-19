import { GroupCard } from "@domain/group/components/GroupCard";
import GroupForm from "@domain/group/components/GroupForm";
import { groupApi } from "@domain/group/services/groupApi";
import type { IGroup } from "@domain/group/types/Group.interface";
import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { handleApiError } from "@/shared/handleApiError";

export default function GroupList() {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    groupApi
      .getGroups()
      .then((response) => setGroups(response))
      .catch(handleApiError)
      .finally(() => setIsLoading(false));
  }, []);

  const addGroup = (group: IGroup) => setGroups((groups) => [...groups, group]);

  const onDeleteGroup = (group: IGroup) =>
    groupApi
      .deleteGroup(group.id)
      .then(() => setGroups((groups) => groups.filter((g) => g.id !== group.id)))
      .catch(handleApiError);
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
          : groups.map((group) => (
              <GroupCard to={`/groups/${group.id}`} onDelete={onDeleteGroup} group={group} key={`group-${group.id}`} />
            ))}
      </div>
      {isModalOpen && <GroupForm onSubmit={addGroup} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
