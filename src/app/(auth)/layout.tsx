import { Activity } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Activity className="size-4" />
          </div>
          <span className="font-heading text-lg font-semibold">Health Tracker</span>
        </div>
        {children}
      </div>
    </div>
  );
}
