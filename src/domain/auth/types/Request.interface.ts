import type { IUser } from "@domain/auth/types/User.interface";

export type SignUpRequestDTO = Pick<IUser, "username" | "nickname"> & {
  password: string;
  confirmPassword: string;
};
export type SignInRequestDTO = Pick<IUser, "username"> & {
  password: string;
};
