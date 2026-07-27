import { createFileRoute } from "@tanstack/react-router";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { TransactionTable } from "@/components/TransactionTable";
import { CsvUploader } from "@/components/CsvUploader";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SecurePay AI" },
      { name: "description", content: "Search transaction history and run batch CSV fraud analysis." },
      { property: "og:title", content: "Analytics — SecurePay AI" },
      { property: "og:description", content: "Search transaction history and run batch CSV fraud analysis." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Analytics</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Transaction history & batch analysis
          </h1>
          <p className="mt-2 text-muted-foreground">Search recent transactions or upload a CSV file to score them in bulk.</p>
        </header>

        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-white">Recent transactions</h2>
          <TransactionTable />
        </section>

        <section className="mt-10">
          <h2 className="font-display mb-3 text-xl font-semibold text-white">CSV analysis</h2>
          <CsvUploader />
        </section>
      </div>
    </div>
  );
}