"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import {
  createFoodEntry,
  searchFoodHistory,
  type FoodFormValues,
  type FoodHistorySuggestion,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
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
  saturatedFatG: "",
  fiberG: "",
  alcoholG: "",
  notes: "",
};

export function FoodForm() {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<FoodHistorySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FoodFormValues>({ defaultValues });

  async function onSubmit(values: FoodFormValues) {
    const result = await createFoodEntry(values);
    if (result?.success) {
      reset(defaultValues);
      setOpen(false);
    }
  }

  function handleNameChange(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = await searchFoodHistory(query);
      setSuggestions(results);
    }, 250);
  }

  function applySuggestion(s: FoodHistorySuggestion) {
    setValue("name", s.name);
    setValue("calories", s.calories ?? "");
    setValue("proteinG", s.proteinG ?? "");
    setValue("carbsG", s.carbsG ?? "");
    setValue("fatG", s.fatG ?? "");
    setValue("saturatedFatG", s.saturatedFatG ?? "");
    setValue("fiberG", s.fiberG ?? "");
    setValue("alcoholG", s.alcoholG ?? "");
    setSuggestions([]);
    setShowSuggestions(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }}
    >
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
              <div className="relative">
                <Input
                  id="name"
                  placeholder="e.g. Grilled chicken salad"
                  autoComplete="off"
                  {...register("name", {
                    required: true,
                    onChange: (e) => {
                      handleNameChange(e.target.value);
                      setShowSuggestions(true);
                    },
                  })}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-md">
                    {suggestions.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applySuggestion(s)}
                        className="flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {s.calories ?? "—"} cal &middot; {s.proteinG ?? "—"}g protein &middot;{" "}
                          {s.carbsG ?? "—"}g carbs &middot; {s.fatG ?? "—"}g fat
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <FieldDescription>Start typing to reuse a previously logged item.</FieldDescription>
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

            <div className="grid grid-cols-3 gap-3">
              <Field>
                <FieldLabel htmlFor="saturatedFatG">Sat. fat (g)</FieldLabel>
                <Input id="saturatedFatG" type="number" step="any" {...register("saturatedFatG")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="fiberG">Fiber (g)</FieldLabel>
                <Input id="fiberG" type="number" step="any" {...register("fiberG")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="alcoholG">Alcohol (g)</FieldLabel>
                <Input id="alcoholG" type="number" step="any" {...register("alcoholG")} />
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
