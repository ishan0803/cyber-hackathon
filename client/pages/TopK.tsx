import { AppLayout } from "@/components/layout/AppLayout";
import { generateTopK } from "@/lib/topkData";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportCSV } from "@/lib/export";
import { useNavigate } from "react-router-dom";

export default function TopK() {
  const [seed] = useState(() => Date.now());
  const { accounts, hashtags, posts } = useMemo(() => generateTopK(seed), [seed]);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const acc = accounts.filter((a) => a.handle.includes(q));
  const hash = hashtags.filter((h) => h.tag.includes(q));
  const pst = posts.filter((p) => p.preview.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-3">
        <Input className="max-w-xs bg-slate-900 border-slate-800" placeholder="Search" value={q} onChange={(e)=>setQ(e.target.value)} />
        <div className="flex gap-2">
          <Button size="sm" onClick={()=>exportCSV('accounts.csv', acc as any)}>Export Accounts</Button>
          <Button size="sm" onClick={()=>exportCSV('hashtags.csv', hash as any)}>Export Hashtags</Button>
          <Button size="sm" onClick={()=>exportCSV('posts.csv', pst as any)}>Export Posts</Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 lg:col-span-4 min-w-0 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Top Accounts</h3>
          <div className="overflow-x-auto"><table className="w-full text-sm table-fixed">
            <thead className="text-slate-400">
              <tr><th className="text-left">Handle</th><th className="text-right">Score</th><th>Risk</th><th></th></tr>
            </thead>
            <tbody>
              {acc.slice(0,20).map((a)=> (
                <tr key={a.id} className="border-t border-slate-800/70">
                  <td>{a.handle}</td>
                  <td className="text-right tabular-nums">{a.score}</td>
                  <td className="text-center">{badge(a.risk)}</td>
                  <td className="text-right"><Button size="sm" variant="ghost" onClick={()=>nav(`/graph?focus=${a.id}`)}>Graph</Button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>
        <section className="col-span-12 lg:col-span-4 min-w-0 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Top Hashtags</h3>
          <div className="overflow-x-auto"><table className="w-full text-sm table-fixed">
            <thead className="text-slate-400">
              <tr><th className="text-left">Hashtag</th><th className="text-right">Count</th><th className="text-right">Radius</th></tr>
            </thead>
            <tbody>
              {hash.slice(0,20).map((h)=> (
                <tr key={h.id} className="border-t border-slate-800/70">
                  <td>{h.tag}</td>
                  <td className="text-right tabular-nums">{h.count}</td>
                  <td className="text-right">{h.radius}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>
        <section className="col-span-12 lg:col-span-4 min-w-0 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Top Posts</h3>
          <div className="overflow-x-auto"><table className="w-full text-sm table-fixed">
            <thead className="text-slate-400">
              <tr><th className="text-left">Preview</th><th className="text-right">Engagement</th><th>Risk</th></tr>
            </thead>
            <tbody>
              {pst.slice(0,20).map((p)=> (
                <tr key={p.id} className="border-t border-slate-800/70">
                  <td><div className="truncate max-w-[220px] md:max-w-[240px] xl:max-w-[260px]" title={p.preview}>{p.preview}</div></td>
                  <td className="text-right tabular-nums">{p.engagement}</td>
                  <td className="text-center">{badge(p.risk)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>
      </div>
    </AppLayout>
  );
}

function badge(r: string){
  const c = r === 'high' ? 'text-red-400' : r==='med' ? 'text-amber-300' : 'text-emerald-300';
  return <span className={`px-2 py-0.5 rounded-full text-xs ${c}`}>{r}</span>;
}
