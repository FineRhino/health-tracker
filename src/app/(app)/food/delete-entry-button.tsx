"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteFoodEntry } from "./actions";

export function DeleteEntryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      onClick={() => startTransition(() => deleteFoodEntry(id))}
    >
      <Trash2 />
      <span className="sr-only">Delete entry</span>
    </Button>
  );
}
