import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password | Health Tracker",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
