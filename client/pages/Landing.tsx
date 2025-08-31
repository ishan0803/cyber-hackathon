import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedNetworkBackground } from "@/components/AnimatedNetworkBackground";

export default function Landing() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <AnimatedNetworkBackground />
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide">Digital Campaign Intelligence</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button size="sm" variant="secondary">Login</Button></Link>
        </div>
      </header>

      <main className="relative z-10 px-6">
        <section className="mx-auto max-w-5xl text-center pt-16 pb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Detect, Analyze, and Disrupt Anti‑India Campaigns
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">
            A modern intelligence dashboard to surface coordinated networks, cross‑platform narratives, and emerging threats — in real time.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/login"><Button>Login to Dashboard</Button></Link>
            <a href="#learn" className="text-cyan-300 text-sm underline decoration-cyan-700/40 hover:decoration-cyan-400">Learn more</a>
          </div>
        </section>

        <section id="learn" className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard title="Coordinated Campaigns" desc="Identify clusters, timelines, and account linkages behind trending narratives." accent="from-cyan-500/20 to-emerald-500/10" />
          <FeatureCard title="Classifier" desc="Differentiate legitimate criticism from hostile propaganda with transparent signals." accent="from-rose-500/20 to-amber-500/10" />
          <FeatureCard title="Multilingual Normalization" desc="Normalize code‑mixed, slang‑heavy content across languages for consistent analysis." accent="from-indigo-500/20 to-sky-500/10" />
        </section>

        <section className="mx-auto max-w-6xl mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/60 p-6">
            <h3 className="font-semibold mb-2">Use Cases</h3>
            <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-5">
              <li>Early warning on escalations and coordinated behavior</li>
              <li>Attribution support via network graphs and account footprints</li>
              <li>Policy decision support with explainable signals</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/60 p-6">
            <h3 className="font-semibold mb-2">Why It Matters</h3>
            <p className="text-sm text-muted-foreground">
              Narrative warfare evolves rapidly. A unified, explainable view of accounts, hashtags, and content helps separate organic discourse from coordinated harm.
            </p>
            <div className="mt-4"><Link to="/login"><Button size="sm">Proceed to Secure Login</Button></Link></div>
          </div>
        </section>

        <footer className="relative z-10 mx-auto max-w-6xl text-center text-xs text-muted-foreground py-10">
          <div>Contact: support@dcis.local</div>
          <div className="mt-1">© {new Date().getFullYear()} Digital Campaign Intelligence</div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc, accent }: { title: string; desc: string; accent: string }) {
  return (
    <div className={`rounded-xl border border-slate-800/60 bg-gradient-to-br ${accent} p-5`}> 
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}
