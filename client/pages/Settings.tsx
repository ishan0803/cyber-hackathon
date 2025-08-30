import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const KEY = 'dcis:settings';

type Settings = {
  disclaimerAccepted: boolean;
  dataRetentionDays: number;
  useSynthetic: boolean;
};

export default function SettingsPage() {
  const [s, setS] = useState<Settings>({ disclaimerAccepted: true, dataRetentionDays: 30, useSynthetic: true });

  useEffect(()=>{
    const raw = localStorage.getItem(KEY);
    if (raw) setS(JSON.parse(raw));
  },[]);
  useEffect(()=>{ localStorage.setItem(KEY, JSON.stringify(s)); }, [s]);

  return (
    <AppLayout>
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Legal & Ethics</h3>
          <p className="text-sm text-muted-foreground">Mandatory legal disclaimer, privacy guardrails, free-speech compliance.</p>
          <div className="mt-3 flex items-center gap-3">
            <Switch checked={s.disclaimerAccepted} onCheckedChange={(v)=>setS({...s, disclaimerAccepted: v})} />
            <span className="text-sm">I acknowledge the legal disclaimer</span>
          </div>
        </section>
        <section className="col-span-12 lg:col-span-6 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Data Retention</h3>
          <div className="flex items-center gap-2">
            <input type="number" className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1" value={s.dataRetentionDays} onChange={(e)=>setS({...s, dataRetentionDays: parseInt(e.target.value||'0')})} />
            <span className="text-sm">days</span>
          </div>
        </section>
        <section className="col-span-12 lg:col-span-6 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="font-semibold mb-2">Data Source</h3>
          <div className="flex items-center gap-3">
            <Switch checked={s.useSynthetic} onCheckedChange={(v)=>setS({...s, useSynthetic: v})} />
            <span className="text-sm">Synthetic vs Live API source</span>
          </div>
          <div className="mt-3">
            <Button size="sm">Save</Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
