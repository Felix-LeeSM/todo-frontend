import { toUser } from "@domain/auth/services/mapper";
import type { SignInRequestDTO, SignUpRequestDTO, UserResponseDTO } from "@domain/auth/types/dto/auth.dto";
import type { User } from "@domain/auth/types/User";
import axios, { type AxiosResponse } from "axios";

export const authApi = {
  signIn: (data: SignInRequestDTO): Promise<User> => {
    return axios.post<UserResponseDTO>("/api/v1/user/token/access-token", data).then((res) => toUser(res.data));
  },

  signUp: (data: SignUpRequestDTO): Promise<User> => {
    return axios.post<UserResponseDTO>("/api/v1/user", data).then((res) => toUser(res.data));
  },

  signOut: (): Promise<AxiosResponse<unknown, unknown>> => {
    return axios.delete("/api/v1/user/token");
  },

  getMe: (): Promise<User> => {
    return axios.get<UserResponseDTO>("/api/v1/user/me").then((res) => toUser(res.data));
  },
};
