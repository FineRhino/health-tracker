export type TargetDirection = "max" | "min";
export type FlagStatus = "over" | "under" | "ok";

export interface NutritionTargetValues {
  caloriesMax: number | null;
  fatMaxG: number | null;
  saturatedFatMaxG: number | null;
  carbsMaxG: number | null;
  proteinMinG: number | null;
  fiberMinG: number | null;
  alcoholMaxG: number | null;
}

export interface TargetMetric {
  key: "calories" | "fatG" | "saturatedFatG" | "carbsG" | "proteinG" | "fiberG" | "alcoholG";
  label: string;
  unit: string;
  direction: TargetDirection;
  targetField: keyof NutritionTargetValues;
}

export const TARGET_METRICS: TargetMetric[] = [
  { key: "calories", label: "Calories", unit: "kcal", direction: "max", targetField: "caloriesMax" },
  { key: "fatG", label: "Fat", unit: "g", direction: "max", targetField: "fatMaxG" },
  {
    key: "saturatedFatG",
    label: "Saturated fat",
    unit: "g",
    direction: "max",
    targetField: "saturatedFatMaxG",
  },
  { key: "carbsG", label: "Carbs", unit: "g", direction: "max", targetField: "carbsMaxG" },
  { key: "proteinG", label: "Protein", unit: "g", direction: "min", targetField: "proteinMinG" },
  { key: "fiberG", label: "Fiber", unit: "g", direction: "min", targetField: "fiberMinG" },
  { key: "alcoholG", label: "Alcohol", unit: "g", direction: "max", targetField: "alcoholMaxG" },
];

export function evaluateMetric(
  value: number | null | undefined,
  target: number | null | undefined,
  direction: TargetDirection
): FlagStatus | null {
  if (value === null || value === undefined || target === null || target === undefined) {
    return null;
  }
  if (direction === "max") return value > target ? "over" : "ok";
  return value < target ? "under" : "ok";
}

export function countFlags(
  entry: Partial<Record<TargetMetric["key"], number | null>>,
  targets: NutritionTargetValues
): number {
  let count = 0;
  for (const metric of TARGET_METRICS) {
    const status = evaluateMetric(entry[metric.key], targets[metric.targetField], metric.direction);
    if (status && status !== "ok") count++;
  }
  return count;
}
