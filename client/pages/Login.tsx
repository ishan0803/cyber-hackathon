import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Animated3DBackground } from "@/components/Animated3DBackground";
import { toast } from "sonner";

export default function Login() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  function handleSignIn() {
    const ok = signIn(username.trim(), password);
    if (!ok) {
      toast.error("Invalid credentials");
      return;
    }
    nav("/", { replace: true });
  }

  return (
    <div className="min-h-svh grid place-items-center p-4 relative">
      <Animated3DBackground />
      <div className="w-full max-w-sm rounded-xl border border-slate-800/60 bg-slate-900/60 p-4 shadow-2xl backdrop-blur">
        <h1 className="text-lg font-semibold mb-2">Sign in</h1>
        <div className="space-y-3">
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-slate-900 border-slate-800" />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-900 border-slate-800" />
          <Button className="w-full" onClick={handleSignIn}>Continue</Button>
          <div className="text-xs text-muted-foreground">Demo: admin/admin123 or analyst/analyst123</div>
        </div>
      </div>
    </div>
  );
}
