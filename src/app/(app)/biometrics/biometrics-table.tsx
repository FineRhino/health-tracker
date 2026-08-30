"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { BiometricEntry } from "@/generated/prisma/client";
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
import { BIOMETRIC_FIELDS } from "./fields";

function formatValue(value: number | null, unit?: string) {
  if (value === null) return "—";
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function BiometricsTable({ entries }: { entries: BiometricEntry[] }) {
  const [selected, setSelected] = useState<BiometricEntry | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>BMI</TableHead>
            <TableHead>Body fat %</TableHead>
            <TableHead>Lean mass</TableHead>
            <TableHead>Body water %</TableHead>
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
              <TableCell>{format(entry.recordedAt, "MMM d, yyyy h:mm a")}</TableCell>
              <TableCell>{entry.weightLbs?.toFixed(1) ?? "—"}</TableCell>
              <TableCell>{entry.bmi?.toFixed(1) ?? "—"}</TableCell>
              <TableCell>{entry.bodyFatPercent?.toFixed(1) ?? "—"}</TableCell>
              <TableCell>{entry.leanMassLbs?.toFixed(1) ?? "—"}</TableCell>
              <TableCell>{entry.bodyWaterPercent?.toFixed(1) ?? "—"}</TableCell>
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
                <DialogTitle>{format(selected.recordedAt, "EEEE, MMMM d, yyyy 'at' h:mm a")}</DialogTitle>
                <DialogDescription>All values recorded for this entry.</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {BIOMETRIC_FIELDS.map((f) => (
                  <div key={f.key} className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">{f.label}</span>
                    <span className="text-sm font-medium">
                      {formatValue(
                        selected[f.key as keyof BiometricEntry] as number | null,
                        f.unit
                      )}
                    </span>
                  </div>
                ))}
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
