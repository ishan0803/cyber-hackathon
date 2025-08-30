import { AppLayout } from "@/components/layout/AppLayout";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { generateGraph, GraphNode, GraphEdge } from "@/lib/graphData";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";

const langs = ["en", "hi", "ta", "bn"] as const;
const regions = ["north", "south", "east", "west"] as const;

export default function Graph() {
  const [seed] = useState(() => Date.now());
  const base = useMemo(() => generateGraph(40, 20, 60, seed), [seed]);
  const [timeRange, setTimeRange] = useState(7); // days
  const [lang, setLang] = useState<string | "all">("all");
  const [region, setRegion] = useState<string | "all">("all");
  const [clustersOnly, setClustersOnly] = useState(false);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const filtered = useMemo(() => {
    const cutoff = Date.now() - timeRange * 24 * 3600 * 1000;
    const nodes = base.nodes.filter(
      (n) =>
        n.timestamp >= cutoff &&
        (lang === "all" || n.lang === lang) &&
        (region === "all" || n.region === region),
    );
    const ids = new Set(nodes.map((n) => n.id));
    const edges = base.edges.filter(
      (e) => ids.has(e.source) && ids.has(e.target),
    );
    return { nodes, edges };
  }, [base, timeRange, lang, region]);

  useEffect(() => {
    if (!cyRef.current) return;
    // Worker layout
    const worker = new Worker(
      new URL("../workers/graphLayout.worker.ts", import.meta.url).href,
      { type: "module" },
    );
    worker.onmessage = (
      ev: MessageEvent<{ positions: Record<string, { x: number; y: number }> }>,
    ) => {
      const cy = cyRef.current!;
      Object.entries(ev.data.positions).forEach(([id, p]) => {
        const node = cy.$id(id);
        if (node) node.position(p);
      });
      cy.fit(undefined, 30);
    };
    worker.postMessage({
      ids: filtered.nodes.map((n) => n.id),
      seed: seed,
    } as any);
    return () => worker.terminate();
  }, [filtered.nodes, seed]);

  const elements = useMemo(() => {
    const n = filtered.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        risk: node.risk,
      },
    }));
    const e = filtered.edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      },
    }));
    return [...n, ...e] as any[];
  }, [filtered]);

  return (
    <AppLayout>
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-3 p-4 bg-slate-900/60 border-slate-800/60">
          <div className="text-sm font-medium mb-2">Filters</div>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">
              Time range (days)
            </label>
            <Slider
              min={1}
              max={14}
              step={1}
              value={[timeRange]}
              onValueChange={([v]) => setTimeRange(v)}
            />
            <label className="text-xs text-muted-foreground">Language</label>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant={lang === "all" ? "secondary" : "outline"}
                onClick={() => setLang("all")}
              >
                All
              </Button>
              {langs.map((l) => (
                <Button
                  key={l}
                  size="sm"
                  variant={lang === l ? "secondary" : "outline"}
                  onClick={() => setLang(l)}
                >
                  {l}
                </Button>
              ))}
            </div>
            <label className="text-xs text-muted-foreground">Region</label>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant={region === "all" ? "secondary" : "outline"}
                onClick={() => setRegion("all")}
              >
                All
              </Button>
              {regions.map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={region === r ? "secondary" : "outline"}
                  onClick={() => setRegion(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                id="clusters"
                type="checkbox"
                checked={clustersOnly}
                onChange={(e) => setClustersOnly(e.target.checked)}
              />
              <label htmlFor="clusters" className="text-sm">
                Coordinated clusters only
              </label>
            </div>
          </div>
        </Card>
        <Card className="col-span-12 lg:col-span-9 p-0 bg-slate-900/60 border-slate-800/60 overflow-hidden">
          <CytoscapeComponent
            elements={elements}
            cy={(cy) => {
              cyRef.current = cy;
              cy.on("tap", "node", (evt) =>
                setSelected(evt.target.data() as any),
              );
            }}
            style={{ width: "100%", height: "70vh" }}
            stylesheet={styles}
          />
        </Card>
      </div>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DrawerContent className="bg-slate-900 border-slate-800">
          <DrawerHeader>
            <div className="text-lg font-semibold">Node Inspector</div>
            {selected && (
              <div className="text-sm text-muted-foreground">
                {selected.label} • {selected.type} • Risk{" "}
                {Math.round(selected.risk * 100)}%
              </div>
            )}
          </DrawerHeader>
          <div className="p-4 space-y-2">
            {selected && (
              <div className="flex gap-2 items-center">
                <Badge variant="secondary">{selected.lang}</Badge>
                <Badge variant="secondary">{selected.region}</Badge>
              </div>
            )}
            <Button size="sm" onClick={() => traceOrigin()} className="mt-2">
              Trace origin
            </Button>
          </div>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </AppLayout>
  );

  function traceOrigin() {
    const cy = cyRef.current;
    if (!cy || !selected) return;
    cy.elements().removeClass("glow");
    const visited = new Set<string>();
    const queue: string[] = [selected.id];
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const incoming = cy.$(`edge[target = "${id}"]`);
      incoming.addClass("glow");
      incoming.sources().addClass("glow");
      incoming.sources().forEach((n) => queue.push(n.id()));
    }
  }
}

const styles: cytoscape.Stylesheet[] = [
  {
    selector: "node",
    style: {
      width: 16,
      height: 16,
      label: "data(label)",
      color: "#94a3b8",
      "font-size": 8,
      "text-valign": "bottom",
      "text-margin-y": -6,
    },
  },
  {
    selector: 'node[type="account"]',
    style: { shape: "ellipse", "background-color": "#38bdf8" },
  },
  {
    selector: 'node[type="hashtag"]',
    style: { shape: "round-rectangle", "background-color": "#22d3ee" },
  },
  {
    selector: 'node[type="post"]',
    style: { shape: "rectangle", "background-color": "#818cf8" },
  },
  {
    selector: "edge",
    style: {
      width: 1,
      "line-color": "#334155",
      "target-arrow-color": "#334155",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
  {
    selector: ".glow",
    style: {
      "line-color": "#22d3ee",
      "target-arrow-color": "#22d3ee",
      width: 2,
    },
  },
];
