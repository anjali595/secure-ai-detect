import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Ban, UserCheck, Bell } from "lucide-react";
import { ConfidenceGauge } from "./ConfidenceGauge";
import type { PredictionResult } from "@/lib/api";

export function ResultCard({ result }: { result: PredictionResult }) {
  const isFraud = result.prediction === "Fraud";
  const riskScore = Math.round(result.probability * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-6 sm:p-8"
      style={{
        boxShadow: isFraud
          ? "0 0 60px -10px rgba(239,68,68,0.45)"
          : "0 0 60px -10px rgba(16,185,129,0.35)",
      }}
    >
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background: isFraud
            ? "radial-gradient(ellipse at top right, rgba(239,68,68,0.25), transparent 60%)"
            : "radial-gradient(ellipse at top right, rgba(16,185,129,0.25), transparent 60%)",
        }}
      />
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {isFraud ? (
              <motion.span
                animate={{ rotate: [0, -6, 6, -3, 0] }}
                transition={{ duration: 0.6 }}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-destructive/15 text-destructive ring-1 ring-destructive/30"
              >
                <AlertTriangle className="h-7 w-7" />
              </motion.span>
            ) : (
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-success/15 text-success ring-1 ring-success/30">
                <ShieldCheck className="h-7 w-7" />
              </span>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Transaction Risk Analysis
              </p>
              <h3 className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${isFraud ? "text-destructive" : "text-success"}`}>
                {isFraud ? "FRAUD DETECTED" : "SAFE TRANSACTION"}
              </h3>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
            <MetricBox label="Risk Score" value={`${riskScore}%`} tone={isFraud ? "danger" : "success"} />
            <MetricBox label="Confidence" value={`${result.confidence}%`} tone="primary" />
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            {isFraud
              ? "This transaction shows strong signals of fraudulent behavior. Review the recommendations below."
              : "No suspicious activity detected. This transaction can be safely approved."}
          </p>

          {isFraud && (
            <div className="mt-6 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-destructive">Recommended actions</p>
              <ul className="mt-3 space-y-2 text-sm text-white">
                <li className="flex items-center gap-2"><Ban className="h-4 w-4 text-destructive" /> Block transaction immediately</li>
                <li className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-destructive" /> Verify customer identity</li>
                <li className="flex items-center gap-2"><Bell className="h-4 w-4 text-destructive" /> Notify issuing bank</li>
              </ul>
            </div>
          )}
        </div>

        <div className="justify-self-center md:justify-self-end">
          <ConfidenceGauge value={riskScore} variant={isFraud ? "danger" : "success"} />
        </div>
      </div>
    </motion.div>
  );
}

function MetricBox({ label, value, tone }: { label: string; value: string; tone: "danger" | "success" | "primary" }) {
  const toneClass =
    tone === "danger" ? "text-destructive" : tone === "success" ? "text-success" : "text-primary";
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}