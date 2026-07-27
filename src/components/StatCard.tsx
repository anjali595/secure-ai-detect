import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { fadeIn } from "@/lib/motion";

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  decimals = 0,
  accent = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  accent?: "primary" | "accent" | "success" | "danger";
}) {
  const accentMap = {
    primary: "from-primary/30 to-primary/0 text-primary",
    accent: "from-accent/30 to-accent/0 text-accent",
    success: "from-success/30 to-success/0 text-success",
    danger: "from-destructive/30 to-destructive/0 text-destructive",
  } as const;
  return (
    <motion.div
      variants={fadeIn}
      whileHover={{ y: -4 }}
      className="glass-card group relative overflow-hidden p-5"
    >
      <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${accentMap[accent]} opacity-40 blur-2xl`} />
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 ${accentMap[accent].split(" ").pop()}`}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="min-w-0 truncate text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-4 font-display text-3xl font-bold tracking-tight text-white">
        <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
      </p>
    </motion.div>
  );
}