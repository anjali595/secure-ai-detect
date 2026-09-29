import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronDown,
  CreditCard,
  Loader2,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Upload,
  Zap,
} from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultCard } from "@/components/ResultCard";
import { CsvUploader } from "@/components/CsvUploader";
import { predictTransaction, type PredictionResult } from "@/lib/api";
import { FEATURE_FIELDS, type FeatureField } from "@/lib/features";
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

// Fields the user is asked to fill explicitly; everything else defaults to 0.
const REQUIRED_KEYS = new Set(["Time", "Amount", "V4", "V10", "V14", "V17", "V22", "V24"]);
const BASIC_FIELDS = FEATURE_FIELDS.filter((f) => f.key === "Time" || f.key === "Amount");
const CORE_FIELDS = FEATURE_FIELDS.filter((f) => f.key !== "Time" && f.key !== "Amount" && REQUIRED_KEYS.has(f.key));
const ADVANCED_FIELDS = FEATURE_FIELDS.filter((f) => !REQUIRED_KEYS.has(f.key));

function emptyForm(): Record<string, string> {
  return Object.fromEntries(FEATURE_FIELDS.map((f) => [f.key, ""]));
}

function DetectPage() {
  const [values, setValues] = useState<Record<string, string>>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showCsv, setShowCsv] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  function fillDemo(kind: "safe" | "fraud") {
    const next = emptyForm();
    next.Time = "12345";
    next.Amount = kind === "fraud" ? "3200.00" : "89.50";
    FEATURE_FIELDS.forEach((f, i) => {
      if (f.key === "Time" || f.key === "Amount") return;
      const base = kind === "fraud" ? 2.4 : 0.3;
      next[f.key] = (Math.sin(i + (kind === "fraud" ? 1 : 3)) * base).toFixed(4);
    });
    setValues(next);
  }

  async function onPredict(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, number> = {};
    let autoFilled = 0;
    for (const f of FEATURE_FIELDS) {
      const raw = values[f.key]?.trim() ?? "";
      if (raw === "") {
        if (REQUIRED_KEYS.has(f.key)) {
          toast.error(`Missing value: ${f.label} (${f.key})`);
          return;
        }
        payload[f.key] = 0;
        autoFilled += 1;
        continue;
      }
      const n = Number(raw);
      if (Number.isNaN(n)) {
        toast.error(`Invalid number in ${f.label} (${f.key})`);
        return;
      }
      payload[f.key] = n;
    }
    if (autoFilled > 0) {
      toast.info(`${autoFilled} advanced feature${autoFilled > 1 ? "s" : ""} left empty — sent as 0`);
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
            Fill in the transaction basics and key risk indicators. Advanced model features are optional and default to 0.
          </p>
        </header>

        <form onSubmit={onPredict} className="glass-card space-y-6 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
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

          {/* Section 1 — Transaction details */}
          <FieldSection
            icon={<CreditCard className="h-4 w-4" />}
            title="Transaction details"
            hint="Basic information about the transaction"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {BASIC_FIELDS.map((f) => (
                <FieldInput key={f.key} field={f} value={values[f.key]} onChange={setValues} />
              ))}
            </div>
          </FieldSection>

          {/* Section 2 — Key risk indicators */}
          <FieldSection
            icon={<ShieldAlert className="h-4 w-4" />}
            title="Key risk indicators"
            hint="The signals the model weighs most heavily"
            count={CORE_FIELDS.length}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CORE_FIELDS.map((f) => (
                <FieldInput key={f.key} field={f} value={values[f.key]} onChange={setValues} />
              ))}
            </div>
          </FieldSection>

          {/* Section 3 — Advanced model features (collapsed) */}
          <FieldSection
            icon={<SlidersHorizontal className="h-4 w-4" />}
            title="Advanced model features"
            hint={`Optional — ${ADVANCED_FIELDS.length} model signals, empty values are sent as 0`}
            count={ADVANCED_FIELDS.length}
            collapsible
            open={showAdvanced}
            onToggle={() => setShowAdvanced((s) => !s)}
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {ADVANCED_FIELDS.map((f) => (
                <FieldInput key={f.key} field={f} value={values[f.key]} onChange={setValues} />
              ))}
            </div>
          </FieldSection>

          <div className="flex flex-wrap gap-2">
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

function FieldSection({
  icon,
  title,
  hint,
  count,
  collapsible = false,
  open = true,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  count?: number;
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <button
        type="button"
        onClick={collapsible ? onToggle : undefined}
        className={`flex w-full items-center gap-3 text-left ${collapsible ? "cursor-pointer" : "cursor-default"}`}
        aria-expanded={collapsible ? open : undefined}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-accent ring-1 ring-white/10">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold text-white">{title}</span>
            {typeof count === "number" && (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-white/10">
                {count}
              </span>
            )}
          </span>
          {hint && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{hint}</span>}
        </span>
        {collapsible && (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FeatureField;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-1">
        <Label
          htmlFor={field.key}
          title={field.label}
          className="min-w-0 truncate text-[11px] font-medium text-muted-foreground"
        >
          {field.label}
        </Label>
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground/60">
          {field.key}
        </span>
      </div>
      <Input
        id={field.key}
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange((v) => ({ ...v, [field.key]: e.target.value }))}
        placeholder="0.00"
        className="mt-1 border-white/10 bg-white/5 text-white tabular-nums placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
