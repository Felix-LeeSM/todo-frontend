import type {
  DetailedGroupResponseDTO,
  FullGroupDetailsResponseDTO,
  GroupResponseDTO,
} from "@domain/group/types/dto/group.dto";
import type { MemberDTO } from "@domain/group/types/dto/member.dto";
import type { DetailedGroup, FullGroupDetails, Group, GroupRole } from "@domain/group/types/Group";
import type { Member } from "@domain/group/types/Member";
import { toTodoWithStarred } from "@domain/todo/services/mapper";

export const toMember = (memberDto: MemberDTO): Member => ({
  id: memberDto.id,
  nickname: memberDto.nickname,
  groupId: memberDto.groupId,
  role: memberDto.role,
});

export const toGroup = (groupDto: GroupResponseDTO): Group => ({
  id: groupDto.id,
  name: groupDto.name,
  description: groupDto.description,
});

export const toDetailedGroup = (groupDto: DetailedGroupResponseDTO): DetailedGroup => ({
  id: groupDto.id,
  name: groupDto.name,
  description: groupDto.description,
  todoCount: groupDto.todoCount,
  completedTodoCount: groupDto.completedTodoCount,
  members: groupDto.members.map(toMember),
  memberCount: groupDto.memberCount,
  myRole: groupDto.myRole,
});

export const toFullGroupDetails = (groupDto: FullGroupDetailsResponseDTO): FullGroupDetails => ({
  id: groupDto.id,
  name: groupDto.name,
  description: groupDto.description,
  members: groupDto.members.map(toMember),
  memberCount: groupDto.memberCount,
  myRole: groupDto.myRole,
  todos: groupDto.todos.map(toTodoWithStarred),
});

export const toRoleDisplayName = (role: GroupRole) => {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "MANAGER":
      return "Manager";
    case "MEMBER":
      return "Member";
    case "VIEWER":
      return "Viewer";
    default:
      return "Invalid";
  }
};
