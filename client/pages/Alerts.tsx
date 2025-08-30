import { AppLayout } from "@/components/layout/AppLayout";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

type AlertItem = { id: string; priority: 'low'|'med'|'high'; title: string; evidence: string };

function genAlerts(seed=Date.now()): AlertItem[] {
  const rand = mulberry32(seed);
  const p = ['low','med','high'] as const;
  return Array.from({length:30}).map((_,i)=>({ id:`al${i}`, priority: p[Math.floor(rand()*3)], title:`Potential coordinated spread ${i}`, evidence:`https://example.com/evidence/${i}` }));
}

export default function Alerts(){
  const [seed] = useState(()=>Date.now());
  const [velocity, setVelocity] = useState(60);
  const [eng, setEng] = useState(70);
  const [open, setOpen] = useState<AlertItem|null>(null);
  const items = useMemo(()=> genAlerts(seed), [seed]);

  return (
    <AppLayout>
      <section className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4 mb-4">
        <h3 className="font-semibold mb-2">Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm">Spread velocity</div>
            <Slider min={0} max={100} value={[velocity]} onValueChange={([v])=>setVelocity(v)} />
          </div>
          <div>
            <div className="text-sm">Engagement</div>
            <Slider min={0} max={100} value={[eng]} onValueChange={([v])=>setEng(v)} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <h3 className="font-semibold mb-2">Active Alerts</h3>
        <ul className="divide-y divide-slate-800">
          {items.map((a)=> (
            <li key={a.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.evidence}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={a.priority==='high'?"bg-red-500/20 text-red-300":a.priority==='med'?"bg-amber-500/20 text-amber-200":"bg-emerald-500/20 text-emerald-200"}>{a.priority}</Badge>
                <Button size="sm" onClick={()=>setOpen(a)}>View</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Dialog open={!!open} onOpenChange={(o)=>!o && setOpen(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <div className="text-lg font-semibold">Alert Detail</div>
          </DialogHeader>
          {open && (
            <div className="space-y-2 text-sm">
              <div>Priority: <strong>{open.priority}</strong></div>
              <div>Evidence: <a href={open.evidence} className="text-cyan-300 underline" target="_blank" rel="noreferrer">{open.evidence}</a></div>
              <div className="text-muted-foreground">Linked posts, accounts, propagation timeline would appear here.</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

function mulberry32(a: number) {return function () {let t = (a += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }}
