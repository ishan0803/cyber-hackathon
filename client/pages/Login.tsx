import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, type User } from "@/hooks/useAuth";

export default function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const nav = useNavigate();

  function signIn() {
    const role = /admin/i.test(email) ? "admin" : "analyst";
    const u: User = { id: crypto.randomUUID(), name: name || "Analyst", email, role } as User;
    setUser(u);
    nav("/", { replace: true });
  }

  return (
    <div className="min-h-svh grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <h1 className="text-lg font-semibold mb-2">Sign in</h1>
        <div className="space-y-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-900 border-slate-800" />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-900 border-slate-800" />
          <Button className="w-full" onClick={signIn}>Continue</Button>
          <div className="text-xs text-muted-foreground">Tip: include "admin" in email to sign in as admin.</div>
        </div>
      </div>
    </div>
  );
}
