"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MealType } from "@/generated/prisma/client";
import { parseFoodFile, type FoodValues } from "@/lib/food-import";
import { lookupBarcode, type BarcodeLookupResult } from "@/lib/barcode-lookup";

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
  saturatedFatG: numeric(),
  fiberG: numeric(),
  alcoholG: numeric(),
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

function mealTypeForNow(): MealType {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return "BREAKFAST";
  if (hour >= 11 && hour < 16) return "LUNCH";
  if (hour >= 16 && hour < 22) return "DINNER";
  return "SNACK";
}

export interface FoodHistorySuggestion {
  name: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  saturatedFatG: number | null;
  fiberG: number | null;
  alcoholG: number | null;
}

function toSuggestion(entry: {
  name: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  saturatedFatG: number | null;
  fiberG: number | null;
  alcoholG: number | null;
}): FoodHistorySuggestion {
  const { name, calories, proteinG, carbsG, fatG, saturatedFatG, fiberG, alcoholG } = entry;
  return { name, calories, proteinG, carbsG, fatG, saturatedFatG, fiberG, alcoholG };
}

export async function searchFoodHistory(query: string): Promise<FoodHistorySuggestion[]> {
  const userId = await requireUserId();
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const entries = await prisma.foodEntry.findMany({
    where: { userId, name: { contains: trimmed, mode: "insensitive" } },
    orderBy: { date: "desc" },
    distinct: ["name"],
    take: 8,
  });

  return entries.map(toSuggestion);
}

export async function getFrequentFoods(limit = 8): Promise<FoodHistorySuggestion[]> {
  const userId = await requireUserId();

  const grouped = await prisma.foodEntry.groupBy({
    by: ["name"],
    where: { userId },
    _count: { name: true },
    orderBy: { _count: { name: "desc" } },
    take: limit,
  });

  const suggestions: FoodHistorySuggestion[] = [];
  for (const g of grouped) {
    const latest = await prisma.foodEntry.findFirst({
      where: { userId, name: g.name },
      orderBy: { date: "desc" },
    });
    if (latest) suggestions.push(toSuggestion(latest));
  }
  return suggestions;
}

export async function quickAddFoodEntry(name: string) {
  const userId = await requireUserId();

  const latest = await prisma.foodEntry.findFirst({
    where: { userId, name },
    orderBy: { date: "desc" },
  });
  if (!latest) {
    return { error: "Couldn't find that food in your history." };
  }

  await prisma.foodEntry.create({
    data: {
      userId,
      date: new Date(),
      mealType: mealTypeForNow(),
      name: latest.name,
      calories: latest.calories,
      proteinG: latest.proteinG,
      carbsG: latest.carbsG,
      fatG: latest.fatG,
      saturatedFatG: latest.saturatedFatG,
      fiberG: latest.fiberG,
      alcoholG: latest.alcoholG,
    },
  });

  revalidatePath("/food");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function lookupFoodBarcode(barcode: string): Promise<
  { error: string } | { success: true; result: BarcodeLookupResult }
> {
  await requireUserId();
  const trimmed = barcode.trim();
  if (!trimmed) {
    return { error: "Enter a barcode number." };
  }

  try {
    const result = await lookupBarcode(trimmed);
    return { success: true, result };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Lookup failed." };
  }
}

const MAX_IMPORT_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type ImportFoodResult =
  | { error: string }
  | { success: true; created: number; skipped: number; sheetName: string };

export async function importFoodFile(
  _prevState: ImportFoodResult | undefined,
  formData: FormData
): Promise<ImportFoodResult> {
  const userId = await requireUserId();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a file to import." };
  }

  const filename = file.name.toLowerCase();
  if (!filename.endsWith(".xlsx") && !filename.endsWith(".csv")) {
    return { error: "Please upload a .xlsx or .csv file." };
  }

  if (file.size > MAX_IMPORT_FILE_SIZE) {
    return { error: "File is too large (10MB max)." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let parsed;
  try {
    parsed = await parseFoodFile(buffer, file.name);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not read the file." };
  }

  if (parsed.rows.length === 0) {
    return {
      error: `No data rows found on sheet "${parsed.sheetName}". Make sure it has "Date" and "Description" columns with values.`,
    };
  }

  const data = parsed.rows.map((row) => {
    const values: FoodValues & { userId: string; date: Date; mealType: MealType; name: string } = {
      userId,
      date: row.date,
      mealType: row.mealType as MealType,
      name: row.name,
      ...row.values,
    };
    return values;
  });

  await prisma.foodEntry.createMany({ data });

  revalidatePath("/food");
  revalidatePath("/dashboard");

  return {
    success: true,
    created: data.length,
    skipped: parsed.skipped,
    sheetName: parsed.sheetName,
  };
}
