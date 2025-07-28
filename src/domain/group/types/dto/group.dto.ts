import type { MemberDTO } from "@domain/group/types/dto/member.dto";
import type { TodoWithStarredStatusResponseDTO } from "@domain/todo/types/dto/todo.dto";
import type { GroupRole } from "../GroupRole";

export interface CreateGroupRequestDTO {
  name: string;
  description: string;
}

export interface UpdateGroupRequestDTO {
  name: string;
  description: string;
}

export interface GroupResponseDTO {
  id: number;
  name: string;
  description: string;
}

export interface DetailedGroupResponseDTO {
  id: number;
  name: string;
  description: string;
  todoCount: number;
  completedTodoCount: number;
  members: MemberDTO[];
  memberCount: number;
  myRole: GroupRole;
}

export interface FullGroupDetailsResponseDTO {
  id: number;
  name: string;
  description: string;
  members: MemberDTO[];
  memberCount: number;
  myRole: GroupRole;
  todos: TodoWithStarredStatusResponseDTO[];
}

export interface CreateGroupInvitationResponseDTO {
  token: string;
  expiresAt: string;
}

export interface GroupInvitationInfoDTOResponse {
  groupId: number;
  name: string;
  description: string;
  todoCount: number;
  completedTodoCount: number;
  memberCount: number;
  issuer: MemberDTO;
  members: MemberDTO[];
  expiresAt: string;
}
