"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { DeleteEntryButton } from "./delete-entry-button";
import { DAILY_LOG_FIELDS } from "./fields";

function formatValue(value: number | null, unit?: string) {
  if (value === null) return "—";
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function DailyLogTable({ entries }: { entries: DailyLog[] }) {
  const [selected, setSelected] = useState<DailyLog | null>(null);

  const netCarbs =
    selected?.carbsG !== null && selected?.carbsG !== undefined && selected?.fiberG !== null && selected?.fiberG !== undefined
      ? selected.carbsG - selected.fiberG
      : null;

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
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              className="cursor-pointer"
              onClick={() => setSelected(entry)}
            >
              <TableCell>{format(entry.date, "EEE, MMM d, yyyy")}</TableCell>
              <TableCell>{entry.calories?.toFixed(0) ?? "—"}</TableCell>
              <TableCell>{entry.fatG?.toFixed(0) ?? "—"}</TableCell>
              <TableCell>{entry.carbsG?.toFixed(0) ?? "—"}</TableCell>
              <TableCell>{entry.proteinG?.toFixed(0) ?? "—"}</TableCell>
              <TableCell>{entry.fiberG?.toFixed(0) ?? "—"}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DeleteEntryButton id={entry.id} />
              </TableCell>
            </TableRow>
          ))}
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
                {DAILY_LOG_FIELDS.map((f) => (
                  <div key={f.key} className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">{f.label}</span>
                    <span className="text-sm font-medium">
                      {formatValue(
                        selected[f.key as keyof DailyLog] as number | null,
                        f.unit
                      )}
                    </span>
                  </div>
                ))}
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
