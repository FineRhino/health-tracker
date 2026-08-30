"use client";

import { useActionState, useRef } from "react";
import { Upload } from "lucide-react";
import { importDailyLogFile } from "./actions";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function ImportDialog() {
  const [state, action, pending] = useActionState(importDailyLogFile, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) formRef.current?.reset();
      }}
    >
      <DialogTrigger render={<Button variant="outline" />}>
        <Upload /> Import
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import daily totals</DialogTitle>
          <DialogDescription>
            Upload a .xlsx or .csv file with a Date column and daily macro totals (Calories,
            Fat, Carbs, Protein, Fiber, Alcohol, etc). Entries matching an existing date will be
            overwritten with the file&apos;s values.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={action}>
          <Field>
            <FieldLabel htmlFor="file">File</FieldLabel>
            <input
              id="file"
              name="file"
              type="file"
              accept=".xlsx,.csv"
              required
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm file:mr-2 file:rounded-md file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-sm file:font-medium"
            />
            <FieldDescription>
              Max 10MB. If the workbook has multiple sheets, one named or shaped like &quot;DailyTotals&quot; is used automatically.
            </FieldDescription>
            {state && "error" in state && <FieldError>{state.error}</FieldError>}
          </Field>

          {state && "success" in state && (
            <div className="mt-3 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              Imported from sheet &quot;{state.sheetName}&quot;: {state.created} new,{" "}
              {state.updated} updated
              {state.skipped > 0 ? `, ${state.skipped} row(s) skipped (no valid date)` : ""}.
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
