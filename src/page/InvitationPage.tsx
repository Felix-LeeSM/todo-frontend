import { groupApi } from "@domain/group/services/groupApi";
import { toRoleDisplayName } from "@domain/group/services/mapper";
import type { GroupInvitationInfo } from "@domain/group/types/Group";
import type { GroupRole } from "@domain/group/types/GroupRole";
import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Badge } from "@domain/shared/components/ui/badge";
import { Button } from "@domain/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { Calendar, CheckCircle, Crown, Loader2, LogIn, Shield, User, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toastErrorMessage } from "@/shared/toastErrorMessage";

const ActionRenderer = ({
  groupInfo,
  isJoining,
  handleJoinGroup,
}: {
  groupInfo: GroupInvitationInfo;
  isJoining: boolean;
  handleJoinGroup: () => void;
}) => {
  if (groupInfo.isMember) {
    return (
      <Button asChild className="w-full">
        <Link to={`/groups/${groupInfo.groupId}`}>
          <LogIn className="mr-2 h-4 w-4" />
          그룹으로 바로가기
        </Link>
      </Button>
    );
  }
  if (groupInfo.isExpired) {
    return (
      <>
        <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          이 초대 링크는 만료되었습니다.
        </div>
        <Button className="w-full" disabled>
          <XCircle className="mr-2 h-4 w-4" />
          참여 불가 (만료됨)
        </Button>
      </>
    );
  }
  return (
    <Button onClick={handleJoinGroup} className="w-full" disabled={isJoining}>
      {isJoining ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          그룹에 참여하는 중...
        </>
      ) : (
        <>
          <Users className="mr-2 h-4 w-4" />
          그룹에 참여하기
        </>
      )}
    </Button>
  );
};

export default function InvitationPage() {
  const { token = "" } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [groupInfo, setGroupInfo] = useState<GroupInvitationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    groupApi
      .getInvitationInfo(token)
      .then((info) => {
        setGroupInfo(info);
      })
      .catch((e) => {
        // API가 410 Gone 등 에러를 반환하면 여기서 처리됩니다.
        toastErrorMessage(e);
        setError(e?.message || "알 수 없는 오류가 발생했습니다.");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleJoinGroup = () => {
    if (!groupInfo) return;
    setIsJoining(true);

    groupApi
      .acceptInvitation(token)
      .then(() => {
        navigate(`/groups/${groupInfo.groupId}`);
      })
      .catch((e) => {
        toastErrorMessage(e);
      })
      .finally(() => setIsJoining(false));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "admin":
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">초대 정보를 확인하고 있습니다...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TodoFlow</span>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-600">초대 링크 오류</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  초대 링크가 만료되었거나 유효하지 않을 수 있습니다. 그룹 관리자에게 새로운 초대 링크를 요청해주세요.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/groups">내 그룹 보기</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                    <Link to="/">홈으로 돌아가기</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!groupInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TodoFlow</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">그룹 초대</CardTitle>
            <CardDescription>
              <span className="font-medium">{groupInfo.issuer.nickname}</span>님이 그룹에 초대하셨습니다!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Group Info */}
            <div className="text-center space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{groupInfo.name}</h2>
                <p className="text-gray-600">{groupInfo.description}</p>
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{groupInfo.memberCount}</p>
                  <p className="text-sm text-gray-600">멤버</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{groupInfo.todoCount}</p>
                  <p className="text-sm text-gray-600">할일</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{groupInfo.completedTodoCount}</p>
                  <p className="text-sm text-gray-600">완료</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>진행률</span>
                  <span>
                    {groupInfo.completedTodoCount}/{groupInfo.todoCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width:
                        groupInfo.todoCount > 0
                          ? `${(groupInfo.completedTodoCount / groupInfo.todoCount) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Members Preview */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">현재 멤버</h3>
              <div className="space-y-2">
                {groupInfo.members.slice(0, 4).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-xs">{member.nickname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{member.nickname}</span>
                    </div>
                    <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center space-x-1">
                      {getRoleIcon(member.role)}
                      <span className="text-xs">{toRoleDisplayName(member.role)}</span>
                    </Badge>
                  </div>
                ))}
                {groupInfo.members.length > 4 && (
                  <div className="text-center text-sm text-gray-500 py-2">+{groupInfo.members.length - 4}명 더</div>
                )}
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <ActionRenderer groupInfo={groupInfo} isJoining={isJoining} handleJoinGroup={handleJoinGroup} />
              <div className="flex justify-end flex-col sm:flex-row gap-2">
                <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                  <Link to="/groups">내 그룹 보기</Link>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                  <Link to="/">홈으로 돌아가기</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
