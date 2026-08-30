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

  await prisma.biometricEntry.create({
    data: {
      userId,
      recordedAt: new Date(recordedAt),
      metabolicAge: metabolicAge !== null ? Math.round(metabolicAge) : null,
      ...rest,
    },
  });

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
