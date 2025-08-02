import { toDetailedGroup, toFullGroupDetails, toGroup, toInvitaion } from "@domain/group/services/mapper";
import type {
  CreateGroupInvitationResponseDTO,
  CreateGroupRequestDTO,
  DetailedGroupResponseDTO,
  FullGroupDetailsResponseDTO,
  GroupInvitationInfoDTOResponse,
  GroupResponseDTO,
  UpdateGroupRequestDTO,
} from "@domain/group/types/dto/group.dto";
import type {
  DetailedGroup,
  FullGroupDetails,
  Group,
  GroupInvitationInfo,
  Invitation,
} from "@domain/group/types/Group";
import axios from "axios";
import type { UpdateMemberRequestDTO } from "../types/dto/member.dto";

export const groupApi = {
  getGroups: (): Promise<DetailedGroup[]> => {
    return axios.get<DetailedGroupResponseDTO[]>("/api/v1/group/my").then((res) => res.data.map(toDetailedGroup));
  },

  createGroup: (data: CreateGroupRequestDTO): Promise<Group> => {
    return axios.post<GroupResponseDTO>("/api/v1/group", data).then((res) => toGroup(res.data));
  },

  deleteGroup: (groupId: number): Promise<void> => {
    return axios.delete(`/api/v1/group/${groupId}`).then(() => {});
  },

  updateGroup: (groupId: number, data: UpdateGroupRequestDTO): Promise<Group> => {
    return axios.put<GroupResponseDTO>(`/api/v1/group/${groupId}`, data).then((res) => toGroup(res.data));
  },

  updateMember: (groupId: number, memberId: number, data: UpdateMemberRequestDTO): Promise<void> => {
    return axios.patch<void>(`/api/v1/group/${groupId}/member/${memberId}`, data).then();
  },

  deleteMember: (groupId: number, memberId: number): Promise<void> => {
    return axios.delete<void>(`/api/v1/group/${groupId}/member/${memberId}`).then();
  },

  getGroupById: (groupId: number): Promise<FullGroupDetails> => {
    return axios
      .get<FullGroupDetailsResponseDTO>(`/api/v1/group/${groupId}`)
      .then((res) => toFullGroupDetails(res.data));
  },

  createGroupInvitation: (groupId: number): Promise<Invitation> => {
    return axios
      .post<CreateGroupInvitationResponseDTO>(`/api/v1/group/${groupId}/invitation`)
      .then((res) => toInvitaion(res.data));
  },

  getInvitationInfo: (token: string): Promise<GroupInvitationInfo> => {
    return axios.get<GroupInvitationInfoDTOResponse>(`/api/v1/group/invitation/${token}`).then((res) => res.data);
  },

  acceptInvitation: (token: string): Promise<void> => {
    return axios.post(`/api/v1/group/invitation/${token}/accept`).then(() => {});
  },
};
