"use client";

import { MetricSelector, type MetricConfig } from "@/components/metric-selector";

type BiometricKey = "weightLbs" | "bodyFatPercent" | "leanMassLbs" | "bmi";

const METRICS: MetricConfig<BiometricKey>[] = [
  { key: "weightLbs", label: "Weight", unit: "lbs" },
  { key: "bodyFatPercent", label: "Body fat", unit: "%" },
  { key: "leanMassLbs", label: "Lean mass", unit: "lbs" },
  { key: "bmi", label: "BMI" },
];

export function DashboardMetrics({
  latest,
  previous,
  history,
}: {
  latest: Partial<Record<BiometricKey, number | null>>;
  previous: Partial<Record<BiometricKey, number | null>> | null;
  history: (Partial<Record<BiometricKey, number | null>> & { date: Date })[];
}) {
  return (
    <MetricSelector
      metrics={METRICS}
      defaultKey="weightLbs"
      latest={latest}
      previous={previous}
      history={history}
    />
  );
}
