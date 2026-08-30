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
import { Badge } from "@/components/ui/badge";
import { WorkoutForm } from "./workout-form";
import { DeleteEntryButton } from "./delete-entry-button";

const typeLabels: Record<string, string> = {
  STRENGTH: "Strength",
  CARDIO: "Cardio",
  OTHER: "Other",
};

export default async function WorkoutsPage() {
  const userId = await requireUserId();

  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 100,
    include: { exercises: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Workouts</h1>
          <p className="text-sm text-muted-foreground">Log strength, cardio, and other sessions.</p>
        </div>
        <WorkoutForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No workouts yet. Log your first session above.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell>{format(workout.date, "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{typeLabels[workout.type]}</Badge>
                    </TableCell>
                    <TableCell>{workout.name}</TableCell>
                    <TableCell>
                      {workout.durationMinutes ? `${workout.durationMinutes} min` : "—"}
                    </TableCell>
                    <TableCell>{workout.caloriesBurned ?? "—"}</TableCell>
                    <TableCell>
                      {workout.exercises.length > 0
                        ? workout.exercises.map((e) => e.name).join(", ")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <DeleteEntryButton id={workout.id} />
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
