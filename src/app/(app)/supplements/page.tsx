import { SupplementExplorer } from "./supplement-explorer";

export default function SupplementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Supplements</h1>
        <p className="text-sm text-muted-foreground">
          A filterable reference of vitamins, minerals, herbs, and other supplements —
          effects, cautions, general safe amounts, and links to research.
        </p>
      </div>
      <SupplementExplorer />
    </div>
  );
}
