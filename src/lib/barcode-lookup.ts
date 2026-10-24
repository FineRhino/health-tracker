import "server-only";

export interface BarcodeLookupResult {
  found: boolean;
  barcode: string;
  name: string | null;
  brand: string | null;
  servingDescription: string | null;
  isPerServing: boolean;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  saturatedFatG: number | null;
  fiberG: number | null;
  alcoholG: number | null;
}

interface OffNutriments {
  [key: string]: number | string | undefined;
}

function readNutrient(nutriments: OffNutriments, base: string): number | null {
  const perServing = nutriments[`${base}_serving`];
  if (typeof perServing === "number" && Number.isFinite(perServing)) return perServing;
  const per100g = nutriments[`${base}_100g`];
  if (typeof per100g === "number" && Number.isFinite(per100g)) return per100g;
  return null;
}

export async function lookupBarcode(barcode: string): Promise<BarcodeLookupResult> {
  const empty: BarcodeLookupResult = {
    found: false,
    barcode,
    name: null,
    brand: null,
    servingDescription: null,
    isPerServing: false,
    calories: null,
    proteinG: null,
    carbsG: null,
    fatG: null,
    saturatedFatG: null,
    fiberG: null,
    alcoholG: null,
  };

  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=product_name,brands,serving_size,nutriments,status`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": "HealthTracker/1.0 (personal use)" },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new Error("Could not reach the barcode lookup service. Check your connection and try again.");
  }

  if (!res.ok) {
    throw new Error("Could not reach the barcode lookup service. Try again in a moment.");
  }

  const data = await res.json();
  if (data.status !== 1 || !data.product) {
    return empty;
  }

  const product = data.product;
  const nutriments: OffNutriments = product.nutriments ?? {};
  const hasServingValues = typeof nutriments["energy-kcal_serving"] === "number";

  return {
    found: true,
    barcode,
    name: typeof product.product_name === "string" && product.product_name ? product.product_name : null,
    brand: typeof product.brands === "string" && product.brands ? product.brands : null,
    servingDescription: typeof product.serving_size === "string" ? product.serving_size : null,
    isPerServing: hasServingValues,
    calories: readNutrient(nutriments, "energy-kcal"),
    proteinG: readNutrient(nutriments, "proteins"),
    carbsG: readNutrient(nutriments, "carbohydrates"),
    fatG: readNutrient(nutriments, "fat"),
    saturatedFatG: readNutrient(nutriments, "saturated-fat"),
    fiberG: readNutrient(nutriments, "fiber"),
    alcoholG: readNutrient(nutriments, "alcohol"),
  };
}
