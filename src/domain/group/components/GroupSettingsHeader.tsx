import type { Group } from "@domain/group/types/Group";
import type { Member } from "@domain/group/types/Member";
import { Button } from "@domain/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { GroupRole } from "../types/GroupRole";

interface GroupSettingsHeaderProps {
  group: Group;
  members: Member[];
  myRole: GroupRole;
}

export function GroupSettingsHeader({ group }: GroupSettingsHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Link to="/groups" className="text-gray-500 hover:text-gray-700">
            그룹
          </Link>
          <span className="text-gray-400">/</span>
          <Link to={`/groups/${group.id}`} className="text-gray-500 hover:text-gray-700">
            {group.name}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">설정</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
        <p className="text-gray-600">{group.description}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
          <Link to={`/groups/${group.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            그룹으로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  );
}
