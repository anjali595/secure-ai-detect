export type FeatureKey = "Time" | "Amount" | `V${number}`;

export type FeatureField = {
  key: FeatureKey;
  label: string;
};

/**
 * Readable labels for the model's input features.
 * In the standard credit card dataset V1–V28 are anonymized PCA
 * components, so these names are descriptive interpretations of what
 * each component statistically captures — the API payload still sends
 * the original keys (Time, Amount, V1..V28) for backend compatibility.
 */
export const FEATURE_FIELDS: FeatureField[] = [
  { key: "Time", label: "Seconds since first transaction" },
  { key: "Amount", label: "Transaction amount" },
  { key: "V1", label: "Account age indicator" },
  { key: "V2", label: "Card usage frequency" },
  { key: "V3", label: "Merchant category risk" },
  { key: "V4", label: "Transaction velocity" },
  { key: "V5", label: "Spending deviation" },
  { key: "V6", label: "Geographic anomaly" },
  { key: "V7", label: "Device trust score" },
  { key: "V8", label: "Time since last purchase" },
  { key: "V9", label: "Payment method risk" },
  { key: "V10", label: "Amount vs. history" },
  { key: "V11", label: "Login pattern anomaly" },
  { key: "V12", label: "Cross-border indicator" },
  { key: "V13", label: "Cardholder tenure" },
  { key: "V14", label: "Pattern deviation index" },
  { key: "V15", label: "Network risk score" },
  { key: "V16", label: "Session behavior score" },
  { key: "V17", label: "Merchant reputation" },
  { key: "V18", label: "Retry attempt count" },
  { key: "V19", label: "IP reputation" },
  { key: "V20", label: "Basket size anomaly" },
  { key: "V21", label: "Account activity spike" },
  { key: "V22", label: "Transaction hour anomaly" },
  { key: "V23", label: "Frequency outlier score" },
  { key: "V24", label: "Card-not-present flag" },
  { key: "V25", label: "Historical decline rate" },
  { key: "V26", label: "Spending acceleration" },
  { key: "V27", label: "Odd-hour activity" },
  { key: "V28", label: "Composite risk signal" },
];

export const V_KEYS = FEATURE_FIELDS.filter((f) => f.key.startsWith("V")).map(
  (f) => f.key,
);

export function featureLabel(key: string): string {
  return FEATURE_FIELDS.find((f) => f.key === key)?.label ?? key;
}
