import Link from "next/link";
import { format, startOfWeek, subDays } from "date-fns";
import { ArrowUpRight, Dumbbell, Apple, TrendingDown, TrendingUp } from "lucide-react";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { WeightTrendChart } from "./weight-trend-chart";

function Trend({ delta, unit }: { delta: number | null; unit?: string }) {
  if (delta === null || Math.abs(delta) < 0.05) return null;
  const isUp = delta > 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <div
      className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        isUp ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
      }`}
    >
      <Icon className="size-3" />
      {isUp ? "+" : ""}
      {delta.toFixed(1)}
      {unit} since last reading
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  delta,
  featured,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: number | null;
  featured?: boolean;
}) {
  return (
    <Card className={featured ? "bg-primary text-primary-foreground" : undefined}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardDescription className={featured ? "text-primary-foreground/80" : undefined}>
            {label}
          </CardDescription>
          <Link
            href="/biometrics"
            className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
              featured
                ? "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25"
                : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
            } transition-colors`}
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <CardTitle className={`text-2xl ${featured ? "text-primary-foreground" : ""}`}>
          {value}
          {unit && (
            <span
              className={`ml-1 text-sm font-normal ${featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}
            >
              {unit}
            </span>
          )}
        </CardTitle>
        {!featured && <Trend delta={delta ?? null} unit={unit} />}
      </CardHeader>
    </Card>
  );
}

export default async function DashboardPage() {
  const userId = await requireUserId();

  const ninetyDaysAgo = subDays(new Date(), 90);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const [lastTwoEntries, recentEntries, weekWorkouts, weekFood] = await Promise.all([
    prisma.biometricEntry.findMany({
      where: { userId },
      orderBy: { recordedAt: "desc" },
      take: 2,
    }),
    prisma.biometricEntry.findMany({
      where: { userId, recordedAt: { gte: ninetyDaysAgo } },
      orderBy: { recordedAt: "asc" },
      select: { recordedAt: true, weightLbs: true },
    }),
    prisma.workout.findMany({
      where: { userId, date: { gte: weekStart } },
      select: { caloriesBurned: true },
    }),
    prisma.foodEntry.findMany({
      where: { userId, date: { gte: weekStart } },
      select: { calories: true },
    }),
  ]);

  const [latestEntry, previousEntry] = lastTwoEntries;

  const chartData = recentEntries.map((entry) => ({
    date: format(entry.recordedAt, "MMM d"),
    weightLbs: entry.weightLbs,
  }));

  const weekCaloriesBurned = weekWorkouts.reduce((sum, w) => sum + (w.caloriesBurned ?? 0), 0);
  const weekCaloriesEaten = weekFood.reduce((sum, f) => sum + (f.calories ?? 0), 0);

  const hasData = !!latestEntry;

  function delta(field: "weightLbs" | "bodyFatPercent" | "leanMassLbs" | "bmi") {
    if (!latestEntry?.[field] || !previousEntry?.[field]) return null;
    return latestEntry[field]! - previousEntry[field]!;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {hasData
            ? `Latest reading from ${format(latestEntry.recordedAt, "MMMM d, yyyy")}`
            : "Log your first biometric entry to get started."}
        </p>
      </div>

      {!hasData && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No data yet. Start by logging a biometric reading, a workout, or a meal.
            </p>
            <Link href="/biometrics" className={buttonVariants()}>
              Log a biometric entry
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Weight"
          value={latestEntry?.weightLbs?.toFixed(1) ?? "—"}
          unit="lbs"
          delta={delta("weightLbs")}
          featured
        />
        <StatCard
          label="Body fat"
          value={latestEntry?.bodyFatPercent?.toFixed(1) ?? "—"}
          unit="%"
          delta={delta("bodyFatPercent")}
        />
        <StatCard
          label="Lean mass"
          value={latestEntry?.leanMassLbs?.toFixed(1) ?? "—"}
          unit="lbs"
          delta={delta("leanMassLbs")}
        />
        <StatCard
          label="BMI"
          value={latestEntry?.bmi?.toFixed(1) ?? "—"}
          delta={delta("bmi")}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weight trend</CardTitle>
          <CardDescription>Last 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <WeightTrendChart data={chartData} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Dumbbell className="size-4" />
              </div>
              <div>
                <CardTitle>This week&apos;s workouts</CardTitle>
                <CardDescription>
                  {weekWorkouts.length} session{weekWorkouts.length === 1 ? "" : "s"} &middot;{" "}
                  {weekCaloriesBurned} calories burned
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/workouts" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View workouts
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Apple className="size-4" />
              </div>
              <div>
                <CardTitle>This week&apos;s food log</CardTitle>
                <CardDescription>
                  {weekFood.length} entr{weekFood.length === 1 ? "y" : "ies"} &middot;{" "}
                  {weekCaloriesEaten} calories logged
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/food" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View food log
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
