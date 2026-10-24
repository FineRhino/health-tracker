"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import type { DailyLog } from "@/generated/prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DeleteEntryButton } from "./delete-entry-button";
import { DAILY_LOG_FIELDS } from "./fields";
import {
  TARGET_METRICS,
  evaluateMetric,
  type NutritionTargetValues,
} from "@/lib/nutrition-targets";

function formatValue(value: number | null, unit?: string) {
  if (value === null) return "—";
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return unit ? `${formatted} ${unit}` : formatted;
}

function cellClassName(status: "over" | "under" | "ok" | null) {
  if (status === "over" || status === "under") {
    return "font-medium text-destructive";
  }
  return "";
}

export function DailyLogTable({
  entries,
  targets,
}: {
  entries: DailyLog[];
  targets: NutritionTargetValues;
}) {
  const [selected, setSelected] = useState<DailyLog | null>(null);

  const netCarbs =
    selected?.carbsG !== null && selected?.carbsG !== undefined && selected?.fiberG !== null && selected?.fiberG !== undefined
      ? selected.carbsG - selected.fiberG
      : null;

  const flagsFor = (entry: DailyLog) =>
    TARGET_METRICS.map((metric) => ({
      metric,
      status: evaluateMetric(
        entry[metric.key] as number | null,
        targets[metric.targetField],
        metric.direction
      ),
    })).filter((f) => f.status === "over" || f.status === "under");

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Calories</TableHead>
            <TableHead>Fat</TableHead>
            <TableHead>Carbs</TableHead>
            <TableHead>Protein</TableHead>
            <TableHead>Fiber</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const flags = flagsFor(entry);
            const statusByKey = new Map(flags.map((f) => [f.metric.key, f.status]));

            return (
              <TableRow
                key={entry.id}
                className="cursor-pointer"
                onClick={() => setSelected(entry)}
              >
                <TableCell>{format(entry.date, "EEE, MMM d, yyyy")}</TableCell>
                <TableCell className={cellClassName(statusByKey.get("calories") ?? null)}>
                  {entry.calories?.toFixed(0) ?? "—"}
                </TableCell>
                <TableCell className={cellClassName(statusByKey.get("fatG") ?? null)}>
                  {entry.fatG?.toFixed(0) ?? "—"}
                </TableCell>
                <TableCell className={cellClassName(statusByKey.get("carbsG") ?? null)}>
                  {entry.carbsG?.toFixed(0) ?? "—"}
                </TableCell>
                <TableCell className={cellClassName(statusByKey.get("proteinG") ?? null)}>
                  {entry.proteinG?.toFixed(0) ?? "—"}
                </TableCell>
                <TableCell className={cellClassName(statusByKey.get("fiberG") ?? null)}>
                  {entry.fiberG?.toFixed(0) ?? "—"}
                </TableCell>
                <TableCell>
                  {flags.length > 0 ? (
                    <Badge variant="destructive">
                      <AlertTriangle /> {flags.length}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DeleteEntryButton id={entry.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{format(selected.date, "EEEE, MMMM d, yyyy")}</DialogTitle>
                <DialogDescription>All values recorded for this day.</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {DAILY_LOG_FIELDS.map((f) => {
                  const metric = TARGET_METRICS.find((m) => m.key === f.key);
                  const target = metric ? targets[metric.targetField] : null;
                  const status = metric
                    ? evaluateMetric(
                        selected[f.key as keyof DailyLog] as number | null,
                        target,
                        metric.direction
                      )
                    : null;
                  return (
                    <div key={f.key} className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground">{f.label}</span>
                      <span
                        className={
                          status === "over" || status === "under"
                            ? "text-sm font-medium text-destructive"
                            : "text-sm font-medium"
                        }
                      >
                        {formatValue(
                          selected[f.key as keyof DailyLog] as number | null,
                          f.unit
                        )}
                      </span>
                      {metric && target !== null && target !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          Target: {metric.direction === "max" ? "≤" : "≥"}
                          {target}
                          {f.unit ? ` ${f.unit}` : ""}
                          {status === "over" ? " · over" : status === "under" ? " · under" : ""}
                        </span>
                      )}
                    </div>
                  );
                })}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Net carbs (carbs - fiber)</span>
                  <span className="text-sm font-medium">{formatValue(netCarbs, "g")}</span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Notes</span>
                <span className="text-sm">{selected.notes ?? "—"}</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Logged {format(selected.createdAt, "MMM d, yyyy h:mm a")}
                {selected.updatedAt.getTime() !== selected.createdAt.getTime() &&
                  ` · Last updated ${format(selected.updatedAt, "MMM d, yyyy h:mm a")}`}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
