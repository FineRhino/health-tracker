import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TargetsForm } from "./targets-form";
import type { TargetFormValues } from "./actions";

export default async function AdminPage() {
  const userId = await requireUserId();

  const target = await prisma.nutritionTarget.findUnique({ where: { userId } });

  const defaultValues: TargetFormValues = {
    caloriesMax: target?.caloriesMax ?? "",
    fatMaxG: target?.fatMaxG ?? "",
    saturatedFatMaxG: target?.saturatedFatMaxG ?? "",
    carbsMaxG: target?.carbsMaxG ?? "",
    proteinMinG: target?.proteinMinG ?? "",
    fiberMinG: target?.fiberMinG ?? "",
    alcoholMaxG: target?.alcoholMaxG ?? "",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-muted-foreground">Manage app-wide settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nutrition targets</CardTitle>
          <CardDescription>
            Used to flag days and macros on the Daily Log and Food pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TargetsForm defaultValues={defaultValues} />
        </CardContent>
      </Card>
    </div>
  );
}
