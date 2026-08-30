import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password | Health Tracker",
};

export default async function ResetPasswordPage(
  props: PageProps<"/reset-password/[token]">
) {
  const { token } = await props.params;
  return <ResetPasswordForm token={token} />;
}
