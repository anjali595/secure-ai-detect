export const dashboardKpis = {
  totalTransactions: 284807,
  fraudulent: 492,
  safe: 284315,
  fraudRate: 0.172, // %
  accuracy: 99.4,
};

export const fraudVsGenuine = [
  { name: "Genuine", value: 284315, color: "var(--success)" },
  { name: "Fraud", value: 492, color: "var(--danger)" },
];

export const monthlyFraudTrend = [
  { month: "Jan", fraud: 32, safe: 21000 },
  { month: "Feb", fraud: 41, safe: 22400 },
  { month: "Mar", fraud: 38, safe: 24800 },
  { month: "Apr", fraud: 55, safe: 23100 },
  { month: "May", fraud: 47, safe: 25600 },
  { month: "Jun", fraud: 61, safe: 26900 },
  { month: "Jul", fraud: 52, safe: 27300 },
  { month: "Aug", fraud: 68, safe: 28100 },
  { month: "Sep", fraud: 44, safe: 27800 },
  { month: "Oct", fraud: 39, safe: 26400 },
  { month: "Nov", fraud: 33, safe: 25100 },
  { month: "Dec", fraud: 29, safe: 24200 },
];

export const riskLevels = [
  { level: "Very Low", count: 182400 },
  { level: "Low", count: 78900 },
  { level: "Medium", count: 22800 },
  { level: "High", count: 4210 },
  { level: "Critical", count: 497 },
];

export const transactionDistribution = [
  { range: "$0-50", count: 92400 },
  { range: "$50-200", count: 118200 },
  { range: "$200-500", count: 48100 },
  { range: "$500-1k", count: 18400 },
  { range: "$1k-5k", count: 6800 },
  { range: "$5k+", count: 907 },
];

export type SampleTx = {
  id: string;
  amount: number;
  prediction: "Fraud" | "Safe";
  probability: number;
  time: string;
  status: "Approved" | "Blocked" | "Review";
};

export const sampleTransactions: SampleTx[] = [
  { id: "TX-93481", amount: 128.4, prediction: "Safe", probability: 0.02, time: "2m ago", status: "Approved" },
  { id: "TX-93480", amount: 2450.0, prediction: "Fraud", probability: 0.94, time: "6m ago", status: "Blocked" },
  { id: "TX-93479", amount: 39.99, prediction: "Safe", probability: 0.01, time: "11m ago", status: "Approved" },
  { id: "TX-93478", amount: 899.5, prediction: "Fraud", probability: 0.71, time: "17m ago", status: "Review" },
  { id: "TX-93477", amount: 12.5, prediction: "Safe", probability: 0.03, time: "22m ago", status: "Approved" },
  { id: "TX-93476", amount: 4780.0, prediction: "Fraud", probability: 0.98, time: "31m ago", status: "Blocked" },
  { id: "TX-93475", amount: 210.75, prediction: "Safe", probability: 0.08, time: "42m ago", status: "Approved" },
  { id: "TX-93474", amount: 55.0, prediction: "Safe", probability: 0.04, time: "58m ago", status: "Approved" },
  { id: "TX-93473", amount: 1650.0, prediction: "Fraud", probability: 0.86, time: "1h ago", status: "Blocked" },
  { id: "TX-93472", amount: 320.4, prediction: "Safe", probability: 0.12, time: "1h ago", status: "Approved" },
];