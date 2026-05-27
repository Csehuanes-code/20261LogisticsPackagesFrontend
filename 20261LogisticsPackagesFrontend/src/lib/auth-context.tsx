import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  getStoredToken,
  getStoredUser,
  clearAuth,
  setStoredToken,
  setStoredUser,
  isTokenExpired,
  logout as authLogout,
  type AuthUser,
} from "../infrastructure/api/auth.api";

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(storedUser);
    } else if (storedToken && isTokenExpired(storedToken)) {
      clearAuth();
    }
    setReady(true);
  }, []);

  const setAuth = useCallback((newToken: string, newUser: AuthUser) => {
    setStoredToken(newToken);
    setStoredUser(newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setToken(null);
    setUser(null);
  }, []);

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
