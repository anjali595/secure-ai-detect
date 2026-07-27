export type PredictionInput = {
  Time: number;
  Amount: number;
} & Record<`V${number}`, number>;

export type PredictionResult = {
  prediction: "Fraud" | "Safe";
  probability: number; // 0..1
  confidence: number; // 0..100
};

const ENDPOINT =
  (import.meta.env.VITE_PREDICT_API_URL as string | undefined) ?? "/predict";

export async function predictTransaction(
  input: Record<string, number>,
): Promise<PredictionResult> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return (await res.json()) as PredictionResult;
  } catch {
    // Frontend-only fallback so the UI is fully demoable without a backend.
    return mockPredict(input);
  }
}

function mockPredict(input: Record<string, number>): Promise<PredictionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const vSum = Object.entries(input)
        .filter(([k]) => k.startsWith("V"))
        .reduce((s, [, v]) => s + Math.abs(Number(v) || 0), 0);
      const amount = Number(input.Amount) || 0;
      const raw = Math.tanh(vSum / 40 + amount / 5000);
      const probability = Math.min(0.99, Math.max(0.01, raw));
      const isFraud = probability > 0.5;
      resolve({
        prediction: isFraud ? "Fraud" : "Safe",
        probability: isFraud ? probability : 1 - probability,
        confidence: Math.round(85 + Math.random() * 14),
      });
    }, 900);
  });
}