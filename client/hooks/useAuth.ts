import { useEffect, useState } from "react";

export type Role = "admin" | "analyst" | "viewer";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
};

const USER_KEY = "dcis:user";

const defaultUser: User = {
  id: "u_admin",
  name: "Ishan Agrawal",
  email: "ishan@example.com",
  role: "admin",
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : defaultUser;
  });

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user]);

  function hasRole(r: Role | Role[]) {
    const list = Array.isArray(r) ? r : [r];
    return !!user && list.includes(user.role);
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    location.reload();
  }

  return { user, setUser, hasRole, logout };
}
