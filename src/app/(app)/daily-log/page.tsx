import Link from "next/link";
import { Target } from "lucide-react";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyLogForm } from "./daily-log-form";
import { DailyLogTable } from "./daily-log-table";
import { ImportDialog } from "./import-dialog";
import type { NutritionTargetValues } from "@/lib/nutrition-targets";

export default async function DailyLogPage() {
  const userId = await requireUserId();

  const [entries, target] = await Promise.all([
    prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 200,
    }),
    prisma.nutritionTarget.findUnique({ where: { userId } }),
  ]);

  const targetValues: NutritionTargetValues = {
    caloriesMax: target?.caloriesMax ?? null,
    fatMaxG: target?.fatMaxG ?? null,
    saturatedFatMaxG: target?.saturatedFatMaxG ?? null,
    carbsMaxG: target?.carbsMaxG ?? null,
    proteinMinG: target?.proteinMinG ?? null,
    fiberMinG: target?.fiberMinG ?? null,
    alcoholMaxG: target?.alcoholMaxG ?? null,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Daily Log</h1>
          <p className="text-sm text-muted-foreground">
            Daily macro totals, fasting time, and how you felt.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" render={<Link href="/admin" />}>
            <Target /> Targets
          </Button>
          <ImportDialog />
          <DailyLogForm />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No entries yet. Log your first day above.
            </p>
          ) : (
            <DailyLogTable entries={entries} targets={targetValues} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
