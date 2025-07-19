import { useAuth } from "@domain/auth/hooks/useAuth";
import { GroupCard } from "@domain/group/components/GroupCard";
import GroupForm, { type GroupFormData } from "@domain/group/components/GroupForm";
import { groupApi } from "@domain/group/services/groupApi";
import type { IDetailedGroup } from "@domain/group/types/Group.interface";
import type { IMember } from "@domain/group/types/Member.interface";
import { Button } from "@domain/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@domain/shared/components/ui/dialog";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { handleApiError } from "@/shared/handleApiError";

export function GroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<IDetailedGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    groupApi
      .getGroups()
      .then((groups) => setGroups(groups))
      .catch(handleApiError)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = (formData: GroupFormData) => {
    return groupApi.createGroup(formData).then((group) => {
      const member: IMember = {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        role: "OWNER",
        groupId: group.id,
      };
      const newGroup: IDetailedGroup = {
        todoCount: 0,
        completedTodoCount: 0,
        members: [member],
        memberCount: 1,
        myRole: "OWNER",
        ...group,
      };

      setGroups([...groups, newGroup]);
      setIsCreateDialogOpen(false);
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">내 그룹</h1>
          <p className="text-gray-600">참여 중인 그룹들을 확인하고 관리하세요.</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />새 그룹 만들기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 그룹 만들기</DialogTitle>
              <DialogDescription>새로운 그룹을 만들어 팀원들과 함께 할일을 관리하세요.</DialogDescription>
            </DialogHeader>
            <GroupForm onClose={() => setIsCreateDialogOpen(false)} onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} to={`/groups/${group.id}`} />
        ))}
      </div>

      {isLoading ? null : groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">아직 그룹이 없습니다</h3>
          <p className="text-gray-600 mb-4">첫 번째 그룹을 만들어 할일 관리를 시작해보세요.</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />새 그룹 만들기
          </Button>
        </div>
      ) : null}
    </main>
  );
}
