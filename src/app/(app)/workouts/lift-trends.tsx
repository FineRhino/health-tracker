"use client";

import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricTrendChart } from "@/components/metric-trend-chart";
import { PERIODS, type PeriodKey } from "@/components/metric-selector";

export interface ExerciseOption {
  name: string;
  sessionCount: number;
}

export interface ExerciseHistoryPoint {
  date: Date;
  weightLbs: number;
}

export function LiftTrends({
  options,
  history,
}: {
  options: ExerciseOption[];
  history: Record<string, ExerciseHistoryPoint[]>;
}) {
  const [selected, setSelected] = useState<string>(options[0]?.name ?? "");
  const [period, setPeriod] = useState<PeriodKey>("90");
  const activePeriod = PERIODS.find((p) => p.key === period)!;

  const chartData = useMemo(() => {
    const rows = history[selected] ?? [];
    const cutoff = activePeriod.days !== null ? subDays(new Date(), activePeriod.days) : null;
    const filtered = cutoff ? rows.filter((r) => r.date >= cutoff) : rows;
    const longRange = activePeriod.days === null || activePeriod.days > 180;
    return filtered.map((r) => ({
      date: format(r.date, longRange ? "MMM d, yy" : "MMM d"),
      weightLbs: r.weightLbs,
    }));
  }, [history, selected, activePeriod]);

  if (options.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lift trends</CardTitle>
        <CardDescription>Top weight per session for a selected exercise · {activePeriod.description}</CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <Select value={selected} onValueChange={(v) => v !== null && setSelected(v)}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.name} value={o.name}>
                    {o.name} ({o.sessionCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as PeriodKey)}>
              <TabsList>
                {PERIODS.map((p) => (
                  <TabsTrigger key={p.key} value={p.key}>
                    {p.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <MetricTrendChart data={chartData} metricKey="weightLbs" label={`${selected} (lbs)`} />
      </CardContent>
    </Card>
  );
}
