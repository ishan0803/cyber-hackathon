import { useEffect, useState } from "react";

export type Role = "admin" | "analyst" | "viewer";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
};

export type Account = User & { username: string; password: string };

const USER_KEY = "dcis:user";
const USERS_KEY = "dcis:users";

function seedUsers(): Account[] {
  const existing = localStorage.getItem(USERS_KEY);
  if (existing) return JSON.parse(existing) as Account[];
  const seeded: Account[] = [
    {
      id: "acc_admin",
      username: "admin",
      password: "admin123",
      name: "Administrator",
      email: "admin@example.com",
      role: "admin",
    },
    {
      id: "acc_analyst",
      username: "analyst",
      password: "analyst123",
      name: "Analyst User",
      email: "analyst@example.com",
      role: "analyst",
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [users, setUsers] = useState<Account[]>(() => seedUsers());

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user]);

  function hasRole(r: Role | Role[]) {
    const list = Array.isArray(r) ? r : [r];
    return !!user && list.includes(user.role);
  }

  function signIn(username: string, password: string) {
    const acc = users.find(
      (u) => u.username === username && u.password === password,
    );
    if (!acc) return false;
    const { password: _pw, username: _un, ...u } = acc;
    setUser(u);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {}
    return true;
  }

  function addUser(acc: Omit<Account, "id">) {
    const id = crypto.randomUUID();
    setUsers((prev) => [...prev, { ...acc, id }]);
  }

  function removeUser(id: string) {
    // prevent removing last admin
    const admins = users.filter((u) => u.role === "admin");
    const target = users.find((u) => u.id === id);
    if (target?.role === "admin" && admins.length <= 1) return false;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return true;
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    location.reload();
  }

  return { user, users, setUser, hasRole, signIn, addUser, removeUser, logout };
}
