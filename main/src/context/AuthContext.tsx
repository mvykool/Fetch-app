import React, { createContext, useState, useCallback } from "react";
import { AuthContextType, User } from "../types";
import api from "../services/fetchApi";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback(async (name: string, email: string) => {
    try {
      await api.auth.login(name, email);
      const newUser = { name, email };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
