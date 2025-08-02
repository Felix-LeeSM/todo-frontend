import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { authApi } from "@domain/auth/services/authApi";
import type { User } from "@domain/auth/types/User";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastErrorMessage } from "@/shared/toastErrorMessage";
import type { SignInRequestDTO } from "../types/dto/auth.dto";

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleSignIn = (data: SignInRequestDTO) => {
    return authApi
      .signIn(data)
      .then((user) => {
        setUser(user);
      })
      .catch(toastErrorMessage);
  };

  const handleLogOut = () => {
    authApi.signOut().then((res) => {
      if (res.status === 204) {
        setUser(undefined);
        navigate("/");
        toast.info("로그아웃 되었습니다.");
      }
    });
  };

  useEffect(() => {
    authApi
      .getMe()
      .then((res) => setUser(res))
      .catch(() => {
        setUser(undefined);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const contextValue = { user, handleSignIn, handleLogOut };

  return <>{isLoading ? null : <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>}</>;
}
