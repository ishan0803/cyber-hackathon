import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { Slider } from "@/components/ui/slider";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { genAntiTag } from "@/lib/synthetic";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";

type Feature = {
  type: string;
  properties: { NAME_1?: string; st_nm?: string };
  geometry: any;
};

export default function Heatmap() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [t, setT] = useState(0);
  const [open, setOpen] = useState<{ state: string } | null>(null);
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    state: string;
    score: number;
  } | null>(null);
  const width = 780,
    height = 520;

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson",
    )
      .then((r) => r.json())
      .then((g) => setFeatures(g.features as Feature[]))
      .catch(() => setFeatures([]));
  }, []);

  const wrapRef = useRef<HTMLDivElement>(null);

  const projection = useMemo(
    () =>
      geoMercator()
        .center([78.9629, 22.5937])
        .scale(1000)
        .translate([width / 2, height / 2]),
    [width, height],
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  function score(name: string) {
    // time-evolving synthetic score
    const base = hashCode(name) % 100;
    return (base + t * 7) % 100;
  }

  return (
    <AppLayout>
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">India Heatmap</h3>
          <div className="flex items-center gap-3 w-56">
            <span className="text-xs text-muted-foreground">Time</span>
            <Slider
              min={0}
              max={20}
              value={[t]}
              onValueChange={([v]) => setT(v)}
            />
          </div>
        </div>
        <div className="overflow-auto relative" ref={wrapRef}>
          <svg
            width={width}
            height={height}
            role="img"
            aria-label="India choropleth"
            onMouseLeave={() => setHover(null)}
          >
            {features.map((f, i) => {
              const name = (f.properties.st_nm ||
                f.properties.NAME_1 ||
                `state_${i}`) as string;
              const s = score(name) / 100;
              const color = `hsl(189 94% ${30 + s * 30}%)`;
              const scorePct = Math.round(s * 100);
              return (
                <path
                  key={i}
                  d={path(f as any) || ""}
                  fill={color}
                  stroke="#0f172a"
                  strokeWidth={0.6}
                  onClick={() => setOpen({ state: name })}
                  onMouseEnter={(e) => {
                    const rect = wrapRef.current!.getBoundingClientRect();
                    setHover({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      state: name,
                      score: scorePct,
                    });
                  }}
                  onMouseMove={(e) => {
                    if (!hover) return;
                    const rect = wrapRef.current!.getBoundingClientRect();
                    setHover({ ...hover, x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                />
              );
            })}
          </svg>
          {hover && (
            <div
              className="absolute z-20 pointer-events-none rounded-md border border-slate-800 bg-slate-900/95 text-slate-200 text-xs px-2 py-1 shadow-lg"
              style={{ left: hover.x + 12, top: hover.y + 12 }}
           >
              <div className="font-medium">{hover.state}</div>
              <div className="opacity-80">Score: {hover.score}</div>
              <div className="opacity-80">Risk: {hover.score > 66 ? "High" : hover.score > 33 ? "Medium" : "Low"}</div>
            </div>
          )}
        </div>
      </div>

      <Drawer open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DrawerContent className="bg-slate-900 border-slate-800">
          <DrawerHeader>
            <div className="text-lg font-semibold">{open?.state}</div>
            <div className="text-sm text-muted-foreground">
              Chronological events and linked posts
            </div>
          </DrawerHeader>
          <div className="p-4 space-y-2 text-sm">
            {Array.from({ length: 6 }).map((_, i) => {
              const rand = () => Math.random();
              const tags = [genAntiTag(rand), genAntiTag(rand)];
              const time = new Date(Date.now() - i * 3600_000).toLocaleString();
              return (
                <div key={i} className="border border-slate-800 rounded p-3 bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Event {i + 1}</div>
                    <div className="text-xs text-muted-foreground">{time}</div>
                  </div>
                  <div className="mt-1 text-muted-foreground">Detected spike in coordinated activity.</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-cyan-500/20 text-cyan-300">{tags[0]}</Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-200">{tags[1]}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </AppLayout>
  );
}

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
