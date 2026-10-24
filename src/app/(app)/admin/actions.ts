"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const numeric = () =>
  z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : null;
    });

const TargetSchema = z.object({
  caloriesMax: numeric(),
  fatMaxG: numeric(),
  saturatedFatMaxG: numeric(),
  carbsMaxG: numeric(),
  proteinMinG: numeric(),
  fiberMinG: numeric(),
  alcoholMaxG: numeric(),
});

export type TargetFormValues = z.input<typeof TargetSchema>;

export async function saveNutritionTargets(values: TargetFormValues) {
  const userId = await requireUserId();
  const parsed = TargetSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.nutritionTarget.upsert({
    where: { userId },
    create: { userId, ...parsed.data },
    update: parsed.data,
  });

  revalidatePath("/admin");
  revalidatePath("/daily-log");
  revalidatePath("/food");
  return { success: true };
}
