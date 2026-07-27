import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { sampleTransactions } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TransactionTable() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "Fraud" | "Safe">("all");

  const rows = useMemo(() => {
    return sampleTransactions.filter((t) => {
      const matchesQ = q === "" || t.id.toLowerCase().includes(q.toLowerCase());
      const matchesF = filter === "all" || t.prediction === filter;
      return matchesQ && matchesF;
    });
  }, [q, filter]);

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by transaction ID…"
            className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-muted-foreground"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-full border-white/10 bg-white/5 text-white sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All predictions</SelectItem>
            <SelectItem value="Fraud">Fraud only</SelectItem>
            <SelectItem value="Safe">Safe only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-medium">Transaction ID</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Prediction</th>
              <th className="px-3 py-2 font-medium">Probability</th>
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-white/5 text-white transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                <td className="px-3 py-3 tabular-nums">${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-3 py-3">
                  <Badge
                    variant="outline"
                    className={
                      t.prediction === "Fraud"
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-success/40 bg-success/10 text-success"
                    }
                  >
                    {t.prediction}
                  </Badge>
                </td>
                <td className="px-3 py-3 tabular-nums text-muted-foreground">{(t.probability * 100).toFixed(1)}%</td>
                <td className="px-3 py-3 text-muted-foreground">{t.time}</td>
                <td className="px-3 py-3">
                  <StatusPill status={t.status} />
                </td>
              </motion.tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "Approved" | "Blocked" | "Review" }) {
  const map = {
    Approved: "bg-success/10 text-success ring-success/30",
    Blocked: "bg-destructive/10 text-destructive ring-destructive/30",
    Review: "bg-accent/10 text-accent ring-accent/30",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${map[status]}`}>
      {status}
    </span>
  );
}