"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { parseBiometricsFile, type BiometricValues } from "@/lib/biometrics-import";

const numeric = () =>
  z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : null;
    });

const BiometricSchema = z.object({
  recordedAt: z.string().min(1, { error: "Date is required." }),
  weightLbs: numeric(),
  bmi: numeric(),
  bodyFatPercent: numeric(),
  bodyFatMassLbs: numeric(),
  leanMassLbs: numeric(),
  leanMassPercent: numeric(),
  subcutaneousFatMassLbs: numeric(),
  subcutaneousFatPercent: numeric(),
  visceralFatIndex: numeric(),
  skeletalMuscleMassLbs: numeric(),
  skeletalMassLbs: numeric(),
  boneMineralContentLbs: numeric(),
  bodyWaterPercent: numeric(),
  extracellularWaterLbs: numeric(),
  intracellularWaterLbs: numeric(),
  mineralMassLbs: numeric(),
  basalMetabolicRate: numeric(),
  metabolicAge: numeric(),
  bodyCellMassLbs: numeric(),
  notes: z.string().optional(),
});

export type BiometricFormValues = z.input<typeof BiometricSchema>;

export async function createBiometricEntry(values: BiometricFormValues) {
  const userId = await requireUserId();
  const parsed = BiometricSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { recordedAt, metabolicAge, ...rest } = parsed.data;

  try {
    await prisma.biometricEntry.create({
      data: {
        userId,
        recordedAt: new Date(recordedAt),
        metabolicAge: metabolicAge !== null ? Math.round(metabolicAge) : null,
        ...rest,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "You already have an entry logged at this exact date and time." };
    }
    throw error;
  }

  revalidatePath("/biometrics");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteBiometricEntry(id: string) {
  const userId = await requireUserId();
  await prisma.biometricEntry.deleteMany({ where: { id, userId } });
  revalidatePath("/biometrics");
  revalidatePath("/dashboard");
}

const MAX_IMPORT_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type ImportBiometricsResult =
  | { error: string }
  | { success: true; created: number; updated: number; skipped: number; sheetName: string };

export async function importBiometricsFile(
  _prevState: ImportBiometricsResult | undefined,
  formData: FormData
): Promise<ImportBiometricsResult> {
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
    parsed = await parseBiometricsFile(buffer, file.name);
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
    const data: BiometricValues & { userId: string; recordedAt: Date } = {
      userId,
      recordedAt: row.recordedAt,
      ...row.values,
    };

    const result = await prisma.biometricEntry.upsert({
      where: { userId_recordedAt: { userId, recordedAt: row.recordedAt } },
      create: data,
      update: data,
    });

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
  }

  revalidatePath("/biometrics");
  revalidatePath("/dashboard");

  return { success: true, created, updated, skipped: parsed.skipped, sheetName: parsed.sheetName };
}
