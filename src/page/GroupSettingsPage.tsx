import { GroupInfoEditor } from "@domain/group/components/GroupInfoEditor";
import { GroupSettingsHeader } from "@domain/group/components/GroupSettingsHeader";
import { useGroupInfo } from "@domain/group/hooks/useGroupInfo";
import { useGroupMembers } from "@domain/group/hooks/useGroupMembers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@domain/shared/components/ui/tabs";
import { InvitationLinkGenerator } from "@domain/todo/components/InvitationLinkGenerator";
import { MembersEditor } from "@domain/todo/components/MembersEditor";

export default function GroupSettingsPage() {
  const { group, myRole, updateGroup, createInvitation } = useGroupInfo();
  const { members, updateMember, deleteMember } = useGroupMembers();

  return (
    <main className="container bg-gray-50 mx-auto px-4 py-8">
      <GroupSettingsHeader group={group} myRole={myRole} members={members} />
      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="members">멤버</TabsTrigger>
          <TabsTrigger value="invite">초대</TabsTrigger>
          {/* {myRole === "OWNER" && <TabsTrigger value="danger">위험</TabsTrigger>} */}
        </TabsList>

        <TabsContent value="general">
          <GroupInfoEditor group={group} onUpdateGroup={updateGroup} />
        </TabsContent>

        {/* Members Management */}
        <TabsContent value="members">
          <MembersEditor
            members={members}
            myRole={myRole}
            onUpdateMember={updateMember}
            onDeleteMember={deleteMember}
          />
        </TabsContent>

        {/* Invite Members */}
        <TabsContent value="invite">
          <InvitationLinkGenerator onCreateInvitation={createInvitation} />
        </TabsContent>

        {/* Danger Zone */}
        {/* {myRole === "OWNER" && (
          <TabsContent value="danger">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">위험 구역</CardTitle>
                <CardDescription>이 작업들은 되돌릴 수 없습니다. 신중하게 진행하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      그룹 삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>그룹 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        정말로 이 그룹을 삭제하시겠습니까? 모든 할일과 데이터가 영구적으로 삭제되며, 이 작업은 되돌릴 수
                        없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteGroup} className="bg-red-600 hover:bg-red-700">
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        )} */}
      </Tabs>
    </main>
  );
}
