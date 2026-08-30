import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiometricForm } from "./biometric-form";
import { BiometricsTable } from "./biometrics-table";
import { ImportDialog } from "./import-dialog";

export default async function BiometricsPage() {
  const userId = await requireUserId();

  const entries = await prisma.biometricEntry.findMany({
    where: { userId },
    orderBy: { recordedAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Biometrics</h1>
          <p className="text-sm text-muted-foreground">
            Track weight, body composition, and related measurements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ImportDialog />
          <BiometricForm />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No entries yet. Log your first reading above.
            </p>
          ) : (
            <BiometricsTable entries={entries} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
