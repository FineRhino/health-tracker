import "server-only";
import { Readable } from "node:stream";
import ExcelJS from "exceljs";

export type FoodMealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export interface FoodValues {
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  saturatedFatG: number | null;
  fiberG: number | null;
  alcoholG: number | null;
}

type FieldKind = "float" | "int";

interface FieldRule {
  field: keyof FoodValues;
  kind: FieldKind;
  test: (h: string) => boolean;
}

const SHEET_NAME_HINT = "foodlog";

// Rules are evaluated in order; more specific/exclusionary rules must come
// before general ones (e.g. "saturated fat" must be rejected before the
// general "fat" rule would otherwise match it).
const FIELD_RULES: FieldRule[] = [
  { field: "saturatedFatG", kind: "float", test: (h) => h.includes("saturated fat") },
  { field: "fatG", kind: "float", test: (h) => h.includes("fat") && !h.includes("saturated") },
  { field: "carbsG", kind: "float", test: (h) => h.includes("carbs") && !h.includes("net") },
  { field: "proteinG", kind: "float", test: (h) => h.includes("protein") },
  { field: "fiberG", kind: "float", test: (h) => h.includes("fiber") && !h.includes("net") },
  { field: "alcoholG", kind: "float", test: (h) => h.includes("alcohol") },
  { field: "calories", kind: "float", test: (h) => h.includes("calories") },
];

function normalizeHeader(raw: string): string {
  return raw
    .replace(/\n/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
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

function parseNumber(value: unknown): number | null {
  const v = unwrapCellValue(value);
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const cleaned = v.replace(/[%,]/g, "").trim();
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function parseName(value: unknown): string | null {
  const v = unwrapCellValue(value);
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s || null;
}

function mealTypeFromHour(hour: number): FoodMealType {
  if (hour >= 4 && hour < 11) return "BREAKFAST";
  if (hour >= 11 && hour < 16) return "LUNCH";
  if (hour >= 16 && hour < 22) return "DINNER";
  return "SNACK";
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
      const header = normalizeHeader(String(cell.value ?? ""));
      if (
        header === "date" ||
        header === "description" ||
        header === "name" ||
        FIELD_RULES.some((r) => r.test(header))
      ) {
        score++;
      }
    });
    if (score > bestScore) {
      bestScore = score;
      best = sheet;
    }
  }
  return best;
}

export interface ParsedFoodRow {
  rowNumber: number;
  date: Date;
  mealType: FoodMealType;
  name: string;
  values: FoodValues;
}

export interface FoodParseResult {
  sheetName: string;
  rows: ParsedFoodRow[];
  skipped: number;
}

export async function parseFoodFile(buffer: Buffer, filename: string): Promise<FoodParseResult> {
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
  let nameCol: number | null = null;
  const colMap = new Map<number, FieldRule>();

  sheet.getRow(1).eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const header = normalizeHeader(String(cell.value ?? ""));
    if (header === "date") {
      dateCol = colNumber;
      return;
    }
    if (header === "time") {
      timeCol = colNumber;
      return;
    }
    if (header === "description" || header === "name" || header === "food") {
      nameCol = colNumber;
      return;
    }
    const rule = FIELD_RULES.find((r) => r.test(header));
    if (rule) colMap.set(colNumber, rule);
  });

  if (dateCol === null) {
    throw new Error(
      `Could not find a "Date" column on sheet "${sheet.name}". Make sure the file has a header row with a "Date" column.`
    );
  }
  if (nameCol === null) {
    throw new Error(
      `Could not find a "Description" column on sheet "${sheet.name}". Make sure the file has a header row with a "Description" (or "Name") column.`
    );
  }

  const rows: ParsedFoodRow[] = [];
  let skipped = 0;

  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;

    const dateParts = extractDateParts(row.getCell(dateCol!).value);
    const name = parseName(row.getCell(nameCol!).value);
    if (!dateParts || !name) {
      skipped++;
      return;
    }

    let hour: number | null = null;
    let minute = 0;
    if (timeCol !== null) {
      const timeParts = extractTimeParts(row.getCell(timeCol).value);
      if (timeParts) {
        hour = timeParts.h;
        minute = timeParts.min;
      }
    }

    const date = new Date(dateParts.y, dateParts.m, dateParts.d, hour ?? 0, minute);
    const mealType = hour !== null ? mealTypeFromHour(hour) : "SNACK";

    const values = {} as FoodValues;
    for (const [colNumber, rule] of colMap) {
      const n = parseNumber(row.getCell(colNumber).value);
      values[rule.field] = (rule.kind === "int" && n !== null ? Math.round(n) : n) as never;
    }

    rows.push({ rowNumber, date, mealType, name, values });
  });

  return { sheetName: sheet.name, rows, skipped };
}
