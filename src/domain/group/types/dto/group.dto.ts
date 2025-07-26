import type { MemberDTO } from "@domain/group/types/dto/member.dto";
import type { TodoWithStarredStatusResponseDTO } from "@domain/todo/types/dto/todo.dto";

export interface CreateGroupRequestDTO {
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
  name: string;
  description: string;
  todoCount: number;
  completedTodoCount: number;
  memberCount: number;
  issuer: MemberDTO;
  members: MemberDTO[];
  expiresAt: string;
}

export type GroupRole = "OWNER" | "MANAGER" | "MEMBER" | "VIEWER";
