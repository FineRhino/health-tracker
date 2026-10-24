import { ExerciseExplorer } from "./exercise-explorer";

export default function ExercisesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Exercises</h1>
        <p className="text-sm text-muted-foreground">
          A filterable library of exercises — muscles worked, estimated calorie burn by
          rep/set/weight variation, and scores for muscle growth, strength, and overall fitness
          effect — for building out a routine.
        </p>
      </div>
      <ExerciseExplorer />
    </div>
  );
}
