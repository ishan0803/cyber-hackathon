import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { exportCSV, exportJSON } from "@/lib/export";

export type LedgerEntry = {
  index: number;
  timestamp: string;
  action: string;
  prevHash: string;
  hash: string;
};

import { genAntiTag, genHandle, mulberry32, pick } from "@/lib/synthetic";

export default function Audit() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const base = generateAuditBase(25, Date.now());
    computeChain(base.map((b) => ({ ...b, prevHash: "", hash: "" }))).then(
      setEntries,
    );
  }, []);

  async function computeChain(
    base: Array<Omit<LedgerEntry, "prevHash" | "hash">>,
  ) {
    const out: LedgerEntry[] = [];
    let prev = "GENESIS";
    for (const b of base) {
      const data = `${b.index}|${b.timestamp}|${b.action}|${prev}`;
      const h = await sha256(data);
      out.push({
        index: b.index,
        timestamp: b.timestamp,
        action: b.action,
        prevHash: prev,
        hash: h,
      });
      prev = h;
    }
    return out;
  }

  async function verify() {
    for (let i = 0; i < entries.length; i++) {
      const prev = i === 0 ? "GENESIS" : entries[i - 1].hash;
      const data = `${entries[i].index}|${entries[i].timestamp}|${entries[i].action}|${prev}`;
      const h = await sha256(data);
      if (h !== entries[i].hash) {
        setValid(false);
        return;
      }
    }
    setValid(true);
  }

  return (
    <AppLayout>
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Audit Ledger</h3>
          <div className="flex gap-2">
            <Button size="sm" onClick={verify}>
              Verify
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportJSON("audit.json", entries)}
            >
              Export JSON
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportCSV("audit.csv", entries as any)}
            >
              Export CSV
            </Button>
          </div>
        </div>
        {valid != null && (
          <div className={valid ? "text-emerald-300" : "text-red-300"}>
            {valid ? "Hash valid ✓" : "Tampered ✗"}
          </div>
        )}
        <div className="mt-3 overflow-y-auto overflow-x-hidden">
          <table className="w-full text-sm table-auto">
            <colgroup>
              <col className="w-[6%]" />
              <col className="w-[24%]" />
              <col className="w-[40%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead className="text-slate-400">
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Prev Hash</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr
                  key={e.index}
                  className="border-t border-slate-800/70 align-top"
                >
                  <td className="tabular-nums">{e.index}</td>
                  <td className="break-words">{e.timestamp}</td>
                  <td className="whitespace-pre-wrap break-words break-all">
                    {e.action}
                  </td>
                  <td title={e.prevHash}>
                    <div className="break-all">{e.prevHash}</div>
                  </td>
                  <td title={e.hash}>
                    <div className="break-all">{e.hash}</div>
                  </td>
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
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateAuditBase(
  n: number,
  seed: number,
): Array<Omit<LedgerEntry, "prevHash" | "hash">> {
  const rand = mulberry32(seed);
  const out: Array<Omit<LedgerEntry, "prevHash" | "hash">> = [];
  for (let i = 0; i < n; i++) {
    const ts = new Date(Date.now() - i * 45 * 60_000).toISOString(); // every 45 min
    const action = genAction(rand);
    out.push({ index: i, timestamp: ts, action });
  }
  return out;
}

function genAction(rand: () => number) {
  const actor = genHandle(rand);
  const tag = genAntiTag(rand);
  const choice = Math.floor(rand() * 8);
  switch (choice) {
    case 0:
      return `INGEST_TWEET ${actor} → ${socialUrl("twitter", rand)} ${tag}`;
    case 1:
      return `INGEST_REDDIT ${actor} → ${socialUrl("reddit", rand)} ${tag}`;
    case 2:
      return `ALERT_RAISED ${tag} priority=${pick(["low", "med", "high"], rand)}`;
    case 3:
      return `THRESHOLD_UPDATED velocity=${Math.round(rand() * 100)} engagement=${Math.round(rand() * 100)}`;
    case 4:
      return `ORIGIN_TRACE start=${actor} depth=${Math.floor(rand() * 4) + 1}`;
    case 5:
      return `MODEL_SCORE ${actor} risk=${(rand() * 100).toFixed(1)}% tag=${tag}`;
    case 6:
      return `EXPORT_REPORT type=csv rows=${Math.floor(rand() * 5000) + 500}`;
    default:
      return `LEDGER_VERIFY result=ok`;
  }
}

function socialUrl(kind: "twitter" | "reddit", rand: () => number) {
  if (kind === "twitter") {
    const user = [
      "indiapolitics",
      "newswire",
      "trendwatch",
      "mediaaudit",
      "factcheck",
    ][Math.floor(rand() * 5)];
    const id = Math.floor(1e17 + rand() * 9e17).toString();
    return `https://twitter.com/${user}/status/${id}`;
  } else {
    const sub = ["india", "Chodi", "IndianPoliticalMemes", "news", "worldnews"][
      Math.floor(rand() * 5)
    ];
    const id = Math.random().toString(36).slice(2, 9);
    return `https://www.reddit.com/r/${sub}/comments/${id}/synthetic_thread/`;
  }
}
