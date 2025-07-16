import { AuthContext } from "@domain/auth/contexts/AuthContext";
import { authApi } from "@domain/auth/services/authApi";
import type { UserInterface } from "@domain/auth/types/User.interface";
import { LoaderCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<UserInterface>();
  const [isLoading, setIsLoading] = useState(true);

  const handleSignIn = (user: UserInterface) => setUser(user);

  const handleLogOut = () => {
    authApi.signOut().then((res) => res.status === 204 && setUser(undefined));
  };

  useEffect(() => {
    authApi
      .getMe()
      .then((res) => setUser(res))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const contextValue = { user, handleSignIn, handleLogOut };

  return (
    <>
      {isLoading ? (
        <LoaderCircle className="w-10 h-10 mx-auto mt-20 animate-spin" />
      ) : (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
      )}
    </>
  );
}
