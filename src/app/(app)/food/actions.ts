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

const FoodSchema = z.object({
  date: z.string().min(1, { error: "Date is required." }),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  name: z.string().trim().min(1, { error: "Name is required." }),
  calories: numeric(),
  proteinG: numeric(),
  carbsG: numeric(),
  fatG: numeric(),
  notes: z.string().optional(),
});

export type FoodFormValues = z.input<typeof FoodSchema>;

export async function createFoodEntry(values: FoodFormValues) {
  const userId = await requireUserId();
  const parsed = FoodSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { date, calories, ...rest } = parsed.data;

  await prisma.foodEntry.create({
    data: {
      userId,
      date: new Date(date),
      calories: calories !== null ? Math.round(calories) : null,
      ...rest,
    },
  });

  revalidatePath("/food");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteFoodEntry(id: string) {
  const userId = await requireUserId();
  await prisma.foodEntry.deleteMany({ where: { id, userId } });
  revalidatePath("/food");
  revalidatePath("/dashboard");
}
