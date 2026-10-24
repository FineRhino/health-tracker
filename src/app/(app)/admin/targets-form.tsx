"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import { saveNutritionTargets, type TargetFormValues } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { TARGET_METRICS } from "@/lib/nutrition-targets";

export function TargetsForm({ defaultValues }: { defaultValues: TargetFormValues }) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<TargetFormValues>({ defaultValues });

  async function onSubmit(values: TargetFormValues) {
    const result = await saveNutritionTargets(values);
    if (result?.success) {
      reset(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TARGET_METRICS.map((metric) => (
            <Field key={metric.targetField}>
              <FieldLabel htmlFor={metric.targetField}>
                {metric.direction === "max" ? "Max" : "Min"} {metric.label.toLowerCase()}
                {metric.unit ? ` (${metric.unit})` : ""}
              </FieldLabel>
              <Input
                id={metric.targetField}
                type="number"
                step="any"
                placeholder="No target set"
                {...register(metric.targetField)}
              />
            </Field>
          ))}
        </div>
        <FieldDescription>
          Leave a field blank to stop flagging that macro on the Daily Log and Food pages. A
          day is flagged whenever it goes over a max or under a min.
        </FieldDescription>
      </FieldGroup>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Saving..." : "Save targets"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Check className="size-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
