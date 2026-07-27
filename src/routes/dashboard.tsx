import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { fadeIn, stagger } from "@/lib/motion";
import {
  dashboardKpis,
  fraudVsGenuine,
  monthlyFraudTrend,
  riskLevels,
  transactionDistribution,
} from "@/lib/mockData";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SecurePay AI" },
      { name: "description", content: "Live analytics for card transactions, fraud trends, and model performance." },
      { property: "og:title", content: "Dashboard — SecurePay AI" },
      { property: "og:description", content: "Live analytics for card transactions, fraud trends, and model performance." },
    ],
  }),
  component: Dashboard,
});

const PIE_COLORS = ["var(--success)", "var(--danger)"];

function Dashboard() {
  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Overview</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Fraud analytics dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">Live performance of the SecurePay AI fraud detection model.</p>
        </header>

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5"
        >
          <StatCard icon={Activity} label="Total Transactions" value={dashboardKpis.totalTransactions} accent="primary" />
          <StatCard icon={AlertTriangle} label="Fraudulent" value={dashboardKpis.fraudulent} accent="danger" />
          <StatCard icon={ShieldCheck} label="Safe" value={dashboardKpis.safe} accent="success" />
          <StatCard icon={Percent} label="Fraud Rate" value={dashboardKpis.fraudRate} decimals={2} suffix="%" accent="accent" />
          <StatCard icon={Brain} label="Accuracy" value={dashboardKpis.accuracy} decimals={1} suffix="%" accent="primary" />
        </motion.div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <ChartCard title="Transaction Distribution" subtitle="By amount range" icon={BarChart3}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={transactionDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Fraud vs Genuine" subtitle="Overall transaction split">
            <ResponsiveContainer width="100%" height={280}>
              <RPieChart>
                <Pie data={fraudVsGenuine} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                  {fraudVsGenuine.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </RPieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-6 text-xs text-muted-foreground">
              <LegendDot color="var(--success)" label="Genuine" />
              <LegendDot color="var(--danger)" label="Fraud" />
            </div>
          </ChartCard>

          <ChartCard title="Monthly Fraud Trend" subtitle="Fraudulent transactions per month">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyFraudTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
                <Line type="monotone" dataKey="fraud" stroke="var(--danger)" strokeWidth={3} dot={{ r: 4, fill: "var(--danger)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Risk Level Distribution" subtitle="Transactions by risk tier">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={riskLevels} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="level" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {riskLevels.map((_, i) => (
                    <Cell key={i} fill={["var(--success)", "var(--primary)", "var(--accent)", "var(--chart-5)", "var(--danger)"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon?: any; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="glass-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        {Icon && (
          <span className="grid h-8 w-8 place-items-center rounded-md bg-white/5 text-accent ring-1 ring-white/10">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <div>
          <h3 className="font-display text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      {label && <p className="font-medium text-white">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="tabular-nums text-muted-foreground">
          <span className="text-white">{p.name}:</span> {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}