import { useEffect, useRef } from "react";

export function AnimatedNetworkBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initNodes();
    };
    window.addEventListener("resize", onResize);

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];
    const maxNodes = Math.min(160, Math.floor((w * h) / 12000));
    const maxDist = Math.min(160, Math.max(90, Math.sqrt((w * h) / 180)));

    function initNodes() {
      const count = Math.min(maxNodes, Math.floor((w * h) / 14000));
      nodes = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.7,
      }));
    }
    initNodes();

    let t = 0;
    const render = () => {
      t += 0.008;
      // background gradient
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#020617"); // slate-950
      bg.addColorStop(1, "#0b1220");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // sweep/radar pulse
      const sweepR = Math.max(w, h) * 0.75;
      const cx = w * 0.65 + Math.sin(t * 0.6) * 40;
      const cy = h * 0.35 + Math.cos(t * 0.6) * 30;
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, sweepR);
      rg.addColorStop(0, "rgba(236,72,153,0.12)"); // rose-500
      rg.addColorStop(0.4, "rgba(56,189,248,0.06)"); // cyan-400
      rg.addColorStop(1, "transparent");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(cx, cy, sweepR, 0, Math.PI * 2);
      ctx.fill();

      // update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
        // subtle drift
        n.vx += (Math.random() - 0.5) * 0.01;
        n.vx = Math.max(-0.5, Math.min(0.5, n.vx));
        n.vy += (Math.random() - 0.5) * 0.01;
        n.vy = Math.max(-0.5, Math.min(0.5, n.vy));
      }

      // draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.6;
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`; // cyan edges
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // draw nodes with glow
      for (const n of nodes) {
        ctx.fillStyle = "rgba(16,185,129,0.85)"; // emerald nodes
        ctx.shadowColor = "rgba(16,185,129,0.6)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas ref={ref} className="fixed inset-0 -z-10" aria-hidden="true" />
  );
}
