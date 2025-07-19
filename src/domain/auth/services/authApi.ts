import type { SignInRequestDTO, SignUpRequestDTO } from "@domain/auth/types/Request.interface";
import type { IUser } from "@domain/auth/types/User.interface";
import axios, { type AxiosResponse } from "axios";

export const authApi = {
  signIn: (data: SignInRequestDTO): Promise<IUser> => {
    return axios.post<IUser>("/api/v1/user/token/access-token", data).then((res) => res.data);
  },

  signUp: (data: SignUpRequestDTO): Promise<IUser> => {
    return axios.post<IUser>("/api/v1/user", data).then((res) => res.data);
  },

  signOut: (): Promise<AxiosResponse<unknown, unknown>> => {
    return axios.delete("/api/v1/user/token");
  },

  getMe: (): Promise<IUser> => {
    return axios
      .get<IUser>("/api/v1/user/me")
      .then((res) => res.data)
      .catch();
  },
};
