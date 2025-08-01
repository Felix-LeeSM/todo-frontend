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
        </TabsList>

        <TabsContent value="general">
          <GroupInfoEditor group={group} onUpdateGroup={updateGroup} />
        </TabsContent>

        <TabsContent value="members">
          <MembersEditor
            members={members}
            myRole={myRole}
            onUpdateMember={updateMember}
            onDeleteMember={deleteMember}
          />
        </TabsContent>

        <TabsContent value="invite">
          <InvitationLinkGenerator onCreateInvitation={createInvitation} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
