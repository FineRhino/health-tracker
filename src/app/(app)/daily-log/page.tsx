import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DailyLogForm } from "./daily-log-form";
import { DailyLogTable } from "./daily-log-table";
import { ImportDialog } from "./import-dialog";

export default async function DailyLogPage() {
  const userId = await requireUserId();

  const entries = await prisma.dailyLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 200,
  });

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
            <DailyLogTable entries={entries} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
