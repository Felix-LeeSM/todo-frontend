import type { User } from "@domain/auth/types/User";
import { createContext } from "react";

export interface AuthContextType {
  user?: User;
  handleSignIn: (user: User) => void;
  handleLogOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  handleSignIn: () => {},
  handleLogOut: () => {},
});
