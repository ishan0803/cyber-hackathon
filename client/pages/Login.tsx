import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedNetworkBackground } from "@/components/AnimatedNetworkBackground";
import { toast } from "sonner";

export default function Login() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  function handleSignIn(e?: React.FormEvent) {
    e?.preventDefault();
    const ok = signIn(username.trim(), password);
    if (!ok) {
      toast.error("Invalid credentials");
      return;
    }
    nav("/", { replace: true });
  }

  return (
    <div className="min-h-svh grid place-items-center p-4 relative">
      <AnimatedGrid3DBackground />
      <div className="w-full max-w-md rounded-xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-2xl backdrop-blur">
        <div className="mb-4 text-center">
          <div className="mx-auto size-12 rounded-lg bg-cyan-500/20 ring-1 ring-cyan-400/30 grid place-items-center font-bold text-cyan-300">
            D
          </div>
          <h1 className="text-xl font-semibold mt-2">
            Digital Campaign Intelligence
          </h1>
          <p className="text-sm text-muted-foreground">Secure access portal</p>
        </div>
        <form className="space-y-3" onSubmit={handleSignIn}>
          <Input
            autoFocus
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-slate-900 border-slate-800"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-900 border-slate-800"
          />
          <Button className="w-full" type="submit">
            Continue
          </Button>
          <div className="text-xs text-muted-foreground">
            Demo: admin/admin123 or analyst/analyst123
          </div>
        </form>
        <div className="mt-6 text-xs text-center text-muted-foreground">
          <div>Contact: support@dcis.local</div>
          <div className="mt-1">
            © {new Date().getFullYear()} Digital Campaign Intelligence
          </div>
        </div>
      </div>
    </div>
  );
}
