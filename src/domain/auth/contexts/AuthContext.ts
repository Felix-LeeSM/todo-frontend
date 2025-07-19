import type { IUser } from "@domain/auth/types/User.interface";
import { createContext } from "react";

export interface AuthContextType {
  user?: IUser;
  handleSignIn: (user: IUser) => void;
  handleLogOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  handleSignIn: () => {},
  handleLogOut: () => {},
});
