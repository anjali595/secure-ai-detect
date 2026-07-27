import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { fadeIn } from "@/lib/motion";

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeIn}
      whileHover={{ y: -6 }}
      className="glass-card group relative overflow-hidden p-6 transition-shadow hover:glow-primary"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-accent ring-1 ring-white/10">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}