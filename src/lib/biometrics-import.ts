import "server-only";
import { Readable } from "node:stream";
import ExcelJS from "exceljs";

type FieldKind = "float" | "int" | "string";

export interface BiometricValues {
  weightLbs: number | null;
  bmi: number | null;
  bodyFatPercent: number | null;
  bodyFatMassLbs: number | null;
  leanMassLbs: number | null;
  leanMassPercent: number | null;
  subcutaneousFatMassLbs: number | null;
  subcutaneousFatPercent: number | null;
  visceralFatIndex: number | null;
  skeletalMuscleMassLbs: number | null;
  skeletalMassLbs: number | null;
  boneMineralContentLbs: number | null;
  bodyWaterPercent: number | null;
  extracellularWaterLbs: number | null;
  intracellularWaterLbs: number | null;
  mineralMassLbs: number | null;
  basalMetabolicRate: number | null;
  metabolicAge: number | null;
  bodyCellMassLbs: number | null;
  notes: string | null;
}

interface FieldMapping {
  field: keyof BiometricValues;
  kind: FieldKind;
  percent?: boolean;
}

const DATE_KEY = "date";
const TIME_KEY = "time of day";
const SHEET_NAME_HINT = "biometric";

// Keyed by `${normalizedHeaderBase}|${hadPercentSignInHeader}` so e.g. "Lean Mass (lbs)"
// and "Lean Mass %" map to different fields despite sharing a base name.
const COLUMN_MAP: Record<string, FieldMapping> = {
  "weight|false": { field: "weightLbs", kind: "float" },
  "bmi|false": { field: "bmi", kind: "float" },
  "body fat|true": { field: "bodyFatPercent", kind: "float", percent: true },
  "body fat mass|false": { field: "bodyFatMassLbs", kind: "float" },
  "lean mass|false": { field: "leanMassLbs", kind: "float" },
  "lean mass|true": { field: "leanMassPercent", kind: "float", percent: true },
  "subcutaneous fat mass|false": { field: "subcutaneousFatMassLbs", kind: "float" },
  "subcutaneous fat mass|true": { field: "subcutaneousFatPercent", kind: "float", percent: true },
  "visceral fat index|false": { field: "visceralFatIndex", kind: "float" },
  "skeletal muscle mass|false": { field: "skeletalMuscleMassLbs", kind: "float" },
  "skeletal mass|false": { field: "skeletalMassLbs", kind: "float" },
  "bone mineral content|false": { field: "boneMineralContentLbs", kind: "float" },
  "body water|true": { field: "bodyWaterPercent", kind: "float", percent: true },
  "extracellular water|false": { field: "extracellularWaterLbs", kind: "float" },
  "intracellular water|false": { field: "intracellularWaterLbs", kind: "float" },
  "mineral mass|false": { field: "mineralMassLbs", kind: "float" },
  "basal metabolic rate|false": { field: "basalMetabolicRate", kind: "float" },
  "metabolic age|false": { field: "metabolicAge", kind: "int" },
  "body cell mass|false": { field: "bodyCellMassLbs", kind: "float" },
  "notes|false": { field: "notes", kind: "string" },
};

