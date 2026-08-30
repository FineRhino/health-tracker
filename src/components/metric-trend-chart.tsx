"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function MetricTrendChart({
  data,
  metricKey,
  label,
}: {
  data: Record<string, number | string | null>[];
  metricKey: string;
  label: string;
}) {
  const hasValues = data.some((row) => row[metricKey] !== null && row[metricKey] !== undefined);

  if (!hasValues) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No data for this metric yet.
      </div>
    );
  }

  const chartConfig = {
    [metricKey]: { label, color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          domain={["auto", "auto"]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey={metricKey}
          type="monotone"
          stroke={`var(--color-${metricKey})`}
          strokeWidth={2}
          dot={false}
          connectNulls
        />
      </LineChart>
    </ChartContainer>
  );
}
