import { AppLayout } from "@/components/layout/AppLayout";

export default function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <AppLayout>
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </AppLayout>
  );
}
