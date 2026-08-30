"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { createBiometricEntry, type BiometricFormValues } from "./actions";
import { BIOMETRIC_FIELDS } from "./fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldLegend,
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

const numericFields = BIOMETRIC_FIELDS as {
  key: keyof BiometricFormValues;
  label: string;
  unit?: string;
}[];

export function BiometricForm() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<BiometricFormValues>({
    defaultValues: { recordedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm") },
  });

  async function onSubmit(values: BiometricFormValues) {
    const result = await createBiometricEntry(values);
    if (result?.success) {
      reset({ recordedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm") });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus /> Log reading
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log biometric reading</DialogTitle>
          <DialogDescription>
            Enter values from your scale or measurement. Leave fields blank if not available.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="recordedAt">Date &amp; time</FieldLabel>
              <Input
                id="recordedAt"
                type="datetime-local"
                {...register("recordedAt", { required: true })}
              />
            </Field>

            <FieldSet>
              <FieldLegend variant="label">Measurements</FieldLegend>
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
            </FieldSet>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea id="notes" rows={2} {...register("notes")} />
            </Field>

            {errors.recordedAt && <FieldError>{errors.recordedAt.message}</FieldError>}
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
