import type { GroupRole, IDetailedGroup } from "@domain/group/types/Group.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Badge } from "@domain/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@domain/shared/components/ui/card";
import { Calendar, Crown, Settings, User, Users } from "lucide-react";

import { Link } from "react-router-dom";

export interface GroupCardProps {
  group: IDetailedGroup;
  to: string;
}

export function GroupCard({ group, to }: GroupCardProps) {
  const getRoleIcon = (role: GroupRole) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "MANAGER":
        return <Settings className="h-4 w-4 text-blue-500" />;
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

  return (
    <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
      <Link to={to}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base lg:text-lg mb-1 truncate">{group.name}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">{group.description}</CardDescription>
            </div>
            <Badge variant={getRoleBadgeVariant(group.myRole)} className="ml-2 shrink-0">
              <div className="flex items-center space-x-1">
                {getRoleIcon(group.myRole)}
                <span className="capitalize text-xs">{group.myRole}</span>
              </div>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>진행률</span>
                <span>
                  {group.completedTodoCount}/{group.todoCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: group.todoCount > 0 ? `${(group.completedTodoCount / group.todoCount) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{group.memberCount}명</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{group.todoCount}개 할일</span>
              </div>
            </div>

            {/* Members Preview */}
            <div>
              <p className="text-sm text-gray-600 mb-2">멤버</p>
              <div className="flex -space-x-2">
                {group.members.slice(0, 4).map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">{member.nickname.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 4 && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{group.members.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
