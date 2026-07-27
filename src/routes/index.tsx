import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Brain,
  CreditCard,
  Database,
  Gauge,
  Lock,
  PieChart,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { StatCard } from "@/components/StatCard";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { fadeIn, slideUp, stagger } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SecurePay AI — AI-Powered Credit Card Fraud Detection" },
      { name: "description", content: "Detect fraudulent card transactions in real time with machine learning and risk scoring." },
      { property: "og:title", content: "SecurePay AI — AI-Powered Credit Card Fraud Detection" },
      { property: "og:description", content: "Detect fraudulent card transactions in real time with machine learning and risk scoring." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden pb-24 pt-16 sm:pt-24">
        <AnimatedBackground />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-4xl text-center">
            <motion.div variants={fadeIn} className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Machine learning · real-time · enterprise-grade
            </motion.div>
            <motion.h1
              variants={slideUp}
              className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              AI-Powered <span className="text-gradient">Credit Card</span>
              <br />
              Fraud Detection
            </motion.h1>
            <motion.p variants={fadeIn} className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Detect fraudulent transactions instantly using machine learning and real-time risk analysis. Enterprise fintech precision, delivered through a single API.
            </motion.p>
            <motion.div variants={fadeIn} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:opacity-90">
                <Link to="/detect">
                  <Zap className="mr-2 h-4 w-4" /> Try Detection
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                <Link to="/about">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            <StatCard icon={Database} label="Transactions" value={284807} accent="primary" />
            <StatCard icon={Brain} label="AI Accuracy" value={99.4} decimals={1} suffix="%" accent="accent" />
            <StatCard icon={Activity} label="Prediction Speed" value={38} suffix="ms" accent="success" />
            <StatCard icon={Lock} label="Secure Processing" value={100} suffix="%" accent="danger" />
          </motion.div>
        </div>
      </section>

      <FeaturesSection />
    </div>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Activity, title: "Real-Time Detection", description: "Sub-second predictions on every transaction, so risky payments never make it through." },
    { icon: Brain, title: "Machine Learning Powered", description: "Gradient-boosted ensemble trained on 284k+ real card transactions." },
    { icon: ShieldCheck, title: "High Accuracy", description: "99.4% accuracy with tuned precision-recall on the imbalanced fraud class." },
    { icon: Gauge, title: "Risk Scoring", description: "Every transaction returns a calibrated probability and a confidence score." },
    { icon: BarChart3, title: "Data Visualization", description: "Explore fraud trends, distributions, and risk tiers in a live dashboard." },
    { icon: Upload, title: "CSV Upload", description: "Batch-analyze thousands of transactions and export a downloadable report." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Platform</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Everything you need to stop fraud
        </h2>
        <p className="mt-3 text-muted-foreground">
          A complete detection stack — from real-time scoring to batch analytics — behind one clean interface.
        </p>
      </div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card mt-16 grid gap-6 p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-accent">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Ready when you are</span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Score your first transaction in seconds
          </h3>
          <p className="mt-2 text-muted-foreground">
            Paste a transaction, upload a CSV, or wire the API directly. The dashboard updates as results roll in.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-self-end">
          <Button asChild className="bg-gradient-to-r from-primary to-accent text-white">
            <Link to="/detect"><Zap className="mr-2 h-4 w-4" /> Start Detection</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
            <Link to="/dashboard"><PieChart className="mr-2 h-4 w-4" /> View Dashboard</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
