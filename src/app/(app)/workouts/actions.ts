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

const WorkoutSchema = z.object({
  date: z.string().min(1, { error: "Date is required." }),
  type: z.enum(["STRENGTH", "CARDIO", "OTHER"]),
  name: z.string().trim().min(1, { error: "Name is required." }),
  durationMinutes: numeric(),
  caloriesBurned: numeric(),
  distanceMiles: numeric(),
  notes: z.string().optional(),
  exercises: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        sets: numeric(),
        reps: numeric(),
        weightLbs: numeric(),
        notes: z.string().optional(),
      })
    )
    .optional(),
});

export type WorkoutFormValues = z.input<typeof WorkoutSchema>;

export async function createWorkout(values: WorkoutFormValues) {
  const userId = await requireUserId();
  const parsed = WorkoutSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { date, exercises, ...rest } = parsed.data;

  await prisma.workout.create({
    data: {
      userId,
      date: new Date(date),
      ...rest,
      exercises: {
        create: (exercises ?? [])
          .filter((e) => e.name.trim().length > 0)
          .map((e, i) => ({
            name: e.name,
            sets: e.sets !== null ? Math.round(e.sets) : null,
            reps: e.reps !== null ? Math.round(e.reps) : null,
            weightLbs: e.weightLbs,
            notes: e.notes,
            order: i,
          })),
      },
    },
  });

  revalidatePath("/workouts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteWorkout(id: string) {
  const userId = await requireUserId();
  await prisma.workout.deleteMany({ where: { id, userId } });
  revalidatePath("/workouts");
  revalidatePath("/dashboard");
}
