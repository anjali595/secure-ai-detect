import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export function ConfidenceGauge({
  value,
  label = "Fraud Probability",
  variant = "danger",
}: {
  value: number; // 0..100
  label?: string;
  variant?: "danger" | "success" | "primary";
}) {
  const size = 180;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const progress = useMotionValue(0);
  const dashOffset = useTransform(progress, (p) => c - (p / 100) * c);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const controls = animate(progress, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayed(v),
    });
    return () => controls.stop();
  }, [value, progress]);

  const color =
    variant === "danger" ? "var(--danger)" : variant === "success" ? "var(--success)" : "var(--primary)";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`gauge-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--cyan-accent)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke="rgba(255,255,255,0.08)" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={`url(#gauge-${variant})`}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ strokeDashoffset: dashOffset, filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="font-display text-4xl font-bold text-white tabular-nums">
            {Math.round(displayed)}<span className="text-xl text-muted-foreground">%</span>
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}