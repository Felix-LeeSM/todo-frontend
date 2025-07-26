import { toDetailedGroup, toFullGroupDetails, toGroup } from "@domain/group/services/mapper";
import type {
  CreateGroupInvitationResponseDTO,
  CreateGroupRequestDTO,
  DetailedGroupResponseDTO,
  FullGroupDetailsResponseDTO,
  GroupInvitationInfoDTOResponse,
  GroupResponseDTO,
} from "@domain/group/types/dto/group.dto";
import type { DetailedGroup, FullGroupDetails, Group } from "@domain/group/types/Group";
import axios from "axios";

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

  getGroupById: (groupId: number): Promise<FullGroupDetails> => {
    return axios
      .get<FullGroupDetailsResponseDTO>(`/api/v1/group/${groupId}`)
      .then((res) => toFullGroupDetails(res.data));
  },

  createGroupInvitation: (groupId: number): Promise<CreateGroupInvitationResponseDTO> => {
    return axios.post<CreateGroupInvitationResponseDTO>(`/api/v1/group/${groupId}/invitation`).then((res) => res.data);
  },

  getInvitationInfo: (token: string): Promise<GroupInvitationInfoDTOResponse> => {
    return axios.get<GroupInvitationInfoDTOResponse>(`/api/v1/group/invitation/${token}`).then((res) => res.data);
  },

  acceptInvitation: (token: string): Promise<void> => {
    return axios.post(`/api/v1/group/invitation/${token}/accept`).then(() => {});
  },
};
