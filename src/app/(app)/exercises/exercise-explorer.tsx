"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  EXERCISES,
  averageCalories,
  getUniqueEquipment,
  getUniqueMuscles,
  type Exercise,
  type ExerciseCategory,
  type Difficulty,
} from "@/lib/exercises";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CATEGORIES: ExerciseCategory[] = ["Strength", "Cardio", "Core", "Conditioning"];
const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

const SORT_OPTIONS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "hypertrophy", label: "Muscle growth / size" },
  { value: "strength", label: "Strength effect" },
  { value: "conditioning", label: "Fitness / conditioning effect" },
  { value: "calories", label: "Avg. calories per set" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

const categoryStyles: Record<ExerciseCategory, string> = {
  Strength: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-400",
  Cardio: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-400",
  Core: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  Conditioning: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400",
};

function ScoreMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-1.5 rounded-full bg-primary"
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="w-5 shrink-0 text-right text-xs font-medium tabular-nums">{value}</span>
    </div>
  );
}

export function ExerciseExplorer() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [equipment, setEquipment] = useState<string>("All");
  const [muscle, setMuscle] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [selected, setSelected] = useState<Exercise | null>(null);

  const equipmentOptions = useMemo(getUniqueEquipment, []);
  const muscleOptions = useMemo(getUniqueMuscles, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = EXERCISES.filter((ex) => {
      if (q && !ex.name.toLowerCase().includes(q)) return false;
      if (category !== "All" && ex.category !== category) return false;
      if (equipment !== "All" && ex.equipment !== equipment) return false;
      if (difficulty !== "All" && ex.difficulty !== difficulty) return false;
      if (
        muscle !== "All" &&
        !ex.primaryMuscles.includes(muscle) &&
        !ex.secondaryMuscles.includes(muscle)
      )
        return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "hypertrophy":
          return b.scores.hypertrophy - a.scores.hypertrophy;
        case "strength":
          return b.scores.strength - a.scores.strength;
        case "conditioning":
          return b.scores.conditioning - a.scores.conditioning;
        case "calories":
          return averageCalories(b) - averageCalories(a);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [search, category, equipment, muscle, difficulty, sortBy]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 py-4">
          <div className="flex min-w-48 flex-1 flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="ex-search">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="ex-search"
                placeholder="e.g. squat, curl, swing"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Category</span>
            <Select value={category} onValueChange={(v) => setCategory(v ?? "All")}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Equipment</span>
            <Select value={equipment} onValueChange={(v) => setEquipment(v ?? "All")}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All equipment</SelectItem>
                {equipmentOptions.map((eq) => (
                  <SelectItem key={eq} value={eq}>
                    {eq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Muscle</span>
            <Select value={muscle} onValueChange={(v) => setMuscle(v ?? "All")}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All muscles</SelectItem>
                {muscleOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Difficulty</span>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v ?? "All")}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All levels</SelectItem>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Sort by</span>
            <Select value={sortBy} onValueChange={(v) => setSortBy((v ?? "name") as SortKey)}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {filtered.length} of {EXERCISES.length} exercises
      </p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No exercises match those filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <Card
              key={ex.slug}
              className="h-full cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => setSelected(ex)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{ex.name}</CardTitle>
                  <Badge variant="secondary" className={categoryStyles[ex.category]}>
                    {ex.category}
                  </Badge>
                </div>
                <CardDescription>
                  {ex.equipment} · {ex.movementType} · {ex.difficulty}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-1">
                  {ex.primaryMuscles.map((m) => (
                    <Badge key={m} variant="outline">
                      {m}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <ScoreMeter label="Growth" value={ex.scores.hypertrophy} />
                  <ScoreMeter label="Strength" value={ex.scores.strength} />
                  <ScoreMeter label="Fitness" value={ex.scores.conditioning} />
                </div>
                <span className="text-xs text-muted-foreground">
                  ~{averageCalories(ex).toFixed(0)} kcal / set (avg. across variations)
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selected.name}</DialogTitle>
                  <Badge variant="secondary" className={categoryStyles[selected.category]}>
                    {selected.category}
                  </Badge>
                </div>
                <DialogDescription>
                  {selected.equipment} · {selected.movementType} · {selected.difficulty}
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm text-foreground/90">{selected.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Primary muscles</span>
                  <div className="flex flex-wrap gap-1">
                    {selected.primaryMuscles.map((m) => (
                      <Badge key={m} variant="outline">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selected.secondaryMuscles.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Secondary muscles</span>
                    <div className="flex flex-wrap gap-1">
                      {selected.secondaryMuscles.map((m) => (
                        <Badge key={m} variant="outline">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg border p-3">
                <span className="text-xs font-medium text-muted-foreground">
                  Overall effect (out of 10)
                </span>
                <ScoreMeter label="Growth" value={selected.scores.hypertrophy} />
                <ScoreMeter label="Strength" value={selected.scores.strength} />
                <ScoreMeter label="Fitness" value={selected.scores.conditioning} />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Calorie burn by variation (illustrative)
                </span>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variation</TableHead>
                      <TableHead>Sets</TableHead>
                      <TableHead>Reps</TableHead>
                      <TableHead>Load</TableHead>
                      <TableHead>Kcal/set</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.variations.map((v) => (
                      <TableRow key={v.label}>
                        <TableCell className="whitespace-normal font-medium">{v.label}</TableCell>
                        <TableCell>{v.sets}</TableCell>
                        <TableCell className="whitespace-normal">{v.reps}</TableCell>
                        <TableCell className="whitespace-normal">{v.load}</TableCell>
                        <TableCell>{v.caloriesPerSet}</TableCell>
                        <TableCell>~{v.sets * v.caloriesPerSet}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <span className="text-xs text-muted-foreground">
                  Estimates only — actual burn depends on body weight, tempo, and rest periods.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Coaching cues</span>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground/90">
                  {selected.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
