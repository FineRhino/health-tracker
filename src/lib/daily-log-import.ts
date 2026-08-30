import "server-only";
import { Readable } from "node:stream";
import ExcelJS from "exceljs";

export interface DailyLogValues {
  calories: number | null;
  fatG: number | null;
  saturatedFatG: number | null;
  carbsG: number | null;
  proteinG: number | null;
  fiberG: number | null;
  alcoholG: number | null;
  fastingHours: number | null;
  bloatRating: number | null;
  energyRating: number | null;
}

type FieldKind = "float" | "int";

interface FieldRule {
  field: keyof DailyLogValues;
  kind: FieldKind;
  test: (h: string) => boolean;
}

const SHEET_NAME_HINT = "dailytotal";

// Rules are evaluated in order; more specific/exclusionary rules must come
// before general ones (e.g. "diff from target" columns must be rejected
// before the general "fat"/"carbs" rules would otherwise match them).
const FIELD_RULES: FieldRule[] = [
  { field: "fastingHours", kind: "float", test: (h) => h.includes("fasting") },
  { field: "bloatRating", kind: "int", test: (h) => h.includes("bloated") },
  {
    field: "energyRating",
    kind: "int",
    test: (h) => h.includes("feel weak") || h.includes("feel strong"),
  },
  {
    field: "saturatedFatG",
    kind: "float",
    test: (h) => h.includes("saturated fat"),
  },
  {
    field: "fatG",
    kind: "float",
    test: (h) => h.includes("fat") && !h.includes("diff") && !h.includes("saturated"),
  },
  {
    field: "carbsG",
    kind: "float",
    test: (h) => h.includes("carbs") && !h.includes("diff") && !h.includes("net"),
  },
  {
    field: "proteinG",
    kind: "float",
    test: (h) => h.includes("protein") && !h.includes("diff"),
  },
  {
    field: "fiberG",
    kind: "float",
    test: (h) => h.includes("fiber") && !h.includes("diff") && !h.includes("net"),
  },
  { field: "alcoholG", kind: "float", test: (h) => h.includes("alcohol") },
  {
    field: "calories",
    kind: "float",
    test: (h) =>
      h.includes("calories") &&
      !h.includes("net") &&
      !h.includes("diff") &&
      !h.includes("burned") &&
      !h.includes("target"),
  },
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
      if (header === "date" || FIELD_RULES.some((r) => r.test(header))) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      best = sheet;
    }
  }
  return best;
}

export interface ParsedDailyLogRow {
  rowNumber: number;
  date: Date;
  values: DailyLogValues;
}

export interface DailyLogParseResult {
  sheetName: string;
  rows: ParsedDailyLogRow[];
  skipped: number;
}

export async function parseDailyLogFile(buffer: Buffer, filename: string): Promise<DailyLogParseResult> {
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
  const colMap = new Map<number, FieldRule>();

  sheet.getRow(1).eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const header = normalizeHeader(String(cell.value ?? ""));
    if (header === "date") {
      dateCol = colNumber;
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

  const rows: ParsedDailyLogRow[] = [];
  let skipped = 0;

  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;

    const dateParts = extractDateParts(row.getCell(dateCol!).value);
    if (!dateParts) {
      skipped++;
      return;
    }

    const date = new Date(dateParts.y, dateParts.m, dateParts.d);

    const values = {} as DailyLogValues;
    for (const [colNumber, rule] of colMap) {
      const n = parseNumber(row.getCell(colNumber).value);
      values[rule.field] = (rule.kind === "int" && n !== null ? Math.round(n) : n) as never;
    }

    rows.push({ rowNumber, date, values });
  });

  return { sheetName: sheet.name, rows, skipped };
}
