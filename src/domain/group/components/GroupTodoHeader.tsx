import { CreateTodoDialog } from "@domain/group/components/CreateTodoDialog.tsx";
import { compareGroupRole } from "@domain/group/services/compareGroupRole";
import type { Group } from "@domain/group/types/Group";
import type { Member } from "@domain/group/types/Member";
import { Avatar, AvatarFallback, AvatarImage } from "@domain/shared/components/ui/avatar";
import { Button } from "@domain/shared/components/ui/button";
import type { CreateTodoParams } from "@domain/todo/types/dto/todo.dto";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import type { GroupRole } from "../types/GroupRole";

interface GroupTodoHeaderProps {
  group: Group;
  members: Member[];
  myRole: GroupRole;
  onCreateTodo: (data: CreateTodoParams) => void;
}

export function GroupTodoHeader({ group, members, myRole, onCreateTodo }: GroupTodoHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Link to="/groups" className="text-gray-500 hover:text-gray-700">
            그룹
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{group.name}</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
        <p className="text-gray-600">{group.description}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex -space-x-2">
          {members.slice(0, 4).map((member) => (
            <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xs">{member.nickname.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {members.length > 4 && (
            <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span className="text-xs text-gray-600">+{members.length - 4}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {compareGroupRole(myRole, "gte", "MANAGER") && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/groups/${group.id}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Link>
            </Button>
          )}

          {compareGroupRole(myRole, "gte", "MEMBER") && (
            <CreateTodoDialog members={members} onCreateTodo={onCreateTodo} />
          )}
        </div>
      </div>
    </div>
  );
}
