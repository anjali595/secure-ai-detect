import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Database, LineChart, ShieldCheck, Sparkles, Target } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { fadeIn, stagger } from "@/lib/motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SecurePay AI" },
      { name: "description", content: "How SecurePay AI detects credit card fraud with ML, and the algorithms and metrics behind the model." },
      { property: "og:title", content: "About — SecurePay AI" },
      { property: "og:description", content: "How SecurePay AI detects credit card fraud with ML, and the algorithms and metrics behind the model." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.header initial="hidden" animate="show" variants={stagger} className="text-center">
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> How it works
          </motion.div>
          <motion.h1 variants={fadeIn} className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Detecting fraud with <span className="text-gradient">machine learning</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            SecurePay AI is trained on real anonymized card transaction data to spot fraudulent behavior the moment it happens.
          </motion.p>
        </motion.header>

        <Section title="What is credit card fraud?" icon={ShieldCheck}>
          Credit card fraud is any unauthorized use of a card or its details to obtain goods, services, or cash.
          It ranges from stolen card numbers used online to sophisticated account-takeover attacks. Fraudulent
          transactions look mostly normal on the surface — the signals are hidden in behavior patterns, timing,
          and combinations of features that are hard to catch with static rules.
        </Section>

        <Section title="How AI detects fraud" icon={Brain}>
          Instead of hand-written rules, we train models on hundreds of thousands of historical transactions
          labeled as fraud or genuine. The model learns subtle multi-dimensional patterns — combinations of
          amount, time, and 28 anonymized PCA features — and outputs a calibrated probability that a new
          transaction is fraudulent, along with a confidence score.
        </Section>

        <Section title="Algorithms used" icon={Target}>
          <ul className="mt-2 grid gap-2 sm:grid-cols-3">
            {["Logistic Regression", "Random Forest", "XGBoost"].map((a) => (
              <li key={a} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            The production model is a tuned XGBoost ensemble, with logistic regression as a fast baseline and
            random forest for feature-importance analysis.
          </p>
        </Section>

        <Section title="Dataset" icon={Database}>
          Trained on the European Card Transactions Dataset from Kaggle — 284,807 transactions collected over
          two days in September 2013, with 492 confirmed frauds. Features V1..V28 are the result of a PCA
          transformation applied for privacy; only <span className="text-white">Time</span> and{" "}
          <span className="text-white">Amount</span> are in their original form.
        </Section>

        <Section title="Evaluation metrics" icon={LineChart}>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {[
              { k: "Accuracy", v: "99.4%" },
              { k: "Precision", v: "92.1%" },
              { k: "Recall", v: "86.3%" },
              { k: "F1 Score", v: "89.1%" },
              { k: "ROC-AUC", v: "0.984" },
            ].map((m) => (
              <div key={m.k} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{m.k}</p>
                <p className="mt-1 font-display text-lg font-bold text-white">{m.v}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      className="glass-card mt-8 p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-accent ring-1 ring-white/10">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </motion.section>
  );
}