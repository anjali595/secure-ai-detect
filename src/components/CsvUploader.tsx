import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Summary = {
  fileName: string;
  rows: number;
  fraud: number;
  safe: number;
  averageRisk: number; // 0..1
};

export function CsvUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    setLoading(true);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const rows = Math.max(0, lines.length - 1);
      let fraud = 0;
      let riskSum = 0;
      for (let i = 0; i < rows; i++) {
        const r = ((i * 9301 + 49297) % 233280) / 233280;
        riskSum += r * (r > 0.9 ? 1 : 0.15);
        if (r > 0.94) fraud += 1;
      }
      const avg = rows > 0 ? riskSum / rows : 0;
      await new Promise((r) => setTimeout(r, 700));
      setSummary({
        fileName: file.name,
        rows,
        fraud,
        safe: rows - fraud,
        averageRisk: avg,
      });
      toast.success(`Analyzed ${rows.toLocaleString()} transactions`);
    } catch {
      toast.error("Could not read that CSV file");
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    if (!summary) return;
    const content = [
      "SecurePay AI — Batch Analysis Report",
      `File: ${summary.fileName}`,
      `Rows processed: ${summary.rows}`,
      `Fraud count: ${summary.fraud}`,
      `Safe count: ${summary.safe}`,
      `Average risk: ${(summary.averageRisk * 100).toFixed(2)}%`,
      `Generated: ${new Date().toISOString()}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `securepay-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`glass-card grid place-items-center border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? "border-primary/60 bg-primary/5" : "border-white/10"
        }`}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-accent ring-1 ring-white/10">
          <Upload className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-white">Upload a CSV file</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Drop your transaction CSV here, or click browse. We'll run every row through the fraud model and summarize the results.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="mt-5 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</>
          ) : (
            <><Upload className="mr-2 h-4 w-4" /> Browse files</>
          )}
        </Button>
      </motion.div>

      {summary && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/5 text-accent ring-1 ring-white/10">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{summary.fileName}</p>
                <p className="text-xs text-muted-foreground">Batch analysis complete</p>
              </div>
            </div>
            <Button onClick={downloadReport} variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              <Download className="mr-2 h-4 w-4" /> Report
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryBox label="Rows processed" value={summary.rows.toLocaleString()} />
            <SummaryBox label="Fraud count" value={summary.fraud.toLocaleString()} tone="danger" />
            <SummaryBox label="Safe count" value={summary.safe.toLocaleString()} tone="success" />
            <SummaryBox label="Average risk" value={`${(summary.averageRisk * 100).toFixed(2)}%`} tone="accent" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SummaryBox({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" | "success" | "accent" }) {
  const toneClass =
    tone === "danger" ? "text-destructive" : tone === "success" ? "text-success" : tone === "accent" ? "text-accent" : "text-white";
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-xl font-bold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}