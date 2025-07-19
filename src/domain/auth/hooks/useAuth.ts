import { AuthContext, type AuthContextType } from "@domain/auth/contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { WithRequired } from "@/shared/types.util";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (context === undefined) throw new Error("useAuth는 AuthProvider 안에서만 사용해야 합니다.");

  if (!context.user) {
    navigate("/");
    throw new Error("user가 없습니다. Protected 라우트 등을 확인하세요.");
  }

  return context as WithRequired<AuthContextType, "user">;
};
