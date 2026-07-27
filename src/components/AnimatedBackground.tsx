import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Activity, Lock, BarChart3 } from "lucide-react";

const floaters = [
  { Icon: CreditCard, x: "10%", y: "20%", delay: 0 },
  { Icon: ShieldCheck, x: "80%", y: "15%", delay: 1 },
  { Icon: Activity, x: "15%", y: "75%", delay: 2 },
  { Icon: Lock, x: "85%", y: "70%", delay: 1.5 },
  { Icon: BarChart3, x: "50%", y: "85%", delay: 0.8 },
];

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/25 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: "-6s" }} />
      <div className="absolute -bottom-40 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl animate-blob" style={{ animationDelay: "-12s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      {floaters.map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-white/10"
          style={{ left: x, top: y }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, -18, 0], opacity: 0.35 }}
          transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="h-10 w-10" />
        </motion.div>
      ))}
    </div>
  );
}