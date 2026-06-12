import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "admin" | "editor";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  name: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
}

const USER_KEY = "ab.auth.user";
const TOKEN_KEY = "ab.auth.token";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_KEY);
      const t = localStorage.getItem(TOKEN_KEY);
      if (u) setUser(JSON.parse(u));
      if (t) setToken(t);
    } catch {}
    setLoading(false);
  }, []);

  const login = async (newToken: string, userData: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  const updateProfile = (patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}