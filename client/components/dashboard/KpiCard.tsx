import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useCounter } from "@/hooks/useCounter";

export function KpiCard({
  label,
  value,
  prefix,
  suffix,
  accent = "from-cyan-500/20 to-blue-500/10",
  icon,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  accent?: string;
  icon?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useCounter(value, 1200);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -4;
    const ry = ((x / rect.width) - 0.5) * 4;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "rounded-xl border bg-gradient-to-br p-4 transition-transform will-change-transform",
        "border-slate-800/60 bg-slate-900/60 backdrop-blur",
        accent,
      )}
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-cyan-400">{icon}</div>
      </div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums">
        {prefix}
        {animated.toLocaleString()}
        {suffix}
      </div>
    </div>
  );
}
