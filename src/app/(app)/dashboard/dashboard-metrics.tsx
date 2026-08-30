"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricTrendChart } from "./metric-trend-chart";

interface MetricConfig {
  key: "weightLbs" | "bodyFatPercent" | "leanMassLbs" | "bmi";
  label: string;
  unit?: string;
}

const METRICS: MetricConfig[] = [
  { key: "weightLbs", label: "Weight", unit: "lbs" },
  { key: "bodyFatPercent", label: "Body fat", unit: "%" },
  { key: "leanMassLbs", label: "Lean mass", unit: "lbs" },
  { key: "bmi", label: "BMI" },
];

type MetricValues = Partial<Record<MetricConfig["key"], number | null>>;

function Trend({
  delta,
  unit,
  featured,
}: {
  delta: number | null;
  unit?: string;
  featured: boolean;
}) {
  if (delta === null || Math.abs(delta) < 0.05) return null;
  const isUp = delta > 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <div
      className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        featured
          ? "bg-primary-foreground/15 text-primary-foreground"
          : isUp
            ? "bg-accent text-accent-foreground"
            : "bg-muted text-muted-foreground"
      }`}
    >
      <Icon className="size-3" />
      {isUp ? "+" : ""}
      {delta.toFixed(1)}
      {unit} since last reading
    </div>
  );
}

export function DashboardMetrics({
  latest,
  previous,
  history,
}: {
  latest: MetricValues;
  previous: MetricValues | null;
  history: Record<string, number | string | null>[];
}) {
  const [selectedKey, setSelectedKey] = useState<MetricConfig["key"]>("weightLbs");
  const selected = METRICS.find((m) => m.key === selectedKey)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {METRICS.map((m) => {
          const value = latest[m.key] ?? null;
          const prevValue = previous?.[m.key] ?? null;
          const delta = value !== null && prevValue !== null ? value - prevValue : null;
          const featured = m.key === selectedKey;

          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setSelectedKey(m.key)}
              className="w-full text-left"
              aria-pressed={featured}
            >
              <Card
                className={`transition-all ${
                  featured
                    ? "bg-primary text-primary-foreground"
                    : "hover:ring-2 hover:ring-ring/40"
                }`}
              >
                <CardHeader>
                  <CardDescription className={featured ? "text-primary-foreground/80" : undefined}>
                    {m.label}
                  </CardDescription>
                  <CardTitle className={`text-2xl ${featured ? "text-primary-foreground" : ""}`}>
                    {value?.toFixed(1) ?? "—"}
                    {m.unit && (
                      <span
                        className={`ml-1 text-sm font-normal ${
                          featured ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {m.unit}
                      </span>
                    )}
                  </CardTitle>
                  <Trend delta={delta} unit={m.unit} featured={featured} />
                </CardHeader>
              </Card>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{selected.label} trend</CardTitle>
          <CardDescription>Last 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <MetricTrendChart
            data={history}
            metricKey={selected.key}
            label={selected.unit ? `${selected.label} (${selected.unit})` : selected.label}
          />
        </CardContent>
      </Card>
    </div>
  );
}
