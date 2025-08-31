import { useEffect, useRef } from "react";

export function AnimatedGrid3DBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.fillStyle = "#020617"; // slate-950
      ctx.fillRect(0, 0, w, h);

      // subtle vignette
      const grad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) / 8,
        w / 2,
        h / 2,
        Math.max(w, h) / 1.2,
      );
      grad.addColorStop(0, "rgba(2,6,23,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h * 0.75);
      // perspective grid parameters
      const spacing = 30;
      const depthLines = 40;
      const speed = 0.5;

      // Horizontal lines moving towards the viewer
      for (let i = 1; i < depthLines; i++) {
        const z = (i + t * speed) % depthLines;
        const scale = 1 / (0.05 * z + 0.05);
        const y = -Math.pow(scale, 1.1) * 20; // curve
        ctx.strokeStyle = `rgba(56,189,248,${Math.max(0, 1 - z / depthLines)})`; // cyan
        ctx.beginPath();
        ctx.moveTo(-w, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Vertical lines converging to vanishing point
      for (let x = -w; x <= w; x += spacing) {
        ctx.strokeStyle = "rgba(56,189,248,0.25)";
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x * 0.02, -h); // converge upwards
        ctx.stroke();
      }

      // Floating nodes
      const nodes = 40;
      for (let i = 0; i < nodes; i++) {
        const angle = (i / nodes) * Math.PI * 2 + t * 0.5;
        const r = Math.min(w, h) * 0.15 + Math.sin(t + i) * 10;
        const x = Math.cos(angle) * r;
        const y = -Math.sin(angle * 0.7) * 20 - 60;
        ctx.fillStyle = "rgba(16,185,129,0.35)"; // emerald glow
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
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
