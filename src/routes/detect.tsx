import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Loader2, RotateCcw, Upload, Zap } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultCard } from "@/components/ResultCard";
import { CsvUploader } from "@/components/CsvUploader";
import { predictTransaction, type PredictionResult } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/detect")({
  head: () => ({
    meta: [
      { title: "Fraud Detection — SecurePay AI" },
      { name: "description", content: "Score a single transaction or upload a CSV to detect credit card fraud." },
      { property: "og:title", content: "Fraud Detection — SecurePay AI" },
      { property: "og:description", content: "Score a single transaction or upload a CSV to detect credit card fraud." },
    ],
  }),
  component: DetectPage,
});

const V_KEYS = Array.from({ length: 28 }, (_, i) => `V${i + 1}`);
const FIELDS = ["Time", "Amount", ...V_KEYS] as const;

function emptyForm(): Record<string, string> {
  return Object.fromEntries(FIELDS.map((k) => [k, ""]));
}

function DetectPage() {
  const [values, setValues] = useState<Record<string, string>>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showCsv, setShowCsv] = useState(false);

  function fillDemo(kind: "safe" | "fraud") {
    const next = emptyForm();
    next.Time = "12345";
    next.Amount = kind === "fraud" ? "3200.00" : "89.50";
    V_KEYS.forEach((k, i) => {
      const base = kind === "fraud" ? 2.4 : 0.3;
      next[k] = (Math.sin(i + (kind === "fraud" ? 1 : 3)) * base).toFixed(4);
    });
    setValues(next);
  }

  async function onPredict(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, number> = {};
    for (const k of FIELDS) {
      const raw = values[k];
      if (raw === "" || raw === undefined) {
        toast.error(`Missing value: ${k}`);
        return;
      }
      const n = Number(raw);
      if (Number.isNaN(n)) {
        toast.error(`Invalid number in ${k}`);
        return;
      }
      payload[k] = n;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await predictTransaction(payload);
      setResult(r);
      toast.success(r.prediction === "Fraud" ? "Fraud detected" : "Transaction looks safe");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setValues(emptyForm());
    setResult(null);
  }

  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Prediction</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Transaction risk analysis
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter transaction features to score risk in real time. Use the demo fillers if you don't have data on hand.
          </p>
        </header>

        <form onSubmit={onPredict} className="glass-card p-5 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-accent ring-1 ring-white/10">
                <Zap className="h-4 w-4" />
              </span>
              <h2 className="font-display text-lg font-semibold text-white">Transaction inputs</h2>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={() => fillDemo("safe")}>
                Demo: safe
              </Button>
              <Button type="button" size="sm" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={() => fillDemo("fraud")}>
                Demo: fraud
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {FIELDS.map((k) => (
              <div key={k} className="min-w-0">
                <Label htmlFor={k} className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {k}
                </Label>
                <Input
                  id={k}
                  type="number"
                  step="any"
                  value={values[k]}
                  onChange={(e) => setValues((v) => ({ ...v, [k]: e.target.value }))}
                  placeholder="0.00"
                  className="mt-1 border-white/10 bg-white/5 text-white tabular-nums placeholder:text-muted-foreground/50"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="submit" disabled={loading} size="lg" className="bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:opacity-90">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing transaction…</> : <><Zap className="mr-2 h-4 w-4" /> Predict</>}
            </Button>
            <Button type="button" size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button type="button" size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={() => setShowCsv((s) => !s)}>
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card mt-6 flex items-center gap-3 p-6"
            >
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
              <div>
                <p className="font-medium text-white">Analyzing transaction…</p>
                <p className="text-xs text-muted-foreground">Running features through the ML model.</p>
              </div>
            </motion.div>
          )}
          {result && !loading && (
            <motion.div key="result" className="mt-6">
              <ResultCard result={result} />
            </motion.div>
          )}
          {!result && !loading && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card mt-6 p-8 text-center">
              <p className="text-sm text-muted-foreground">Fill in transaction details and click <span className="text-white">Predict</span> to see the risk analysis.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {showCsv && (
          <div className="mt-8">
            <h3 className="font-display mb-3 text-xl font-semibold text-white">Batch CSV analysis</h3>
            <CsvUploader />
          </div>
        )}
      </div>
    </div>
  );
}