"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>Enter your email to get a reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </Field>
            {state?.error && <FieldError>{state.error}</FieldError>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Sending..." : "Send reset link"}
            </Button>
          </FieldGroup>
        </form>

        {state?.message && (
          <div className="mt-4 rounded-lg border border-dashed p-3 text-sm">
            <p className="text-muted-foreground">{state.message}</p>
            {state.resetUrl && (
              <>
                <p className="mt-2 text-xs text-muted-foreground">
                  Email delivery isn&apos;t configured yet, so here&apos;s your link directly
                  (expires in 1 hour):
                </p>
                <Link href={state.resetUrl} className="mt-1 block break-all font-medium text-primary underline-offset-4 hover:underline">
                  {state.resetUrl}
                </Link>
              </>
            )}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
