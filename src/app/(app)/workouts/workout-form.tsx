"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { createWorkout, type WorkoutFormValues } from "./actions";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const defaultValues: WorkoutFormValues = {
  date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  type: "STRENGTH",
  name: "",
  durationMinutes: "",
  caloriesBurned: "",
  distanceMiles: "",
  notes: "",
  exercises: [],
};

export function WorkoutForm() {
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<WorkoutFormValues>({ defaultValues });

  const { fields, append, remove } = useFieldArray({ control, name: "exercises" });
  const type = useWatch({ control, name: "type" });

  async function onSubmit(values: WorkoutFormValues) {
    const result = await createWorkout(values);
    if (result?.success) {
      reset(defaultValues);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus /> Log workout
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log workout</DialogTitle>
          <DialogDescription>Record a workout session and its details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="date">Date &amp; time</FieldLabel>
                <Input id="date" type="datetime-local" {...register("date", { required: true })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="type" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STRENGTH">Strength</SelectItem>
                        <SelectItem value="CARDIO">Cardio</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g. Upper body, 5k run"
                {...register("name", { required: true })}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field>
                <FieldLabel htmlFor="durationMinutes">Duration (min)</FieldLabel>
                <Input id="durationMinutes" type="number" step="any" {...register("durationMinutes")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="caloriesBurned">Calories</FieldLabel>
                <Input id="caloriesBurned" type="number" step="any" {...register("caloriesBurned")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="distanceMiles">Distance (mi)</FieldLabel>
                <Input id="distanceMiles" type="number" step="any" {...register("distanceMiles")} />
              </Field>
            </div>

            {type === "STRENGTH" && (
              <FieldSet>
                <FieldLegend variant="label">Exercises</FieldLegend>
                <div className="flex flex-col gap-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_4rem_4rem_5rem_auto] items-end gap-2">
                      <Field>
                        {index === 0 && <FieldLabel>Exercise</FieldLabel>}
                        <Input placeholder="Bench press" {...register(`exercises.${index}.name`)} />
                      </Field>
                      <Field>
                        {index === 0 && <FieldLabel>Sets</FieldLabel>}
                        <Input type="number" {...register(`exercises.${index}.sets`)} />
                      </Field>
                      <Field>
                        {index === 0 && <FieldLabel>Reps</FieldLabel>}
                        <Input type="number" {...register(`exercises.${index}.reps`)} />
                      </Field>
                      <Field>
                        {index === 0 && <FieldLabel>Weight</FieldLabel>}
                        <Input type="number" step="any" {...register(`exercises.${index}.weightLbs`)} />
                      </Field>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() => append({ name: "", sets: "", reps: "", weightLbs: "", notes: "" })}
                  >
                    <Plus /> Add exercise
                  </Button>
                </div>
              </FieldSet>
            )}

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea id="notes" rows={2} {...register("notes")} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save workout"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
