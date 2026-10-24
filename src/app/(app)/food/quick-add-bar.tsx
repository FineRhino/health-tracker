"use client";

import { useState, useTransition } from "react";
import { Plus, Zap } from "lucide-react";
import { quickAddFoodEntry, type FoodHistorySuggestion } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function QuickAddBar({ foods }: { foods: FoodHistorySuggestion[] }) {
  const [pending, startTransition] = useTransition();
  const [addingName, setAddingName] = useState<string | null>(null);

  if (foods.length === 0) return null;

  function handleAdd(name: string) {
    setAddingName(name);
    startTransition(async () => {
      await quickAddFoodEntry(name);
      setAddingName(null);
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-2 py-3">
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Zap className="size-3.5" /> Quick add
        </span>
        {foods.map((food) => (
          <Button
            key={food.name}
            type="button"
            variant="outline"
            size="sm"
            disabled={pending && addingName === food.name}
            onClick={() => handleAdd(food.name)}
          >
            <Plus /> {food.name}
            {food.calories !== null && (
              <span className="text-muted-foreground">({food.calories} cal)</span>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
