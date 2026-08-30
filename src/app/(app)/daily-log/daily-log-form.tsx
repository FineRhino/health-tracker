"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { createDailyLogEntry, type DailyLogFormValues } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { DAILY_LOG_FIELDS } from "./fields";

const numericFields = DAILY_LOG_FIELDS as {
  key: keyof DailyLogFormValues;
  label: string;
  unit?: string;
}[];

export function DailyLogForm() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<DailyLogFormValues>({
    defaultValues: { date: format(new Date(), "yyyy-MM-dd") },
  });

  async function onSubmit(values: DailyLogFormValues) {
    const result = await createDailyLogEntry(values);
    if (result?.success) {
      reset({ date: format(new Date(), "yyyy-MM-dd") });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus /> Log day
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log daily totals</DialogTitle>
          <DialogDescription>
            Enter your macro totals and any daily ratings. Leave fields blank if not tracked.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Input id="date" type="date" {...register("date", { required: true })} />
            </Field>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {numericFields.map((f) => (
                <Field key={f.key}>
                  <FieldLabel htmlFor={f.key}>
                    {f.label}
                    {f.unit && <span className="text-muted-foreground"> ({f.unit})</span>}
                  </FieldLabel>
                  <Input
                    id={f.key}
                    type="number"
                    step="any"
                    inputMode="decimal"
                    {...register(f.key)}
                  />
                </Field>
              ))}
            </div>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea id="notes" rows={2} {...register("notes")} />
            </Field>

            {errors.date && <FieldError>{errors.date.message}</FieldError>}
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
