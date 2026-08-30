"use client";

import { MetricSelector, type MetricConfig } from "@/components/metric-selector";

type NutritionKey = "calories" | "fatG" | "carbsG" | "proteinG" | "fiberG" | "alcoholG";

const METRICS: MetricConfig<NutritionKey>[] = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "fatG", label: "Fat", unit: "g" },
  { key: "carbsG", label: "Carbs", unit: "g" },
  { key: "proteinG", label: "Protein", unit: "g" },
  { key: "fiberG", label: "Fiber", unit: "g" },
  { key: "alcoholG", label: "Alcohol", unit: "g" },
];

export function NutritionMetrics({
  latest,
  previous,
  history,
}: {
  latest: Partial<Record<NutritionKey, number | null>>;
  previous: Partial<Record<NutritionKey, number | null>> | null;
  history: (Partial<Record<NutritionKey, number | null>> & { date: Date })[];
}) {
  return (
    <MetricSelector
      metrics={METRICS}
      defaultKey="calories"
      latest={latest}
      previous={previous}
      history={history}
      gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6"
    />
  );
}
