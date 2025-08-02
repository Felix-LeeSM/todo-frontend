import type { User } from "@domain/auth/types/User";
import { createContext } from "react";
import type { SignInRequestDTO } from "../types/dto/auth.dto";

export interface AuthContextType {
  user?: User;
  handleSignIn?: (data: SignInRequestDTO) => Promise<void>;
  handleLogOut?: () => void;
}

export const AuthContext = createContext<AuthContextType>({});
