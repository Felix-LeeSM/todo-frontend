import { AuthContext, type AuthContextType } from "@domain/auth/contexts/AuthContext";
import { useContext } from "react";
import type { WithRequired } from "@/shared/types.util";

export const useAuthActions = () => {
  const context = useContext(AuthContext);

  if (context === undefined) throw new Error("useAuth는 AuthProvider 안에서만 사용해야 합니다.");
  if (!context.handleLogOut) throw new Error("handleLogOut 함수가 AuthProvider에 의해 제공되지 않았습니다.");
  if (!context.handleSignIn) throw new Error("handleSignIn 함수가 AuthProvider에 의해 제공되지 않았습니다.");

  return context as WithRequired<AuthContextType, "handleLogOut" | "handleSignIn">;
};
