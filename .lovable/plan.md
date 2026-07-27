# SecurePay AI – Frontend Build Plan

A premium dark-theme fintech React app wired to a future `/predict` backend. Frontend-only; the uploaded `.pkl` files are ignored (they belong to the backend, not the browser bundle).

## Design system
- Update `src/styles.css` tokens to the specified palette: bg `#0B1120`, card `#111827`, primary `#3B82F6`, success `#10B981`, danger `#EF4444`, accent cyan `#06B6D4`, white text. Force dark theme by default (add `dark` class on `<html>`).
- Typography: Inter/Space Grotesk via `<link>` in `__root.tsx`.
- Add reusable utilities: glass card, gradient border, animated gradient background, glow shadows.
- Install `framer-motion` and `recharts`.

## Routes (TanStack file-based)
```
src/routes/
  __root.tsx        (updated head + Navbar + Footer wrapper)
  index.tsx         (Landing: hero, stats, features)
  dashboard.tsx     (KPI cards + 4 charts w/ placeholder data)
  detect.tsx        (Prediction form + result card + confidence gauge)
  analytics.tsx     (Transaction history table + CSV upload analysis)
  about.tsx         (Fraud/ML explainer, algorithms, metrics)
```
Each route gets its own `head()` (title, description, og:title, og:description).

## Shared components (`src/components/`)
- `Navbar.tsx` – sticky, blurred, logo "SecurePay AI", nav links, "Start Detection" CTA.
- `Footer.tsx` – project name, GitHub/LinkedIn/Email buttons, copyright.
- `AnimatedBackground.tsx` – gradient blobs + floating fintech icons (Framer Motion).
- `StatCard.tsx`, `FeatureCard.tsx`, `GlassCard.tsx`.
- `ConfidenceGauge.tsx` – SVG circular gauge, animated stroke-dashoffset.
- `ResultCard.tsx` – Safe/Fraud variants with recommendations.
- `TransactionTable.tsx` – search + status filter, sample rows.
- `CsvUploader.tsx` – drag/drop, parses locally with PapaParse-lite (simple split) for row counts; posts to `/predict` batch stub; shows Rows/Fraud/Safe/Avg Risk + download report button.
- `AnimatedCounter.tsx` – motion counter for stats.

## Prediction page
- Form with `Time`, `Amount`, `V1..V28` (30 numeric inputs) in responsive grid (`grid-cols-2 md:grid-cols-4 lg:grid-cols-6`).
- Buttons: Predict, Reset, Upload CSV (opens uploader).
- On Predict: loading state "Analyzing transaction…" then call `predictTransaction()` in `src/lib/api.ts` which `POST`s to `import.meta.env.VITE_PREDICT_API_URL ?? "/predict"`. Falls back to a mocked response when the endpoint isn't reachable so the UI is demoable.
- Toast notifications via existing `sonner`.

## Dashboard
- 5 KPI cards + 4 Recharts (Pie: Fraud vs Genuine, Bar: Risk Level, Line: Monthly Fraud Trend, Bar: Transaction Distribution) with placeholder data in `src/lib/mockData.ts`.

## Animations
Framer Motion presets in `src/lib/motion.ts` (fadeIn, slideUp, stagger, hover). Applied to hero, cards, results, table rows.

## Uploaded .pkl files
Not used in the frontend — noted so the user knows they must be served by a Python backend exposing `/predict`. The frontend is ready to call it via the env var above.

## Out of scope
Auth, real ML inference, persistent storage, backend code.
