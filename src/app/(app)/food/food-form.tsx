"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { createFoodEntry, type FoodFormValues } from "./actions";
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

const defaultValues: FoodFormValues = {
  date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  mealType: "BREAKFAST",
  name: "",
  calories: "",
  proteinG: "",
  carbsG: "",
  fatG: "",
  notes: "",
};

export function FoodForm() {
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FoodFormValues>({ defaultValues });

  async function onSubmit(values: FoodFormValues) {
    const result = await createFoodEntry(values);
    if (result?.success) {
      reset(defaultValues);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus /> Log food
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log food entry</DialogTitle>
          <DialogDescription>Record a meal or snack.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="date">Date &amp; time</FieldLabel>
                <Input id="date" type="datetime-local" {...register("date", { required: true })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="mealType">Meal</FieldLabel>
                <Controller
                  control={control}
                  name="mealType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="mealType" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                        <SelectItem value="LUNCH">Lunch</SelectItem>
                        <SelectItem value="DINNER">Dinner</SelectItem>
                        <SelectItem value="SNACK">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="name">Food</FieldLabel>
              <Input id="name" placeholder="e.g. Grilled chicken salad" {...register("name", { required: true })} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <div className="grid grid-cols-4 gap-3">
              <Field>
                <FieldLabel htmlFor="calories">Calories</FieldLabel>
                <Input id="calories" type="number" step="any" {...register("calories")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="proteinG">Protein (g)</FieldLabel>
                <Input id="proteinG" type="number" step="any" {...register("proteinG")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="carbsG">Carbs (g)</FieldLabel>
                <Input id="carbsG" type="number" step="any" {...register("carbsG")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="fatG">Fat (g)</FieldLabel>
                <Input id="fatG" type="number" step="any" {...register("fatG")} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea id="notes" rows={2} {...register("notes")} />
            </Field>
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
