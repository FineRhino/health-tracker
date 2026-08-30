import { format } from "date-fns";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
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
import { DeleteEntryButton } from "./delete-entry-button";

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

  const entries = await prisma.foodEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 200,
  });

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
        <FoodForm />
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No food entries yet. Log your first meal above.
          </CardContent>
        </Card>
      ) : (
        Array.from(groups.entries()).map(([day, dayEntries]) => {
          const totalCalories = dayEntries.reduce((s, e) => s + (e.calories ?? 0), 0);
          const totalProtein = dayEntries.reduce((s, e) => s + (e.proteinG ?? 0), 0);
          const totalCarbs = dayEntries.reduce((s, e) => s + (e.carbsG ?? 0), 0);
          const totalFat = dayEntries.reduce((s, e) => s + (e.fatG ?? 0), 0);

          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle>{format(dayEntries[0].date, "EEEE, MMMM d")}</CardTitle>
                <CardDescription>
                  {totalCalories} cal &middot; {totalProtein.toFixed(0)}g protein &middot;{" "}
                  {totalCarbs.toFixed(0)}g carbs &middot; {totalFat.toFixed(0)}g fat
                </CardDescription>
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
