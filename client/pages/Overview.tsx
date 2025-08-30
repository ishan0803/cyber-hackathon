import { AppLayout } from "@/components/layout/AppLayout";
import { EarthGlobe } from "@/components/EarthGlobe";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SentimentDonut, StateBarChart, TrendChart } from "@/components/dashboard/OverviewCharts";
import { generateDonut, generateHeatPoints, generateKPI, generateStateBars, generateTrend } from "@/lib/dataGenerator";
import { Activity, AlertTriangle, BarChart3, Users2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Overview() {
  const [seed] = useState(() => Date.now());
  const kpi = useMemo(() => generateKPI(seed), [seed]);
  const trend = useMemo(() => generateTrend(seed), [seed]);
  const bars = useMemo(() => generateStateBars(seed), [seed]);
  const donut = useMemo(() => generateDonut(seed), [seed]);
  const heat = useMemo(() => generateHeatPoints(28, seed), [seed]);

  return (
    <AppLayout>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7">
          <section className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Digital Campaign Intelligence System</h2>
              <span className="text-xs text-muted-foreground">India focus • Live demo</span>
            </div>
            <EarthGlobe points={heat} />
          </section>
        </div>
        <div className="col-span-12 xl:col-span-5 grid grid-cols-2 gap-4">
          <KpiCard label="Active Campaigns" value={kpi.activeCampaigns} icon={<BarChart3 />} accent="from-cyan-500/20 to-emerald-500/10" />
          <KpiCard label="High-Risk Accounts" value={kpi.highRiskAccounts} icon={<Users2 />} accent="from-rose-500/20 to-amber-500/10" />
          <KpiCard label="Alerts (24h)" value={kpi.alerts24h} icon={<AlertTriangle />} accent="from-orange-500/20 to-rose-500/10" />
          <KpiCard label="Engagement Volume" value={kpi.engagementVolume} suffix="" icon={<Activity />} accent="from-sky-500/20 to-indigo-500/10" />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <TrendChart data={trend} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <SentimentDonut data={donut} />
        </div>
        <div className="col-span-12">
          <StateBarChart data={bars} />
        </div>
      </div>
    </AppLayout>
  );
}