function normalizeHeader(raw: string): { baseKey: string; hadPercentSign: boolean } {
  const hadPercentSign = raw.includes("%");
  const baseKey = raw
    .replace(/\(.*?\)/g, "")
    .replace(/%/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
  return { baseKey, hadPercentSign };
}

function unwrapCellValue(value: unknown): unknown {
  if (value && typeof value === "object" && "result" in (value as Record<string, unknown>)) {
    return (value as { result: unknown }).result;
  }
  return value;
}

function extractDateParts(value: unknown): { y: number; m: number; d: number } | null {
  const v = unwrapCellValue(value);
  if (v instanceof Date) {
    return { y: v.getUTCFullYear(), m: v.getUTCMonth(), d: v.getUTCDate() };
  }
  if (typeof v === "string") {
    const match = v.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
    if (!match) return null;
    const [, mm, dd, yy] = match;
    let year = parseInt(yy, 10);
    if (yy.length === 2) year += year < 70 ? 2000 : 1900;
    return { y: year, m: parseInt(mm, 10) - 1, d: parseInt(dd, 10) };
  }
  return null;
}

function extractTimeParts(value: unknown): { h: number; min: number } | null {
  const v = unwrapCellValue(value);
  if (v instanceof Date) {
    return { h: v.getUTCHours(), min: v.getUTCMinutes() };
  }
  if (typeof v === "string" && v.trim()) {
    const match = v.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    const [, hh, mm, ap] = match;
    let hour = parseInt(hh, 10) % 12;
    if (ap.toUpperCase() === "PM") hour += 12;
    return { h: hour, min: parseInt(mm, 10) };
  }
  return null;
}

function parseNumber(value: unknown, isPercent: boolean): number | null {
  const v = unwrapCellValue(value);
  if (v === null || v === undefined || v === "") return null;

  if (typeof v === "number") {
    if (!Number.isFinite(v)) return null;
    return isPercent && Math.abs(v) <= 1 ? v * 100 : v;
  }
  if (typeof v === "string") {
    const hadPercentSign = v.includes("%");
    const cleaned = v.replace(/[%,]/g, "").trim();
    if (!cleaned) return null;
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return null;
    return isPercent && !hadPercentSign && Math.abs(n) <= 1 ? n * 100 : n;
  }
  return null;
}

function parseString(value: unknown): string | null {
  const v = unwrapCellValue(value);
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s || null;
}

function pickBestSheet(workbook: ExcelJS.Workbook): ExcelJS.Worksheet {
  const named = workbook.worksheets.find((s) => s.name.toLowerCase().includes(SHEET_NAME_HINT));
  if (named) return named;
  if (workbook.worksheets.length === 1) return workbook.worksheets[0];

  let best = workbook.worksheets[0];
  let bestScore = -1;
  for (const sheet of workbook.worksheets) {
    let score = 0;
    sheet.getRow(1).eachCell({ includeEmpty: false }, (cell) => {
      const header = String(cell.value ?? "");
      const { baseKey, hadPercentSign } = normalizeHeader(header);
      if (baseKey === DATE_KEY || COLUMN_MAP[`${baseKey}|${hadPercentSign}`]) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      best = sheet;
    }
  }
  return best;
}

export interface ParsedBiometricRow {
  rowNumber: number;
  recordedAt: Date;
  values: BiometricValues;
}

export interface ParseResult {
  sheetName: string;
  rows: ParsedBiometricRow[];
  skipped: number;
}

export async function parseBiometricsFile(buffer: Buffer, filename: string): Promise<ParseResult> {
  const isCsv = filename.toLowerCase().endsWith(".csv");
  const workbook = new ExcelJS.Workbook();

  let sheet: ExcelJS.Worksheet;
  if (isCsv) {
    sheet = await workbook.csv.read(Readable.from(buffer));
  } else {
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
    sheet = pickBestSheet(workbook);
  }

  let dateCol: number | null = null;
  let timeCol: number | null = null;
  const colMap = new Map<number, FieldMapping>();

  sheet.getRow(1).eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const header = String(cell.value ?? "");
    const { baseKey, hadPercentSign } = normalizeHeader(header);
    if (baseKey === DATE_KEY) {
      dateCol = colNumber;
      return;
    }
    if (baseKey === TIME_KEY) {
      timeCol = colNumber;
      return;
    }
    const mapping = COLUMN_MAP[`${baseKey}|${hadPercentSign}`];
    if (mapping) colMap.set(colNumber, mapping);
  });

  if (dateCol === null) {
    throw new Error(
      `Could not find a "Date" column on sheet "${sheet.name}". Make sure the file has a header row with a "Date" column.`
    );
  }

  const rows: ParsedBiometricRow[] = [];
  let skipped = 0;

  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;

    const dateParts = extractDateParts(row.getCell(dateCol!).value);
    if (!dateParts) {
      skipped++;
      return;
    }

    let hour = 0;
    let minute = 0;
    if (timeCol !== null) {
      const timeParts = extractTimeParts(row.getCell(timeCol).value);
      if (timeParts) {
        hour = timeParts.h;
        minute = timeParts.min;
      }
    }

    const recordedAt = new Date(dateParts.y, dateParts.m, dateParts.d, hour, minute);

    const values = {} as BiometricValues;
    for (const [colNumber, mapping] of colMap) {
      const cellValue = row.getCell(colNumber).value;
      if (mapping.kind === "string") {
        values[mapping.field] = parseString(cellValue) as never;
      } else {
        const n = parseNumber(cellValue, !!mapping.percent);
        values[mapping.field] = (mapping.kind === "int" && n !== null ? Math.round(n) : n) as never;
      }
    }

    rows.push({ rowNumber, recordedAt, values });
  });

  return { sheetName: sheet.name, rows, skipped };
}
