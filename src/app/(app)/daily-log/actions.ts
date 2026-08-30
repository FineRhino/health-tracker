"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { parseDailyLogFile, type DailyLogValues } from "@/lib/daily-log-import";

const numeric = () =>
  z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : null;
    });

const DailyLogSchema = z.object({
  date: z.string().min(1, { error: "Date is required." }),
  calories: numeric(),
  fatG: numeric(),
  saturatedFatG: numeric(),
  carbsG: numeric(),
  proteinG: numeric(),
  fiberG: numeric(),
  alcoholG: numeric(),
  fastingHours: numeric(),
  bloatRating: numeric(),
  energyRating: numeric(),
  notes: z.string().optional(),
});

export type DailyLogFormValues = z.input<typeof DailyLogSchema>;

export async function createDailyLogEntry(values: DailyLogFormValues) {
  const userId = await requireUserId();
  const parsed = DailyLogSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { date, bloatRating, energyRating, ...rest } = parsed.data;

  try {
    await prisma.dailyLog.create({
      data: {
        userId,
        date: new Date(date),
        bloatRating: bloatRating !== null ? Math.round(bloatRating) : null,
        energyRating: energyRating !== null ? Math.round(energyRating) : null,
        ...rest,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "You already have an entry logged for this date." };
    }
    throw error;
  }

  revalidatePath("/daily-log");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteDailyLogEntry(id: string) {
  const userId = await requireUserId();
  await prisma.dailyLog.deleteMany({ where: { id, userId } });
  revalidatePath("/daily-log");
  revalidatePath("/dashboard");
}

const MAX_IMPORT_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type ImportDailyLogResult =
  | { error: string }
  | { success: true; created: number; updated: number; skipped: number; sheetName: string };

export async function importDailyLogFile(
  _prevState: ImportDailyLogResult | undefined,
  formData: FormData
): Promise<ImportDailyLogResult> {
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
    parsed = await parseDailyLogFile(buffer, file.name);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not read the file." };
  }

  if (parsed.rows.length === 0) {
    return {
      error: `No data rows found on sheet "${parsed.sheetName}". Make sure it has a "Date" column with values.`,
    };
  }

  let created = 0;
  let updated = 0;

  for (const row of parsed.rows) {
    const data: DailyLogValues & { userId: string; date: Date } = {
      userId,
      date: row.date,
      ...row.values,
    };

    const result = await prisma.dailyLog.upsert({
      where: { userId_date: { userId, date: row.date } },
      create: data,
      update: data,
    });

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
  }

  revalidatePath("/daily-log");
  revalidatePath("/dashboard");

  return { success: true, created, updated, skipped: parsed.skipped, sheetName: parsed.sheetName };
}
