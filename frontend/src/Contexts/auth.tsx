import { createContext, useContext, useEffect, useState } from "react";
import {
  logout as logoutService,
  login as loginService,
  getMe,
  loginGoogle as loginGoogleService,
  loginFacebook as loginFacebookService,
} from "@/Services/auth";
import { IUser } from "@/Types/user";

export interface IAuthContext {
  user?: IUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: (code: string) => Promise<void>;
  loginFacebook: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface IAuthProvider {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    await logoutService();
    setUser(undefined);
    localStorage.removeItem("user");
  };

  const login = async (email: string, password: string) => {
    const { user } = await loginService({ email, password });
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const loginGoogle = async (code: string) => {
    const { user } = await loginGoogleService(code);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const loginFacebook = async (code: string) => {
    const { user } = await loginFacebookService(code);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const updateUser = async () => {
    return getMe().then(({ user }) => {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
