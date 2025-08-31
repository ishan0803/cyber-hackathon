import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const slangDict: Record<string, string> = {
  bhakt: "pro-govt supporter",
  bhakton: "pro-govt supporters",
  sarkar: "government",
  desh: "country",
  gya: "left",
  "andh bhakt": "blind supporter",
};

function normalize(input: string, lang: string) {
  let text = input;
  // simple case folding
  text = text.replace(/\s+/g, " ").trim();
  // slang expansion (very small demo dictionary)
  for (const [k, v] of Object.entries(slangDict)) {
    const re = new RegExp(`\\b${k}\\b`, "gi");
    text = text.replace(re, v);
  }
  // basic code-mixing: strip repeated punctuation/emojis
  text = text
    .replace(/([!?.])\1{1,}/g, "$1")
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "");
  return text;
}

export default function Normalizer() {
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("bhakton ki sarkar");
  const out = useMemo(() => normalize(input, lang), [input, lang]);

  return (
    <AppLayout>
      <section className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <h3 className="font-semibold mb-3">Multilingual & Slang Normalizer</h3>
        <div className="flex items-center gap-3 mb-3">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-40 bg-slate-900 border-slate-800">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
              <SelectItem value="bn">Bengali</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          className="bg-slate-900 border-slate-800 min-h-24"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Card className="mt-3 p-3 bg-slate-900/70 border-slate-800">
          <div className="text-sm text-muted-foreground">Normalized</div>
          <div className="mt-1 font-medium">{out}</div>
        </Card>
      </section>
    </AppLayout>
  );
}
