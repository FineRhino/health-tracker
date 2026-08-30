export interface BiometricFieldMeta {
  key: string;
  label: string;
  unit?: string;
}

export const BIOMETRIC_FIELDS: BiometricFieldMeta[] = [
  { key: "weightLbs", label: "Weight", unit: "lbs" },
  { key: "bmi", label: "BMI" },
  { key: "bodyFatPercent", label: "Body fat", unit: "%" },
  { key: "bodyFatMassLbs", label: "Body fat mass", unit: "lbs" },
  { key: "leanMassLbs", label: "Lean mass", unit: "lbs" },
  { key: "leanMassPercent", label: "Lean mass", unit: "%" },
  { key: "subcutaneousFatMassLbs", label: "Subcutaneous fat mass", unit: "lbs" },
  { key: "subcutaneousFatPercent", label: "Subcutaneous fat", unit: "%" },
  { key: "visceralFatIndex", label: "Visceral fat index" },
  { key: "skeletalMuscleMassLbs", label: "Skeletal muscle mass", unit: "lbs" },
  { key: "skeletalMassLbs", label: "Skeletal mass", unit: "lbs" },
  { key: "boneMineralContentLbs", label: "Bone mineral content", unit: "lbs" },
  { key: "bodyWaterPercent", label: "Body water", unit: "%" },
  { key: "extracellularWaterLbs", label: "Extracellular water", unit: "lbs" },
  { key: "intracellularWaterLbs", label: "Intracellular water", unit: "lbs" },
  { key: "mineralMassLbs", label: "Mineral mass", unit: "lbs" },
  { key: "basalMetabolicRate", label: "BMR", unit: "kcal" },
  { key: "metabolicAge", label: "Metabolic age", unit: "yrs" },
  { key: "bodyCellMassLbs", label: "Body cell mass", unit: "lbs" },
];
