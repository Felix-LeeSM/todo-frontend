import { compareGroupRole } from "@domain/group/services/compareGroupRole";
import { toRoleDisplayName } from "@domain/group/services/mapper";
import type { UpdateMemberRequestDTO } from "@domain/group/types/dto/member.dto";
import type { GroupRole, GroupRoleArray } from "@domain/group/types/GroupRole";
import type { Member } from "@domain/group/types/Member";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@domain/shared/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Badge } from "@domain/shared/components/ui/badge";
import { Button } from "@domain/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@domain/shared/components/ui/select";
import { Crown, Shield, Trash2, User } from "lucide-react";

interface MembersEditorProps {
  members: Member[];
  myRole: GroupRole;
  onUpdateMember: (memberId: number, data: UpdateMemberRequestDTO) => void;
  onDeleteMember: (memberId: number) => void;
}

export function MembersEditor({ members, myRole, onUpdateMember, onDeleteMember }: MembersEditorProps) {
  const getRoleIcon = (role: GroupRole) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "MANAGER":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeVariant = (role: GroupRole) => {
    switch (role) {
      case "OWNER":
        return "default";
      case "MANAGER":
        return "secondary";
      default:
        return "outline";
    }
  };

  const roles: GroupRoleArray = ["OWNER", "MANAGER", "MEMBER", "VIEWER"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>멤버 관리</CardTitle>
        <CardDescription>그룹 멤버들의 역할을 관리하고 멤버를 제거할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{member.nickname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{member.nickname}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center space-x-1">
                  {getRoleIcon(member.role)}
                  <span>{toRoleDisplayName(member.role)}</span>
                </Badge>

                {compareGroupRole(myRole, "gt", member.role) && compareGroupRole(myRole, "gte", "MANAGER") && (
                  <div className="flex items-center space-x-2">
                    <Select
                      value={member.role}
                      onValueChange={(value: Exclude<GroupRole, "OWNER">) => onUpdateMember(member.id, { role: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles
                          .filter((role) => role !== "OWNER")
                          .map((role) => (
                            <SelectItem key={role} value={role}>
                              {toRoleDisplayName(role)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>멤버 제거</AlertDialogTitle>
                          <AlertDialogDescription>
                            {member.nickname}님을 그룹에서 제거하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteMember(member.id)}>제거</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
