import { useMemo, useState } from "react";
import AppLayout from "./Index";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ANTI_INDIA_HASHTAGS } from "@/lib/synthetic";

function classify(text: string) {
  const t = text.toLowerCase();
  const antiWords = ["breakindia", "failed state", "boycott", ...ANTI_INDIA_HASHTAGS.map((h) => h.toLowerCase())];
  const hits = antiWords.filter((w) => t.includes(w.replace(/[#]/g, "")));
  const isAnti = hits.length > 0;
  const confidence = Math.min(0.99, isAnti ? 0.6 + hits.length * 0.1 : 0.55 - Math.min(0.3, t.length / 400));
  return { label: isAnti ? "Anti-India" : "Criticism", confidence, signals: hits.slice(0, 5) };
}

export default function Classifier() {
  const [text, setText] = useState("");
  const result = useMemo(() => classify(text), [text]);

  return (
    <AppLayout>
      <section className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <h3 className="font-semibold mb-3">Criticism vs Anti-India Classifier</h3>
        <Textarea
          placeholder="Paste a post..."
          className="bg-slate-900 border-slate-800 min-h-36"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex items-center gap-3">
          <Button size="sm" onClick={() => setText("We need better roads in Bihar.")}>Example: Criticism</Button>
          <Button size="sm" variant="secondary" onClick={() => setText("India is a failed state #breakIndia.")}>Example: Anti-India</Button>
        </div>
        {text && (
          <div className="mt-4 flex items-center gap-3">
            <Badge className={result.label === "Anti-India" ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-200"}>
              {result.label}
            </Badge>
            <span className="text-sm text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(0)}%</span>
            {result.signals.length > 0 && (
              <span className="text-sm text-muted-foreground">Signals: {result.signals.join(", ")}</span>
            )}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
