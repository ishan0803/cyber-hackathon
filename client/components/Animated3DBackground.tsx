import { useEffect, useRef } from "react";

export function Animated3DBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const depth = 1000;
    const stars: { x: number; y: number; z: number }[] = [];
    const count = Math.min(800, Math.floor((w * h) / 2500));
    for (let i = 0; i < count; i++) {
      stars.push({ x: Math.random() * w - w / 2, y: Math.random() * h - h / 2, z: Math.random() * depth });
    }

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const render = () => {
      ctx.fillStyle = "#020617"; // slate-950
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      for (const s of stars) {
        s.z -= 4;
        if (s.z <= 1) {
          s.x = Math.random() * w - w / 2;
          s.y = Math.random() * h - h / 2;
          s.z = depth;
        }
        const k = 200 / s.z; // perspective
        const x = s.x * k;
        const y = s.y * k;
        const alpha = Math.max(0.2, 1 - s.z / depth);
        ctx.fillStyle = `rgba(56,189,248,${alpha})`; // cyan-400
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, 1.5 - s.z / depth), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 -z-10" aria-hidden="true" />;
}
