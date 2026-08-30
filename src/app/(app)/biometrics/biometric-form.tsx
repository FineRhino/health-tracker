"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { createBiometricEntry, type BiometricFormValues } from "./actions";
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

const numericFields: { name: keyof BiometricFormValues; label: string; unit?: string }[] = [
  { name: "weightLbs", label: "Weight", unit: "lbs" },
  { name: "bmi", label: "BMI" },
  { name: "bodyFatPercent", label: "Body fat", unit: "%" },
  { name: "bodyFatMassLbs", label: "Body fat mass", unit: "lbs" },
  { name: "leanMassLbs", label: "Lean mass", unit: "lbs" },
  { name: "leanMassPercent", label: "Lean mass", unit: "%" },
  { name: "subcutaneousFatMassLbs", label: "Subcutaneous fat mass", unit: "lbs" },
  { name: "subcutaneousFatPercent", label: "Subcutaneous fat", unit: "%" },
  { name: "visceralFatIndex", label: "Visceral fat index" },
  { name: "skeletalMuscleMassLbs", label: "Skeletal muscle mass", unit: "lbs" },
  { name: "skeletalMassLbs", label: "Skeletal mass", unit: "lbs" },
  { name: "boneMineralContentLbs", label: "Bone mineral content", unit: "lbs" },
  { name: "bodyWaterPercent", label: "Body water", unit: "%" },
  { name: "extracellularWaterLbs", label: "Extracellular water", unit: "lbs" },
  { name: "intracellularWaterLbs", label: "Intracellular water", unit: "lbs" },
  { name: "mineralMassLbs", label: "Mineral mass", unit: "lbs" },
  { name: "basalMetabolicRate", label: "BMR", unit: "kcal" },
  { name: "metabolicAge", label: "Metabolic age", unit: "yrs" },
  { name: "bodyCellMassLbs", label: "Body cell mass", unit: "lbs" },
];

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
                  <Field key={f.name}>
                    <FieldLabel htmlFor={f.name}>
                      {f.label}
                      {f.unit && <span className="text-muted-foreground"> ({f.unit})</span>}
                    </FieldLabel>
                    <Input
                      id={f.name}
                      type="number"
                      step="any"
                      inputMode="decimal"
                      {...register(f.name)}
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
