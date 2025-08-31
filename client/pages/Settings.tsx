import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth, type Account } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const KEY = "dcis:settings";

type Settings = {
  disclaimerAccepted: boolean;
  dataRetentionDays: number;
  useSynthetic: boolean;
};

export default function SettingsPage() {
  const [s, setS] = useState<Settings>({
    disclaimerAccepted: true,
    dataRetentionDays: 30,
    useSynthetic: true,
  });
  const { user, users, addUser, removeUser } = useAuth();
  const [form, setForm] = useState<Omit<Account, "id">>({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "analyst",
    avatarUrl: undefined,
  });

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setS(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(s));
  }, [s]);

  function handleAdd() {
    if (!form.username || !form.password) {
      toast.error("Username and password required");
      return;
    }
    if (users.some((u) => u.username === form.username)) {
      toast.error("Username already exists");
      return;
    }
    addUser(form);
    setForm({
      username: "",
      password: "",
      name: "",
      email: "",
      role: "analyst",
      avatarUrl: undefined,
    });
    toast.success("User added");
  }

  function handleRemove(id: string) {
    const ok = removeUser(id);
    if (!ok) toast.error("Cannot remove the last admin");
    else toast.success("User removed");
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Legal & Ethics</h3>
          <p className="text-sm text-muted-foreground">
            Mandatory legal disclaimer, privacy guardrails, free-speech
            compliance.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Switch
              checked={s.disclaimerAccepted}
              onCheckedChange={(v) => setS({ ...s, disclaimerAccepted: v })}
            />
            <span className="text-sm">I acknowledge the legal disclaimer</span>
          </div>
        </section>
        <section className="col-span-12 lg:col-span-6 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Data Retention</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1"
              value={s.dataRetentionDays}
              onChange={(e) =>
                setS({
                  ...s,
                  dataRetentionDays: parseInt(e.target.value || "0"),
                })
              }
            />
            <span className="text-sm">days</span>
          </div>
        </section>
        <section className="col-span-12 lg:col-span-6 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Data Source</h3>
          <div className="flex items-center gap-3">
            <Switch
              checked={s.useSynthetic}
              onCheckedChange={(v) => setS({ ...s, useSynthetic: v })}
            />
            <span className="text-sm">Synthetic vs Live API source</span>
          </div>
          <div className="mt-3">
            <Button size="sm">Save</Button>
          </div>
        </section>

        {user?.role === "admin" && (
          <section className="col-span-12 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
            <h3 className="font-semibold mb-2">User Management</h3>
            <div className="text-sm text-muted-foreground mb-2">
              Add or remove users. You cannot remove the last admin.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="text-left">Username</th>
                    <th className="text-left">Name</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-slate-800/70">
                      <td>{u.username}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <Badge variant="outline" className="border-slate-700">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(u.id)}
                          disabled={u.id === user.id}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
              <input
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <input
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <input
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <select
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as any })
                }
              >
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
              <div className="md:col-span-5">
                <Button size="sm" onClick={handleAdd}>
                  Add User
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
