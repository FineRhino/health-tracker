"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/password-reset-tokens";

const EmailSchema = z.email({ error: "Please enter a valid email." }).trim();

export type RequestResetState =
  | { error?: string; message?: string; resetUrl?: string }
  | undefined;

export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const parsed = EmailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please enter a valid email." };
  }
  const email = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Only accounts using a password (not Google-only accounts) can reset one this way.
  if (!user || !user.passwordHash) {
    return {
      message:
        "If an account with a password exists for that email, a reset link has been created.",
    };
  }

  const { token, tokenHash } = generateResetToken();

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    }),
  ]);

  // TODO: email delivery isn't configured yet, so the link is surfaced directly
  // in the UI instead of being sent. Once an email provider is wired up, stop
  // returning `resetUrl` here and send the link instead.
  return {
    message: "Reset link created.",
    resetUrl: `/reset-password/${token}`,
  };
}
