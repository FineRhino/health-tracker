export interface DailyLogFieldMeta {
  key: string;
  label: string;
  unit?: string;
}

export const DAILY_LOG_FIELDS: DailyLogFieldMeta[] = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "fatG", label: "Fat", unit: "g" },
  { key: "saturatedFatG", label: "Saturated fat", unit: "g" },
  { key: "carbsG", label: "Carbs", unit: "g" },
  { key: "proteinG", label: "Protein", unit: "g" },
  { key: "fiberG", label: "Fiber", unit: "g" },
  { key: "alcoholG", label: "Alcohol", unit: "g" },
  { key: "fastingHours", label: "Overnight fasting", unit: "hrs" },
  { key: "bloatRating", label: "Bloat rating (1=bloated, 10=lean)", unit: "/10" },
  { key: "energyRating", label: "Energy rating (1=weak, 10=strong)", unit: "/10" },
];
