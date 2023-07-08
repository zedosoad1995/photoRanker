"use client";

import { getMe } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { IGetMeRes } from "../../backend/src/types/user";
import { logout as logoutService, login as loginService } from "@/services/auth";

export interface IAuthContext {
  user?: IGetMeRes["user"];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  login: async (email: string, password: string) => {},
  logout: async () => {},
});

interface IAuthProvider {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [user, setUser] = useState<IGetMeRes["user"]>();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      getMe().then((res) => {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(user));
      });
    }
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

  return <AuthContext.Provider value={{ user, logout, login }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
