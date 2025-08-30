import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { exportCSV, exportJSON } from "@/lib/export";

export type LedgerEntry = { index: number; timestamp: string; action: string; prevHash: string; hash: string };

export default function Audit() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const base = Array.from({ length: 25 }).map((_, i) => ({ index: i, timestamp: new Date(Date.now() - i * 3600_000).toISOString(), action: `Action ${i}` }));
    computeChain(base.map((b) => ({ ...b, prevHash: '', hash: '' }))).then(setEntries);
  }, []);

  async function computeChain(base: Array<Omit<LedgerEntry, 'prevHash' | 'hash'>>) {
    const out: LedgerEntry[] = [];
    let prev = 'GENESIS';
    for (const b of base) {
      const data = `${b.index}|${b.timestamp}|${b.action}|${prev}`;
      const h = await sha256(data);
      out.push({ index: b.index, timestamp: b.timestamp, action: b.action, prevHash: prev, hash: h });
      prev = h;
    }
    return out;
  }

  async function verify() {
    for (let i = 0; i < entries.length; i++) {
      const prev = i === 0 ? 'GENESIS' : entries[i - 1].hash;
      const data = `${entries[i].index}|${entries[i].timestamp}|${entries[i].action}|${prev}`;
      const h = await sha256(data);
      if (h !== entries[i].hash) { setValid(false); return; }
    }
    setValid(true);
  }

  return (
    <AppLayout>
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Audit Ledger</h3>
          <div className="flex gap-2">
            <Button size="sm" onClick={verify}>Verify</Button>
            <Button size="sm" variant="outline" onClick={()=>exportJSON('audit.json', entries)}>Export JSON</Button>
            <Button size="sm" variant="outline" onClick={()=>exportCSV('audit.csv', entries as any)}>Export CSV</Button>
          </div>
        </div>
        {valid!=null && (
          <div className={valid?"text-emerald-300":"text-red-300"}>{valid?"Hash valid ✓":"Tampered ✗"}</div>
        )}
        <div className="mt-3 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400"><tr><th>#</th><th>Timestamp</th><th>Action</th><th>Prev Hash</th><th>Hash</th></tr></thead>
            <tbody>
              {entries.map((e)=> (
                <tr key={e.index} className="border-t border-slate-800/70">
                  <td className="tabular-nums">{e.index}</td>
                  <td>{e.timestamp}</td>
                  <td>{e.action}</td>
                  <td className="truncate max-w-[240px]" title={e.prevHash}>{e.prevHash}</td>
                  <td className="truncate max-w-[240px]" title={e.hash}>{e.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
