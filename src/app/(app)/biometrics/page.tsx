import { format } from "date-fns";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BiometricForm } from "./biometric-form";
import { DeleteEntryButton } from "./delete-entry-button";
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>BMI</TableHead>
                  <TableHead>Body fat %</TableHead>
                  <TableHead>Lean mass</TableHead>
                  <TableHead>Body water %</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(entry.recordedAt, "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell>{entry.weightLbs?.toFixed(1) ?? "—"}</TableCell>
                    <TableCell>{entry.bmi?.toFixed(1) ?? "—"}</TableCell>
                    <TableCell>{entry.bodyFatPercent?.toFixed(1) ?? "—"}</TableCell>
                    <TableCell>{entry.leanMassLbs?.toFixed(1) ?? "—"}</TableCell>
                    <TableCell>{entry.bodyWaterPercent?.toFixed(1) ?? "—"}</TableCell>
                    <TableCell>
                      <DeleteEntryButton id={entry.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
