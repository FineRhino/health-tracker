"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Barcode, Camera, CameraOff } from "lucide-react";
import { createFoodEntry, lookupFoodBarcode, type FoodFormValues } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Shape Detection API — supported in Chrome/Edge, not yet in all browsers.
// Feature-detected at runtime; no @types/dom entry exists for it.
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
}
interface BarcodeDetectorConstructor {
  new (options?: { formats: string[] }): BarcodeDetectorLike;
}

function getBarcodeDetector(): BarcodeDetectorConstructor | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector ?? null;
}

const defaultValues: FoodFormValues = {
  date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  mealType: "BREAKFAST",
  name: "",
  calories: "",
  proteinG: "",
  carbsG: "",
  fatG: "",
  saturatedFatG: "",
  fiberG: "",
  alcoholG: "",
  notes: "",
};

export function BarcodeDialog() {
  const [open, setOpen] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [status, setStatus] = useState<"idle" | "looking-up" | "not-found" | "error" | "found">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const cameraSupported = getBarcodeDetector() !== null;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FoodFormValues>({ defaultValues });

  function stopScanning() {
    setScanning(false);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function resetAll() {
    stopScanning();
    setBarcode("");
    setStatus("idle");
    setErrorMessage(null);
    setCameraError(null);
    reset(defaultValues);
  }

  async function runLookup(code: string) {
    setStatus("looking-up");
    setErrorMessage(null);
    const result = await lookupFoodBarcode(code);
    if ("error" in result) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    if (!result.result.found) {
      setStatus("not-found");
      setValue("name", "");
      return;
    }
    const p = result.result;
    setStatus("found");
    setValue("name", p.name ?? (p.brand ? `${p.brand} item` : "Scanned item"));
    setValue("calories", p.calories ?? "");
    setValue("proteinG", p.proteinG ?? "");
    setValue("carbsG", p.carbsG ?? "");
    setValue("fatG", p.fatG ?? "");
    setValue("saturatedFatG", p.saturatedFatG ?? "");
    setValue("fiberG", p.fiberG ?? "");
    setValue("alcoholG", p.alcoholG ?? "");
    setValue(
      "notes",
      p.servingDescription
        ? `Barcode ${p.barcode}${p.brand ? ` · ${p.brand}` : ""} · ${p.isPerServing ? "per serving" : "per 100g"} (${p.servingDescription})`
        : `Barcode ${p.barcode}${p.brand ? ` · ${p.brand}` : ""} · ${p.isPerServing ? "per serving" : "per 100g"}`
    );
  }

  async function startScanning() {
    setCameraError(null);
    const Detector = getBarcodeDetector();
    if (!Detector) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError("Couldn't access the camera. Check your browser's camera permission.");
      return;
    }

    const detector = new Detector({
      formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"],
    });
    setScanning(true);

    const tick = async () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0) {
            const value = codes[0].rawValue;
            setBarcode(value);
            stopScanning();
            runLookup(value);
            return;
          }
        } catch {
          // transient decode errors are expected between frames; keep scanning
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => stopScanning, []);

  async function onSubmit(values: FoodFormValues) {
    const result = await createFoodEntry(values);
    if (result?.success) {
      resetAll();
      setOpen(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetAll();
      }}
    >
      <DialogTrigger render={<Button variant="outline" />}>
        <Barcode /> Scan barcode
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scan a barcode</DialogTitle>
          <DialogDescription>
            Looks up nutrition from Open Food Facts. Review and adjust before saving — serving
            sizes don&apos;t always match what you ate.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-2">
            <Field className="flex-1">
              <FieldLabel htmlFor="barcode">Barcode number</FieldLabel>
              <Input
                id="barcode"
                inputMode="numeric"
                placeholder="e.g. 0049000028911"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </Field>
            <Button
              type="button"
              variant="outline"
              disabled={!barcode.trim() || status === "looking-up"}
              onClick={() => runLookup(barcode.trim())}
            >
              {status === "looking-up" ? "Looking up..." : "Look up"}
            </Button>
          </div>

          {cameraSupported && (
            <div className="flex flex-col gap-2">
              {!scanning ? (
                <Button type="button" variant="outline" onClick={startScanning}>
                  <Camera /> Scan with camera
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <video
                    ref={videoRef}
                    className="aspect-video w-full rounded-lg bg-black object-cover"
                    muted
                    playsInline
                  />
                  <Button type="button" variant="outline" onClick={stopScanning}>
                    <CameraOff /> Stop scanning
                  </Button>
                </div>
              )}
              {cameraError && <FieldError>{cameraError}</FieldError>}
            </div>
          )}
          {!cameraSupported && (
            <FieldDescription>
              Camera scanning isn&apos;t supported in this browser — try Chrome or Edge, or enter
              the barcode number above.
            </FieldDescription>
          )}

          {status === "not-found" && (
            <FieldDescription>
              No product found for that barcode. You can still fill in the fields manually below.
            </FieldDescription>
          )}
          {status === "error" && errorMessage && <FieldError>{errorMessage}</FieldError>}
        </div>

        {(status === "found" || status === "not-found") && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="bc-date">Date &amp; time</FieldLabel>
                  <Input id="bc-date" type="datetime-local" {...register("date", { required: true })} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bc-mealType">Meal</FieldLabel>
                  <Controller
                    control={control}
                    name="mealType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="bc-mealType" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                          <SelectItem value="LUNCH">Lunch</SelectItem>
                          <SelectItem value="DINNER">Dinner</SelectItem>
                          <SelectItem value="SNACK">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="bc-name">Food</FieldLabel>
                <Input id="bc-name" {...register("name", { required: true })} />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <div className="grid grid-cols-4 gap-3">
                <Field>
                  <FieldLabel htmlFor="bc-calories">Calories</FieldLabel>
                  <Input id="bc-calories" type="number" step="any" {...register("calories")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bc-proteinG">Protein (g)</FieldLabel>
                  <Input id="bc-proteinG" type="number" step="any" {...register("proteinG")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bc-carbsG">Carbs (g)</FieldLabel>
                  <Input id="bc-carbsG" type="number" step="any" {...register("carbsG")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bc-fatG">Fat (g)</FieldLabel>
                  <Input id="bc-fatG" type="number" step="any" {...register("fatG")} />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field>
                  <FieldLabel htmlFor="bc-saturatedFatG">Sat. fat (g)</FieldLabel>
                  <Input id="bc-saturatedFatG" type="number" step="any" {...register("saturatedFatG")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bc-fiberG">Fiber (g)</FieldLabel>
                  <Input id="bc-fiberG" type="number" step="any" {...register("fiberG")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bc-alcoholG">Alcohol (g)</FieldLabel>
                  <Input id="bc-alcoholG" type="number" step="any" {...register("alcoholG")} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="bc-notes">Notes</FieldLabel>
                <Input id="bc-notes" {...register("notes")} />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save entry"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
