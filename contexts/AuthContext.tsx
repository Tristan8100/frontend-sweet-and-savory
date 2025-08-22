
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;  // expose setter to update user externally
  login: (user: User, token: string) => void;
  logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem("token", token);
    console.log(token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};