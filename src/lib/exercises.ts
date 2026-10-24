export type ExerciseCategory = "Strength" | "Cardio" | "Core" | "Conditioning";
export type MovementType = "Compound" | "Isolation";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ExerciseVariation {
  label: string;
  sets: number;
  reps: string;
  load: string;
  /** Illustrative estimate, kcal for one set/interval at this variation. */
  caloriesPerSet: number;
}

export interface ExerciseScores {
  /** Effect on muscle growth / size. */
  hypertrophy: number;
  /** Effect on maximal strength and power. */
  strength: number;
  /** Cardiovascular / overall fitness effect. */
  conditioning: number;
}

export interface Exercise {
  slug: string;
  name: string;
  category: ExerciseCategory;
  movementType: MovementType;
  equipment: string;
  difficulty: Difficulty;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  description: string;
  tips: string[];
  variations: ExerciseVariation[];
  scores: ExerciseScores;
}

export const EXERCISES: Exercise[] = [
  {
    slug: "barbell-back-squat",
    name: "Barbell Back Squat",
    category: "Strength",
    movementType: "Compound",
    equipment: "Barbell + rack",
    difficulty: "Intermediate",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core", "Erectors"],
    description:
      "The foundational lower-body lift: a barbell racked across the upper back, squatting to at least parallel and driving back up. One of the most effective exercises for total leg size and strength.",
    tips: [
      "Brace your core before descending",
      "Keep the bar over mid-foot throughout",
      "Drive through the whole foot, not just the heels",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "40-50% 1RM", caloriesPerSet: 9 },
      { label: "Moderate", sets: 4, reps: "8-10", load: "65-75% 1RM", caloriesPerSet: 11 },
      { label: "Heavy (low-rep)", sets: 5, reps: "3-5", load: "85-90% 1RM", caloriesPerSet: 8 },
    ],
    scores: { hypertrophy: 9, strength: 10, conditioning: 5 },
  },
  {
    slug: "conventional-deadlift",
    name: "Conventional Deadlift",
    category: "Strength",
    movementType: "Compound",
    equipment: "Barbell",
    difficulty: "Advanced",
    primaryMuscles: ["Glutes", "Hamstrings", "Erectors"],
    secondaryMuscles: ["Lats", "Traps", "Forearms"],
    description:
      "A hip-hinge pull from the floor to lockout. Arguably the single best exercise for total posterior-chain strength, and heavily taxes grip and core stability.",
    tips: [
      "Set your hips before the bar leaves the floor — don't let hips shoot up first",
      "Keep the bar dragging close to your shins",
      "Reset your brace between reps on heavy sets",
    ],
    variations: [
      { label: "Light technique work", sets: 3, reps: "8-10", load: "50-60% 1RM", caloriesPerSet: 10 },
      { label: "Moderate", sets: 4, reps: "5-6", load: "75-80% 1RM", caloriesPerSet: 12 },
      { label: "Heavy", sets: 5, reps: "1-3", load: "88-95% 1RM", caloriesPerSet: 9 },
    ],
    scores: { hypertrophy: 8, strength: 10, conditioning: 6 },
  },
  {
    slug: "barbell-bench-press",
    name: "Barbell Bench Press",
    category: "Strength",
    movementType: "Compound",
    equipment: "Barbell + bench",
    difficulty: "Intermediate",
    primaryMuscles: ["Chest"],
    secondaryMuscles: ["Triceps", "Front Delts"],
    description:
      "The standard horizontal press: lower the bar to the chest and press to lockout. The primary mass-and-strength builder for the chest.",
    tips: [
      "Keep shoulder blades retracted and down throughout",
      "Touch the bar to the same spot on your chest each rep",
      "Drive your feet into the floor for stability",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "40-50% 1RM", caloriesPerSet: 6 },
      { label: "Moderate", sets: 4, reps: "8-10", load: "65-75% 1RM", caloriesPerSet: 7 },
      { label: "Heavy (low-rep)", sets: 5, reps: "3-5", load: "85-90% 1RM", caloriesPerSet: 5 },
    ],
    scores: { hypertrophy: 9, strength: 9, conditioning: 3 },
  },
  {
    slug: "overhead-press-barbell",
    name: "Overhead Press (Barbell)",
    category: "Strength",
    movementType: "Compound",
    equipment: "Barbell",
    difficulty: "Intermediate",
    primaryMuscles: ["Shoulders"],
    secondaryMuscles: ["Triceps", "Upper Chest", "Core"],
    description:
      "A standing barbell press from the shoulders to overhead. Builds shoulder size and strength while demanding real core and glute stability to avoid leaning back.",
    tips: [
      "Squeeze glutes to keep ribs down, not an arched-back press",
      "Press in a straight line — move your head back then through at the top",
      "Finish with the bar over mid-foot, arms fully locked",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "12-15", load: "45-55% 1RM", caloriesPerSet: 5 },
      { label: "Moderate", sets: 4, reps: "8-10", load: "65-70% 1RM", caloriesPerSet: 6 },
      { label: "Heavy (low-rep)", sets: 5, reps: "3-5", load: "80-85% 1RM", caloriesPerSet: 5 },
    ],
    scores: { hypertrophy: 7, strength: 8, conditioning: 3 },
  },
  {
    slug: "pull-up",
    name: "Pull-Up",
    category: "Strength",
    movementType: "Compound",
    equipment: "Pull-up bar (bodyweight)",
    difficulty: "Intermediate",
    primaryMuscles: ["Lats"],
    secondaryMuscles: ["Biceps", "Rear Delts", "Forearms"],
    description:
      "A vertical pulling movement from a dead hang to chin over the bar. One of the best bodyweight exercises for back width and relative strength.",
    tips: [
      "Start from a full dead hang each rep",
      "Lead with your chest, not your chin",
      "Add weight via a dip belt once bodyweight sets exceed ~12-15 reps",
    ],
    variations: [
      { label: "Assisted / band", sets: 3, reps: "8-12", load: "Band or machine assist", caloriesPerSet: 6 },
      { label: "Bodyweight", sets: 4, reps: "6-10", load: "Bodyweight", caloriesPerSet: 8 },
      { label: "Weighted", sets: 4, reps: "4-6", load: "+10-25 lb", caloriesPerSet: 9 },
    ],
    scores: { hypertrophy: 8, strength: 8, conditioning: 5 },
  },
  {
    slug: "barbell-bent-over-row",
    name: "Barbell Bent-Over Row",
    category: "Strength",
    movementType: "Compound",
    equipment: "Barbell",
    difficulty: "Intermediate",
    primaryMuscles: ["Lats", "Mid-back"],
    secondaryMuscles: ["Biceps", "Rear Delts", "Erectors"],
    description:
      "A hip-hinged horizontal pull, rowing the bar to the lower chest/upper abdomen. Builds back thickness and is a strong counterbalance to pressing movements.",
    tips: [
      "Keep a flat back and hinge from the hips, not the lower spine",
      "Pull with your elbows, not your hands",
      "Avoid using momentum — control the negative",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "12-15", load: "45-55% 1RM", caloriesPerSet: 7 },
      { label: "Moderate", sets: 4, reps: "8-10", load: "65-75% 1RM", caloriesPerSet: 8 },
      { label: "Heavy (low-rep)", sets: 4, reps: "4-6", load: "80-85% 1RM", caloriesPerSet: 7 },
    ],
    scores: { hypertrophy: 8, strength: 7, conditioning: 4 },
  },
  {
    slug: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "Strength",
    movementType: "Compound",
    equipment: "Barbell or dumbbells",
    difficulty: "Intermediate",
    primaryMuscles: ["Hamstrings", "Glutes"],
    secondaryMuscles: ["Erectors"],
    description:
      "A hip-hinge from standing, lowering the weight along the legs with a slight knee bend to load the hamstrings, then driving the hips forward to stand. A safer entry point to hinge mechanics than the conventional deadlift, and an excellent hamstring builder.",
    tips: [
      "Push your hips back, don't just bend over",
      "Keep the bar/dumbbells close to your legs",
      "Stop the descent once you feel a hamstring stretch — don't round your back to go lower",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "40-50% 1RM", caloriesPerSet: 8 },
      { label: "Moderate", sets: 4, reps: "8-12", load: "60-70% 1RM", caloriesPerSet: 9 },
      { label: "Heavy (low-rep)", sets: 4, reps: "5-6", load: "75-80% 1RM", caloriesPerSet: 7 },
    ],
    scores: { hypertrophy: 8, strength: 7, conditioning: 4 },
  },
  {
    slug: "walking-lunge-dumbbell",
    name: "Walking Lunge (Dumbbell)",
    category: "Strength",
    movementType: "Compound",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    description:
      "Alternating forward steps into a lunge while holding dumbbells at your sides. Trains each leg independently, which helps address left-right imbalances and adds a real conditioning component at higher rep ranges.",
    tips: [
      "Keep your torso upright, don't lean forward",
      "Step far enough that your front knee tracks over your ankle, not past your toes",
      "Push through the front heel to stand",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "12-15 per leg", load: "Light dumbbells", caloriesPerSet: 10 },
      { label: "Moderate", sets: 3, reps: "10-12 per leg", load: "Moderate dumbbells", caloriesPerSet: 12 },
      { label: "Heavy (low-rep)", sets: 4, reps: "6-8 per leg", load: "Heavy dumbbells", caloriesPerSet: 10 },
    ],
    scores: { hypertrophy: 7, strength: 6, conditioning: 6 },
  },
  {
    slug: "push-up",
    name: "Push-Up",
    category: "Strength",
    movementType: "Compound",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscles: ["Chest"],
    secondaryMuscles: ["Triceps", "Front Delts", "Core"],
    description:
      "A horizontal bodyweight press from a plank position. No equipment needed, scales easily by changing hand/foot elevation, and doubles as a core exercise since you have to resist sagging hips.",
    tips: [
      "Keep a straight line from head to heels — don't let hips sag",
      "Lower until your chest nearly touches the floor",
      "Elevate your feet to increase difficulty once standard push-ups get easy",
    ],
    variations: [
      { label: "Incline (easier)", sets: 3, reps: "12-20", load: "Hands elevated", caloriesPerSet: 5 },
      { label: "Standard", sets: 4, reps: "10-15", load: "Bodyweight", caloriesPerSet: 6 },
      { label: "Decline / weighted", sets: 4, reps: "8-12", load: "Feet elevated or weighted vest", caloriesPerSet: 7 },
    ],
    scores: { hypertrophy: 6, strength: 5, conditioning: 4 },
  },
  {
    slug: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    category: "Strength",
    movementType: "Compound",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primaryMuscles: ["Shoulders"],
    secondaryMuscles: ["Triceps", "Upper Chest"],
    description:
      "A seated or standing overhead press with dumbbells. The independent arm path lets each shoulder move through its own natural groove and adds a stability demand compared to a barbell.",
    tips: [
      "Keep your wrists stacked over your elbows at the bottom",
      "Avoid flaring your elbows out past 45 degrees from your torso",
      "Don't let the dumbbells drift forward or backward at lockout",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "Light dumbbells", caloriesPerSet: 5 },
      { label: "Moderate", sets: 4, reps: "8-12", load: "Moderate dumbbells", caloriesPerSet: 6 },
      { label: "Heavy (low-rep)", sets: 4, reps: "5-6", load: "Heavy dumbbells", caloriesPerSet: 5 },
    ],
    scores: { hypertrophy: 7, strength: 6, conditioning: 3 },
  },
  {
    slug: "lat-pulldown",
    name: "Lat Pulldown",
    category: "Strength",
    movementType: "Compound",
    equipment: "Cable machine",
    difficulty: "Beginner",
    primaryMuscles: ["Lats"],
    secondaryMuscles: ["Biceps", "Rear Delts"],
    description:
      "A machine-based vertical pull, drawing the bar down to the upper chest. A good pull-up substitute for building back width while you work up to bodyweight pulling strength.",
    tips: [
      "Lead with your elbows, driving them down and back",
      "Avoid leaning back excessively or using body English to move the weight",
      "Control the eccentric back to full arm extension",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "40-50% 1RM", caloriesPerSet: 6 },
      { label: "Moderate", sets: 4, reps: "10-12", load: "60-70% 1RM", caloriesPerSet: 7 },
      { label: "Heavy (low-rep)", sets: 4, reps: "6-8", load: "75-80% 1RM", caloriesPerSet: 6 },
    ],
    scores: { hypertrophy: 7, strength: 5, conditioning: 3 },
  },
  {
    slug: "dumbbell-row",
    name: "Dumbbell Row",
    category: "Strength",
    movementType: "Compound",
    equipment: "Dumbbell + bench",
    difficulty: "Beginner",
    primaryMuscles: ["Lats", "Mid-back"],
    secondaryMuscles: ["Biceps", "Rear Delts"],
    description:
      "A single-arm horizontal pull, one hand and knee braced on a bench, rowing the dumbbell to your hip. Lets you isolate each side of the back and move through a longer range of motion than a barbell row.",
    tips: [
      "Keep your torso roughly parallel to the floor and still — don't rotate to cheat the weight up",
      "Let the shoulder blade protract fully at the bottom for a full stretch",
      "Pull with your elbow close to your body",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "Light dumbbell", caloriesPerSet: 5 },
      { label: "Moderate", sets: 4, reps: "10-12", load: "Moderate dumbbell", caloriesPerSet: 6 },
      { label: "Heavy (low-rep)", sets: 4, reps: "6-8", load: "Heavy dumbbell", caloriesPerSet: 5 },
    ],
    scores: { hypertrophy: 7, strength: 5, conditioning: 3 },
  },
  {
    slug: "dumbbell-curl",
    name: "Dumbbell Curl",
    category: "Strength",
    movementType: "Isolation",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primaryMuscles: ["Biceps"],
    secondaryMuscles: ["Forearms"],
    description:
      "A classic elbow-flexion isolation move. Low systemic fatigue, so it's easy to push close to failure and a reliable way to add direct arm size.",
    tips: [
      "Keep your elbows pinned to your sides",
      "Avoid swinging the weight up with your hips or back",
      "Control the lowering phase — don't just drop the weight",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "Light dumbbells", caloriesPerSet: 3 },
      { label: "Moderate", sets: 3, reps: "10-12", load: "Moderate dumbbells", caloriesPerSet: 4 },
      { label: "Heavy (low-rep)", sets: 4, reps: "6-8", load: "Heavy dumbbells", caloriesPerSet: 3 },
    ],
    scores: { hypertrophy: 7, strength: 3, conditioning: 1 },
  },
  {
    slug: "barbell-curl",
    name: "Barbell Curl",
    category: "Strength",
    movementType: "Isolation",
    equipment: "Barbell or EZ-bar",
    difficulty: "Beginner",
    primaryMuscles: ["Biceps"],
    secondaryMuscles: ["Forearms"],
    description:
      "The barbell version of the curl, letting you load more total weight than dumbbells since both arms move together. An EZ-bar version reduces wrist strain for most lifters.",
    tips: [
      "Keep elbows stationary at your sides through the full rep",
      "Don't lean back to help the bar up on heavy sets",
      "Squeeze at the top rather than just reaching lockout",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "40-50% 1RM", caloriesPerSet: 3 },
      { label: "Moderate", sets: 3, reps: "8-10", load: "65-75% 1RM", caloriesPerSet: 4 },
      { label: "Heavy (low-rep)", sets: 4, reps: "5-6", load: "80-85% 1RM", caloriesPerSet: 3 },
    ],
    scores: { hypertrophy: 7, strength: 4, conditioning: 1 },
  },
  {
    slug: "triceps-pushdown-cable",
    name: "Triceps Pushdown (Cable)",
    category: "Strength",
    movementType: "Isolation",
    equipment: "Cable machine",
    difficulty: "Beginner",
    primaryMuscles: ["Triceps"],
    secondaryMuscles: [],
    description:
      "A cable isolation move, extending the elbows against resistance with a bar or rope attachment. A low-fatigue way to add direct triceps volume on top of pressing work.",
    tips: [
      "Keep your elbows pinned at your sides — only your forearms should move",
      "Use a rope attachment and flare your hands apart at the bottom for a stronger contraction",
      "Avoid leaning over the cable stack to use body weight",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "Light cable stack", caloriesPerSet: 2 },
      { label: "Moderate", sets: 3, reps: "10-12", load: "Moderate cable stack", caloriesPerSet: 3 },
      { label: "Heavy (low-rep)", sets: 4, reps: "8-10", load: "Heavy cable stack", caloriesPerSet: 3 },
    ],
    scores: { hypertrophy: 6, strength: 3, conditioning: 1 },
  },
  {
    slug: "plank",
    name: "Plank",
    category: "Core",
    movementType: "Isolation",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    primaryMuscles: ["Core"],
    secondaryMuscles: ["Shoulders"],
    description:
      "An isometric hold on your forearms and toes, keeping your body in a straight line. Builds the kind of anti-extension core stability that protects your spine under a loaded squat or deadlift.",
    tips: [
      "Squeeze your glutes and brace like you're about to be punched in the stomach",
      "Keep your hips level — don't let them sag or pike up",
      "Breathe normally through the hold instead of holding your breath",
    ],
    variations: [
      { label: "Short hold", sets: 3, reps: "20-30 sec", load: "Bodyweight", caloriesPerSet: 2 },
      { label: "Standard hold", sets: 3, reps: "40-60 sec", load: "Bodyweight", caloriesPerSet: 4 },
      { label: "Extended / weighted", sets: 3, reps: "60-90 sec", load: "Bodyweight + plate on back", caloriesPerSet: 6 },
    ],
    scores: { hypertrophy: 2, strength: 4, conditioning: 3 },
  },
  {
    slug: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    category: "Core",
    movementType: "Isolation",
    equipment: "Pull-up bar",
    difficulty: "Intermediate",
    primaryMuscles: ["Core", "Hip Flexors"],
    secondaryMuscles: ["Forearms"],
    description:
      "Hanging from a bar and raising your legs (or knees) toward your chest. A harder progression than a floor crunch since you're also fighting to control the swing, which recruits grip and lats as stabilizers.",
    tips: [
      "Curl your pelvis under at the top rather than just swinging your legs up",
      "Keep the movement controlled — momentum turns this into a worse exercise",
      "Bend your knees to regress, straighten your legs to progress",
    ],
    variations: [
      { label: "Bent-knee", sets: 3, reps: "10-12", load: "Bodyweight", caloriesPerSet: 4 },
      { label: "Standard", sets: 3, reps: "8-10", load: "Bodyweight, straight legs", caloriesPerSet: 5 },
      { label: "Weighted", sets: 3, reps: "6-8", load: "+ ankle weights", caloriesPerSet: 6 },
    ],
    scores: { hypertrophy: 4, strength: 3, conditioning: 3 },
  },
  {
    slug: "kettlebell-swing",
    name: "Kettlebell Swing",
    category: "Conditioning",
    movementType: "Compound",
    equipment: "Kettlebell",
    difficulty: "Intermediate",
    primaryMuscles: ["Glutes", "Hamstrings"],
    secondaryMuscles: ["Core", "Shoulders", "Grip"],
    description:
      "An explosive hip-hinge that projects the kettlebell to chest height using hip drive, not your arms. One of the best exercises for combining strength and conditioning in the same movement — see the calorie-breakdown article in Resources for a worked example.",
    tips: [
      "Power comes from snapping your hips forward, not lifting with your shoulders",
      "Keep a neutral spine — this is a hinge, not a squat",
      "Let the kettlebell float briefly at the top instead of muscling it higher",
    ],
    variations: [
      { label: "Light / technique", sets: 3, reps: "15-20", load: "Light KB (18-26 lb)", caloriesPerSet: 8 },
      { label: "Moderate / conditioning", sets: 4, reps: "15-20", load: "Moderate KB (35-44 lb)", caloriesPerSet: 11 },
      { label: "Heavy / power", sets: 5, reps: "8-10", load: "Heavy KB (53-70 lb)", caloriesPerSet: 10 },
    ],
    scores: { hypertrophy: 5, strength: 6, conditioning: 9 },
  },
  {
    slug: "kettlebell-goblet-squat",
    name: "Kettlebell Goblet Squat",
    category: "Strength",
    movementType: "Compound",
    equipment: "Kettlebell",
    difficulty: "Beginner",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Core"],
    description:
      "A squat holding a kettlebell at chest height. The front-loaded weight makes it easier to stay upright than a barbell squat, making it a great entry point for learning squat mechanics.",
    tips: [
      "Keep your elbows pointed down, tracking between your knees as you descend",
      "Sit back and down rather than just bending your knees",
      "Use your elbows to gently push your knees out at the bottom if needed",
    ],
    variations: [
      { label: "Light (high-rep)", sets: 3, reps: "15-20", load: "Light-moderate KB", caloriesPerSet: 7 },
      { label: "Moderate", sets: 4, reps: "10-12", load: "Moderate KB", caloriesPerSet: 9 },
      { label: "Heavy (low-rep)", sets: 4, reps: "6-8", load: "Heavy KB", caloriesPerSet: 7 },
    ],
    scores: { hypertrophy: 6, strength: 5, conditioning: 5 },
  },
  {
    slug: "rowing-machine",
    name: "Rowing Machine (Erg)",
    category: "Cardio",
    movementType: "Compound",
    equipment: "Rowing ergometer",
    difficulty: "Beginner",
    primaryMuscles: ["Legs", "Back"],
    secondaryMuscles: ["Arms", "Core"],
    description:
      "A full-body cardio machine that combines a leg drive, hip hinge, and arm pull in one stroke. Lower-impact than running, and the stroke mechanics double as a light technique rehearsal for the deadlift hinge pattern.",
    tips: [
      "Drive with your legs first, then lean back, then pull with your arms — reverse the order on the way back",
      "Keep roughly a 1:2 ratio of drive to recovery time",
      "Don't round your lower back at the catch position",
    ],
    variations: [
      { label: "Easy pace", sets: 1, reps: "10 min steady", load: "Low resistance", caloriesPerSet: 80 },
      { label: "Moderate pace", sets: 1, reps: "20 min steady", load: "Moderate resistance", caloriesPerSet: 190 },
      { label: "Intervals", sets: 6, reps: "500m hard / 90 sec rest", load: "High effort", caloriesPerSet: 18 },
    ],
    scores: { hypertrophy: 3, strength: 3, conditioning: 9 },
  },
  {
    slug: "jump-rope",
    name: "Jump Rope",
    category: "Cardio",
    movementType: "Compound",
    equipment: "Jump rope",
    difficulty: "Beginner",
    primaryMuscles: ["Calves"],
    secondaryMuscles: ["Shoulders", "Core"],
    description:
      "A simple, portable conditioning tool. Cheap, travels anywhere, and builds the kind of rhythmic footwork and calf endurance that carries over to other sports.",
    tips: [
      "Jump just high enough to clear the rope — a half-inch off the ground is plenty",
      "Keep elbows close to your body and turn the rope with your wrists, not your whole arm",
      "Land softly on the balls of your feet",
    ],
    variations: [
      { label: "Easy pace", sets: 5, reps: "1 min on / 1 min rest", load: "Bodyweight", caloriesPerSet: 10 },
      { label: "Moderate pace", sets: 6, reps: "2 min on / 1 min rest", load: "Bodyweight", caloriesPerSet: 20 },
      { label: "Fast / double-unders", sets: 8, reps: "30-60 sec on", load: "Bodyweight, high intensity", caloriesPerSet: 12 },
    ],
    scores: { hypertrophy: 1, strength: 2, conditioning: 8 },
  },
  {
    slug: "running-steady-state",
    name: "Running (steady-state)",
    category: "Cardio",
    movementType: "Compound",
    equipment: "None (or treadmill)",
    difficulty: "Beginner",
    primaryMuscles: ["Quadriceps", "Calves"],
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    description:
      "The baseline cardio exercise — no equipment required, and the easiest activity to progressively track by pace, distance, or time. Adding a weighted vest or incline (like the loaded treadmill walk covered in the Resources calorie article) increases the strength demand.",
    tips: [
      "Build mileage gradually — a common guideline is no more than ~10% more distance per week",
      "Land with your foot roughly under your hips rather than reaching out in front of you",
      "Breathe through a relaxed rhythm — slow down if you can't hold a conversation",
    ],
    variations: [
      { label: "Easy pace", sets: 1, reps: "30 min", load: "Conversational pace", caloriesPerSet: 250 },
      { label: "Moderate pace", sets: 1, reps: "30 min", load: "Tempo pace", caloriesPerSet: 320 },
      { label: "Intervals", sets: 8, reps: "400m hard / 200m jog", load: "High effort", caloriesPerSet: 35 },
    ],
    scores: { hypertrophy: 1, strength: 2, conditioning: 9 },
  },
];

export function getUniqueEquipment(): string[] {
  return Array.from(new Set(EXERCISES.map((e) => e.equipment))).sort();
}

export function getUniqueMuscles(): string[] {
  const set = new Set<string>();
  for (const e of EXERCISES) {
    for (const m of e.primaryMuscles) set.add(m);
    for (const m of e.secondaryMuscles) set.add(m);
  }
  return Array.from(set).sort();
}

export function averageCalories(exercise: Exercise): number {
  const total = exercise.variations.reduce((s, v) => s + v.caloriesPerSet, 0);
  return total / exercise.variations.length;
}
