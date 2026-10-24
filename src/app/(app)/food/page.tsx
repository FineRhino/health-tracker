import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FoodForm } from "./food-form";
import { ImportDialog } from "./import-dialog";
import { BarcodeDialog } from "./barcode-dialog";
import { QuickAddBar } from "./quick-add-bar";
import { DeleteEntryButton } from "./delete-entry-button";
import { getFrequentFoods } from "./actions";
import {
  TARGET_METRICS,
  evaluateMetric,
  type NutritionTargetValues,
} from "@/lib/nutrition-targets";

const mealStyles: Record<string, { label: string; className: string }> = {
  BREAKFAST: {
    label: "Breakfast",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  },
  LUNCH: {
    label: "Lunch",
    className: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400",
  },
  DINNER: {
    label: "Dinner",
    className: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-400",
  },
  SNACK: {
    label: "Snack",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-400",
  },
};

export default async function FoodPage() {
  const userId = await requireUserId();

  const [entries, target, frequentFoods] = await Promise.all([
    prisma.foodEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 200,
    }),
    prisma.nutritionTarget.findUnique({ where: { userId } }),
    getFrequentFoods(8),
  ]);

  const targets: NutritionTargetValues = {
    caloriesMax: target?.caloriesMax ?? null,
    fatMaxG: target?.fatMaxG ?? null,
    saturatedFatMaxG: target?.saturatedFatMaxG ?? null,
    carbsMaxG: target?.carbsMaxG ?? null,
    proteinMinG: target?.proteinMinG ?? null,
    fiberMinG: target?.fiberMinG ?? null,
    alcoholMaxG: target?.alcoholMaxG ?? null,
  };

  const groups = new Map<string, typeof entries>();
  for (const entry of entries) {
    const key = format(entry.date, "yyyy-MM-dd");
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Food</h1>
          <p className="text-sm text-muted-foreground">Log meals and track daily macros.</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportDialog />
          <BarcodeDialog />
          <FoodForm />
        </div>
      </div>

      <QuickAddBar foods={frequentFoods} />

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No food entries yet. Log your first meal above.
          </CardContent>
        </Card>
      ) : (
        Array.from(groups.entries()).map(([day, dayEntries]) => {
          const totals = {
            calories: dayEntries.reduce((s, e) => s + (e.calories ?? 0), 0),
            proteinG: dayEntries.reduce((s, e) => s + (e.proteinG ?? 0), 0),
            carbsG: dayEntries.reduce((s, e) => s + (e.carbsG ?? 0), 0),
            fatG: dayEntries.reduce((s, e) => s + (e.fatG ?? 0), 0),
            saturatedFatG: dayEntries.reduce((s, e) => s + (e.saturatedFatG ?? 0), 0),
            fiberG: dayEntries.reduce((s, e) => s + (e.fiberG ?? 0), 0),
            alcoholG: dayEntries.reduce((s, e) => s + (e.alcoholG ?? 0), 0),
          };

          const flags = TARGET_METRICS.map((metric) => ({
            metric,
            status: evaluateMetric(totals[metric.key], targets[metric.targetField], metric.direction),
          })).filter((f) => f.status === "over" || f.status === "under");
          const flaggedKeys = new Set(flags.map((f) => f.metric.key));

          const macroClass = (key: (typeof TARGET_METRICS)[number]["key"]) =>
            flaggedKeys.has(key) ? "font-medium text-destructive" : undefined;

          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle>{format(dayEntries[0].date, "EEEE, MMMM d")}</CardTitle>
                <CardDescription>
                  <span className={macroClass("calories")}>{totals.calories} cal</span> &middot;{" "}
                  <span className={macroClass("proteinG")}>{totals.proteinG.toFixed(0)}g protein</span>{" "}
                  &middot; <span className={macroClass("carbsG")}>{totals.carbsG.toFixed(0)}g carbs</span>{" "}
                  &middot; <span className={macroClass("fatG")}>{totals.fatG.toFixed(0)}g fat</span>{" "}
                  &middot;{" "}
                  <span className={macroClass("saturatedFatG")}>
                    {totals.saturatedFatG.toFixed(0)}g sat fat
                  </span>{" "}
                  &middot; <span className={macroClass("fiberG")}>{totals.fiberG.toFixed(0)}g fiber</span>{" "}
                  &middot;{" "}
                  <span className={macroClass("alcoholG")}>{totals.alcoholG.toFixed(0)}g alcohol</span>
                </CardDescription>
                {flags.length > 0 && (
                  <CardAction>
                    <Badge variant="destructive">
                      <AlertTriangle /> {flags.length} flag{flags.length === 1 ? "" : "s"}
                    </Badge>
                  </CardAction>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meal</TableHead>
                      <TableHead>Food</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead>Protein</TableHead>
                      <TableHead>Carbs</TableHead>
                      <TableHead>Fat</TableHead>
                      <TableHead>Fiber</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dayEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Badge variant="secondary" className={mealStyles[entry.mealType].className}>
                            {mealStyles[entry.mealType].label}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.name}</TableCell>
                        <TableCell>{entry.calories ?? "—"}</TableCell>
                        <TableCell>{entry.proteinG ?? "—"}</TableCell>
                        <TableCell>{entry.carbsG ?? "—"}</TableCell>
                        <TableCell>{entry.fatG ?? "—"}</TableCell>
                        <TableCell>{entry.fiberG ?? "—"}</TableCell>
                        <TableCell>
                          <DeleteEntryButton id={entry.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
