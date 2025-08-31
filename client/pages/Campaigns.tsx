import { useMemo, useState } from "react";
import AppLayout from "./Index";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { generateCampaignClusters } from "@/lib/campaigns";

export default function Campaigns() {
  const [seed] = useState(() => Date.now());
  const items = useMemo(() => generateCampaignClusters(24, seed), [seed]);

  return (
    <AppLayout>
      <section className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <h3 className="font-semibold mb-2">Coordinated Campaigns</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-800" />
          <div className="space-y-4">
            {items.map((c, i) => (
              <div key={c.id} className="pl-10 relative">
                <div className="absolute left-3 top-2 size-3 rounded-full bg-cyan-400 shadow" />
                <Card className="bg-slate-900/70 border-slate-800 p-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="font-medium">{c.cluster}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(c.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="mt-2 text-sm flex flex-wrap items-center gap-2">
                    <Badge className="bg-cyan-500/20 text-cyan-300">{c.hashtag}</Badge>
                    <span className="text-muted-foreground">Linked accounts:</span>
                    {c.linkedAccounts.slice(0, 5).map((a) => (
                      <Badge key={a} variant="outline" className="border-slate-700 text-slate-300">{a}</Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-sm flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground">Also using:</span>
                    {c.linkedHashtags.map((h) => (
                      <Badge key={h} className="bg-emerald-500/20 text-emerald-200">{h}</Badge>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
