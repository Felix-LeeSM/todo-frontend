import type { IDetailedGroup, IFullDetailedGroup, IGroupDetails } from "@domain/group/types/Group.interface";
import type { CreateGroupRequestDTO } from "@domain/group/types/Request.types";
import axios from "axios";

export const groupApi = {
  getGroups: () => {
    return axios.get<IDetailedGroup[]>("/api/v1/group/my").then((res) => res.data);
  },

  createGroup: (data: CreateGroupRequestDTO) => {
    return axios.post<IGroupDetails>("/api/v1/group", data).then((res) => res.data);
  },

  deleteGroup: (groupId: number) => {
    return axios.delete(`/api/v1/group/${groupId}`);
  },

  getGroupById: (groupId: number) => {
    return axios.get<IFullDetailedGroup>(`/api/v1/group/${groupId}`).then((res) => res.data);
  },
};
