"use client";

import { useMemo, useState } from "react";
import { Search, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  SUPPLEMENTS,
  getUniqueTags,
  EVIDENCE_RANK,
  type Supplement,
  type SupplementCategory,
  type EvidenceLevel,
} from "@/lib/supplements";
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

const CATEGORIES: SupplementCategory[] = ["Vitamin", "Mineral", "Herb", "Amino Acid", "Other"];
const EVIDENCE_LEVELS: EvidenceLevel[] = ["Strong", "Moderate", "Limited"];

const SORT_OPTIONS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "evidence", label: "Research support (strongest first)" },
  { value: "category", label: "Category" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

const categoryStyles: Record<SupplementCategory, string> = {
  Vitamin: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  Mineral: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-400",
  Herb: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400",
  "Amino Acid": "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-400",
  Other: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-400",
};

const evidenceStyles: Record<EvidenceLevel, string> = {
  Strong: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400",
  Moderate: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  Limited: "bg-muted text-muted-foreground",
};

export function SupplementExplorer() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [tag, setTag] = useState<string>("All");
  const [evidence, setEvidence] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [selected, setSelected] = useState<Supplement | null>(null);

  const tagOptions = useMemo(getUniqueTags, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = SUPPLEMENTS.filter((s) => {
      if (
        q &&
        !s.commonName.toLowerCase().includes(q) &&
        !s.scientificName.toLowerCase().includes(q)
      )
        return false;
      if (category !== "All" && s.category !== category) return false;
      if (tag !== "All" && !s.tags.includes(tag)) return false;
      if (evidence !== "All" && s.evidenceLevel !== evidence) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "evidence":
          return EVIDENCE_RANK[b.evidenceLevel] - EVIDENCE_RANK[a.evidenceLevel];
        case "category":
          return a.category.localeCompare(b.category) || a.commonName.localeCompare(b.commonName);
        default:
          return a.commonName.localeCompare(b.commonName);
      }
    });

    return list;
  }, [search, category, tag, evidence, sortBy]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 py-4">
          <div className="flex min-w-48 flex-1 flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="supp-search">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="supp-search"
                placeholder="e.g. magnesium, ashwagandha"
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
            <span className="text-xs font-medium text-muted-foreground">Goal / effect</span>
            <Select value={tag} onValueChange={(v) => setTag(v ?? "All")}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All goals</SelectItem>
                {tagOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Research support</span>
            <Select value={evidence} onValueChange={(v) => setEvidence(v ?? "All")}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Any level</SelectItem>
                {EVIDENCE_LEVELS.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Sort by</span>
            <Select value={sortBy} onValueChange={(v) => setSortBy((v ?? "name") as SortKey)}>
              <SelectTrigger className="w-64">
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
        {filtered.length} of {SUPPLEMENTS.length} supplements
      </p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No supplements match those filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Card
              key={s.slug}
              className="h-full cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => setSelected(s)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{s.commonName}</CardTitle>
                  <Badge variant="secondary" className={categoryStyles[s.category]}>
                    {s.category}
                  </Badge>
                </div>
                <CardDescription className="italic">{s.scientificName}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="line-clamp-3 text-sm text-foreground/90">{s.description}</p>
                <div className="flex flex-wrap gap-1">
                  {s.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
                <Badge variant="secondary" className={evidenceStyles[s.evidenceLevel]}>
                  {s.evidenceLevel} research support
                </Badge>
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
                  <DialogTitle>{selected.commonName}</DialogTitle>
                  <Badge variant="secondary" className={categoryStyles[selected.category]}>
                    {selected.category}
                  </Badge>
                </div>
                <DialogDescription className="italic">{selected.scientificName}</DialogDescription>
              </DialogHeader>

              <p className="text-sm text-foreground/90">{selected.description}</p>

              <div className="flex flex-wrap items-center gap-1.5">
                {selected.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
                <Badge variant="secondary" className={evidenceStyles[selected.evidenceLevel]}>
                  {selected.evidenceLevel} research support
                </Badge>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CheckCircle2 className="size-3.5" /> Positive effects
                </span>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground/90">
                  {selected.positiveEffects.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-400">
                  <AlertTriangle className="size-3.5" /> Cautions &amp; risks
                </span>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-amber-900 dark:text-amber-300">
                  {selected.cautions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  General safe amount
                </span>
                <p className="text-sm text-foreground/90">{selected.typicalDose}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Research</span>
                <div className="flex flex-col gap-1">
                  {selected.researchLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5 shrink-0" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Informational only — not medical advice. Talk to a doctor or pharmacist before
                starting a new supplement, especially alongside medications or existing conditions.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
