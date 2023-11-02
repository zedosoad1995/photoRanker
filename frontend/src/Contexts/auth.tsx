import { createContext, useContext, useState } from "react";
import {
  logout as logoutService,
  login as loginService,
  loginGoogle as loginGoogleService,
  loginFacebook as loginFacebookService,
} from "@/Services/auth";
import { IUser } from "@/Types/user";
import { getMe } from "@/Services/user";
import { useQuery } from "react-query";

interface IAuthContext {
  user?: IUser;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: (code: string) => Promise<void>;
  loginFacebook: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface IAuthProvider {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [user, setUser] = useState<IUser>();

  const { isLoading, refetch } = useQuery("logged-user", getMe, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: ({ user }) => {
      setUser(user);
    },
  });

  const logout = async () => {
    await logoutService();
    setUser(undefined);
  };

  const login = async (email: string, password: string) => {
    const { user } = await loginService({ email, password });
    setUser(user);
  };

  const loginGoogle = async (code: string) => {
    const { user } = await loginGoogleService(code);
    setUser(user);
  };

  const loginFacebook = async (code: string) => {
    const { user } = await loginFacebookService(code);
    setUser(user);
  };

  const updateUser = async () => {
    refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        logout,
        login,
        loginGoogle,
        loginFacebook,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
