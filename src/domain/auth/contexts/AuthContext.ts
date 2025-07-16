import type { UserInterface } from "@domain/auth/types/User.interface";
import { createContext } from "react";

export interface AuthContextType {
  user?: UserInterface;
  handleSignIn: (user: UserInterface) => void;
  handleLogOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  handleSignIn: () => {},
  handleLogOut: () => {},
});
