"use client";

import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const PERIODS = [
  { key: "30", label: "30D", days: 30, description: "Last 30 days" },
  { key: "90", label: "90D", days: 90, description: "Last 90 days" },
  { key: "180", label: "6M", days: 180, description: "Last 6 months" },
  { key: "270", label: "9M", days: 270, description: "Last 9 months" },
  { key: "365", label: "1Y", days: 365, description: "Last year" },
  { key: "all", label: "All", days: null, description: "All time" },
] as const;

type PeriodKey = (typeof PERIODS)[number]["key"];

type MetricValues = Partial<Record<MetricConfig["key"], number | null>>;

interface HistoryRow extends MetricValues {
  date: Date;
}

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
  history: HistoryRow[];
}) {
  const [selectedKey, setSelectedKey] = useState<MetricConfig["key"]>("weightLbs");
  const [period, setPeriod] = useState<PeriodKey>("90");
  const selected = METRICS.find((m) => m.key === selectedKey)!;
  const activePeriod = PERIODS.find((p) => p.key === period)!;

  const chartData = useMemo(() => {
    const cutoff = activePeriod.days !== null ? subDays(new Date(), activePeriod.days) : null;
    const rows = cutoff ? history.filter((row) => row.date >= cutoff) : history;
    const longRange = activePeriod.days === null || activePeriod.days > 180;
    return rows.map((row) => ({
      date: format(row.date, longRange ? "MMM d, yy" : "MMM d"),
      weightLbs: row.weightLbs ?? null,
      bodyFatPercent: row.bodyFatPercent ?? null,
      leanMassLbs: row.leanMassLbs ?? null,
      bmi: row.bmi ?? null,
    }));
  }, [history, activePeriod]);

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
          <CardDescription>{activePeriod.description}</CardDescription>
          <CardAction>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as PeriodKey)}>
              <TabsList>
                {PERIODS.map((p) => (
                  <TabsTrigger key={p.key} value={p.key}>
                    {p.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardAction>
        </CardHeader>
        <CardContent>
          <MetricTrendChart
            data={chartData}
            metricKey={selected.key}
            label={selected.unit ? `${selected.label} (${selected.unit})` : selected.label}
          />
        </CardContent>
      </Card>
    </div>
  );
}
