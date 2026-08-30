import Link from "next/link";
import { format, startOfWeek, subDays } from "date-fns";
import { Dumbbell, Apple } from "lucide-react";
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
import { DashboardMetrics } from "./dashboard-metrics";

export default async function DashboardPage() {
  const userId = await requireUserId();

  const ninetyDaysAgo = subDays(new Date(), 90);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const [lastTwoEntries, recentEntries, weekWorkouts, weekFood] = await Promise.all([
    prisma.biometricEntry.findMany({
      where: { userId },
      orderBy: { recordedAt: "desc" },
      take: 2,
      select: { recordedAt: true, weightLbs: true, bodyFatPercent: true, leanMassLbs: true, bmi: true },
    }),
    prisma.biometricEntry.findMany({
      where: { userId, recordedAt: { gte: ninetyDaysAgo } },
      orderBy: { recordedAt: "asc" },
      select: { recordedAt: true, weightLbs: true, bodyFatPercent: true, leanMassLbs: true, bmi: true },
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

  const history = recentEntries.map((entry) => ({
    date: format(entry.recordedAt, "MMM d"),
    weightLbs: entry.weightLbs,
    bodyFatPercent: entry.bodyFatPercent,
    leanMassLbs: entry.leanMassLbs,
    bmi: entry.bmi,
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

      <DashboardMetrics latest={latestEntry ?? {}} previous={previousEntry ?? null} history={history} />

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
