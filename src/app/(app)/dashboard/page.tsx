import Link from "next/link";
import { format, startOfWeek, subDays } from "date-fns";
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

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">
          {value}
          {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default async function DashboardPage() {
  const userId = await requireUserId();

  const ninetyDaysAgo = subDays(new Date(), 90);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const [latestEntry, recentEntries, weekWorkouts, weekFood] = await Promise.all([
    prisma.biometricEntry.findFirst({
      where: { userId },
      orderBy: { recordedAt: "desc" },
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

  const chartData = recentEntries.map((entry) => ({
    date: format(entry.recordedAt, "MMM d"),
    weightLbs: entry.weightLbs,
  }));

  const weekCaloriesBurned = weekWorkouts.reduce((sum, w) => sum + (w.caloriesBurned ?? 0), 0);
  const weekCaloriesEaten = weekFood.reduce((sum, f) => sum + (f.calories ?? 0), 0);

  const hasData = !!latestEntry;

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
        />
        <StatCard
          label="Body fat"
          value={latestEntry?.bodyFatPercent?.toFixed(1) ?? "—"}
          unit="%"
        />
        <StatCard
          label="Lean mass"
          value={latestEntry?.leanMassLbs?.toFixed(1) ?? "—"}
          unit="lbs"
        />
        <StatCard label="BMI" value={latestEntry?.bmi?.toFixed(1) ?? "—"} />
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
            <CardTitle>This week&apos;s workouts</CardTitle>
            <CardDescription>
              {weekWorkouts.length} session{weekWorkouts.length === 1 ? "" : "s"} &middot;{" "}
              {weekCaloriesBurned} calories burned
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>This week&apos;s food log</CardTitle>
            <CardDescription>
              {weekFood.length} entr{weekFood.length === 1 ? "y" : "ies"} &middot; {weekCaloriesEaten}{" "}
              calories logged
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
