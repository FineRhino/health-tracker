export type SupplementCategory = "Vitamin" | "Mineral" | "Herb" | "Amino Acid" | "Other";
export type EvidenceLevel = "Strong" | "Moderate" | "Limited";

export interface ResearchLink {
  title: string;
  url: string;
}

export interface Supplement {
  slug: string;
  commonName: string;
  scientificName: string;
  category: SupplementCategory;
  tags: string[];
  description: string;
  positiveEffects: string[];
  cautions: string[];
  typicalDose: string;
  evidenceLevel: EvidenceLevel;
  researchLinks: ResearchLink[];
}

export const SUPPLEMENTS: Supplement[] = [
  {
    slug: "vitamin-d",
    commonName: "Vitamin D",
    scientificName: "Cholecalciferol (D3) / Ergocalciferol (D2)",
    category: "Vitamin",
    tags: ["Bone Health", "Immune Support", "Mood"],
    description:
      "A fat-soluble vitamin your body makes from sun exposure and that you get from fortified foods or supplements. Works with calcium to build and maintain bone, and supports immune and muscle function.",
    positiveEffects: [
      "Supports calcium absorption and bone mineralization",
      "Supports normal immune system function",
      "May support muscle function and reduce fall risk in older adults",
    ],
    cautions: [
      "Very high doses over time can cause calcium buildup in the blood (hypercalcemia) — nausea, weakness, kidney problems",
      "Can interact with steroids, weight-loss drugs (orlistat), and some cholesterol-lowering drugs",
      "Deficiency is common with limited sun exposure or darker skin, but more isn't automatically better",
    ],
    typicalDose:
      "600-800 IU (15-20 mcg)/day for most adults; many clinicians use 1,000-2,000 IU/day. Tolerable Upper Intake Level is 4,000 IU/day for adults.",
    evidenceLevel: "Strong",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Vitamin D Fact Sheet", url: "https://ods.od.nih.gov/factsheets/VitaminD-Consumer/" },
    ],
  },
  {
    slug: "vitamin-c",
    commonName: "Vitamin C",
    scientificName: "Ascorbic Acid",
    category: "Vitamin",
    tags: ["Immune Support", "Antioxidant", "Skin Health"],
    description:
      "A water-soluble antioxidant vitamin needed for collagen synthesis, wound healing, and iron absorption from plant foods. The body can't make or store it, so it needs to come from diet or supplements regularly.",
    positiveEffects: [
      "Supports collagen production for skin, tendons, and blood vessels",
      "Improves absorption of non-heme (plant-based) iron",
      "Acts as an antioxidant, protecting cells from free-radical damage",
      "Supports normal immune system function",
    ],
    cautions: [
      "Doses above ~2,000 mg/day can cause diarrhea, nausea, and stomach cramps",
      "High intakes may increase kidney stone risk in people prone to them",
      "Not shown to prevent colds, though it may modestly shorten their duration",
    ],
    typicalDose:
      "65-90 mg/day covers most adults; many supplements provide 500-1,000 mg/day, well above the Tolerable Upper Intake Level of 2,000 mg/day for extended use.",
    evidenceLevel: "Strong",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Vitamin C Fact Sheet", url: "https://ods.od.nih.gov/factsheets/VitaminC-Consumer/" },
    ],
  },
  {
    slug: "vitamin-b12",
    commonName: "Vitamin B12",
    scientificName: "Cobalamin (Cyanocobalamin / Methylcobalamin)",
    category: "Vitamin",
    tags: ["Energy", "Cognitive", "Nerve Health"],
    description:
      "An essential vitamin for red blood cell formation, DNA synthesis, and nerve function. Found almost exclusively in animal foods, which makes supplementation particularly relevant for vegans and vegetarians.",
    positiveEffects: [
      "Prevents megaloblastic anemia and supports healthy red blood cells",
      "Supports nerve cell health and normal neurological function",
      "Essential for vegans/vegetarians, who get little to none from diet",
    ],
    cautions: [
      "Considered very low-risk — no established Tolerable Upper Intake Level due to low toxicity",
      "Deficiency (not excess) is the main concern, especially in older adults or those on metformin or acid-reducing medications",
      "Injections or high-dose sublingual forms may be needed if poor absorption — not low intake — is the cause",
    ],
    typicalDose:
      "2.4 mcg/day for most adults; diagnosed deficiency is often treated with 500-1,000 mcg/day oral or periodic injections.",
    evidenceLevel: "Strong",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Vitamin B12 Fact Sheet", url: "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/" },
    ],
  },
  {
    slug: "vitamin-k",
    commonName: "Vitamin K (K1/K2)",
    scientificName: "Phylloquinone (K1) / Menaquinone (K2)",
    category: "Vitamin",
    tags: ["Bone Health", "Heart Health"],
    description:
      "A fat-soluble vitamin essential for blood clotting (K1, mainly from leafy greens) and increasingly studied for directing calcium into bone rather than arteries (K2, from fermented foods and some supplements).",
    positiveEffects: [
      "Essential cofactor for blood-clotting proteins",
      "May help direct calcium to bone and away from arterial walls, particularly the K2 (menaquinone) forms",
      "Often paired with vitamin D3 supplements for bone support",
    ],
    cautions: [
      "Can interfere with blood-thinning medications like warfarin — consult a doctor before supplementing if on anticoagulants",
      "Deficiency is rare in healthy adults eating a varied diet",
      "Long-term high-dose human safety data is more limited for K2 than K1",
    ],
    typicalDose:
      "90-120 mcg/day (K1) covers most adults' clotting needs; K2 supplements for bone/heart support are typically dosed 90-180 mcg/day, separate from the general RDA.",
    evidenceLevel: "Moderate",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Vitamin K Fact Sheet", url: "https://ods.od.nih.gov/factsheets/VitaminK-Consumer/" },
    ],
  },
  {
    slug: "magnesium",
    commonName: "Magnesium",
    scientificName: "Mg (elemental) — citrate, glycinate, oxide forms",
    category: "Mineral",
    tags: ["Sleep", "Muscle & Recovery", "Heart Health"],
    description:
      "An essential mineral involved in over 300 enzymatic reactions, including muscle and nerve function, blood sugar control, blood pressure regulation, and protein synthesis. Many people in the U.S. fall short of recommended intakes.",
    positiveEffects: [
      "Supports normal muscle and nerve function, which may help reduce cramps",
      "Involved in blood pressure and blood sugar regulation",
      "Some forms (e.g., glycinate) are commonly used to support sleep and relaxation",
    ],
    cautions: [
      "High doses from supplements (not food) can cause diarrhea, nausea, and abdominal cramping",
      "Very high intakes can be dangerous for people with kidney disease, since the kidneys clear excess magnesium",
      "Can reduce absorption of certain antibiotics — separate dosing by a few hours",
    ],
    typicalDose:
      "310-420 mg/day depending on age/sex; the Tolerable Upper Intake Level from supplements alone is 350 mg/day unless directed otherwise by a clinician.",
    evidenceLevel: "Strong",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Magnesium Fact Sheet", url: "https://ods.od.nih.gov/factsheets/Magnesium-Consumer/" },
    ],
  },
  {
    slug: "zinc",
    commonName: "Zinc",
    scientificName: "Zn (elemental) — gluconate, citrate, picolinate forms",
    category: "Mineral",
    tags: ["Immune Support", "Recovery"],
    description:
      "A trace mineral essential for immune function, wound healing, protein synthesis, and DNA synthesis. Also involved in testosterone metabolism, which has made it popular among strength athletes.",
    positiveEffects: [
      "Supports normal immune system function",
      "Involved in wound healing and protein synthesis",
      "May modestly shorten the duration of the common cold if taken within 24 hours of symptom onset",
    ],
    cautions: [
      "Excess zinc (often from long-term supplementation) can cause copper deficiency and impair immune function — the opposite of the intended effect",
      "Can cause nausea on an empty stomach",
      "High doses can interfere with antibiotic absorption",
    ],
    typicalDose:
      "8-11 mg/day for most adults; short-term cold-relief protocols use 75-100+ mg/day, well above the Tolerable Upper Intake Level of 40 mg/day for routine use.",
    evidenceLevel: "Moderate",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Zinc Fact Sheet", url: "https://ods.od.nih.gov/factsheets/Zinc-Consumer/" },
    ],
  },
  {
    slug: "iron",
    commonName: "Iron",
    scientificName: "Fe (elemental) — ferrous sulfate, ferrous gluconate",
    category: "Mineral",
    tags: ["Energy"],
    description:
      "A mineral essential for making hemoglobin, which carries oxygen in red blood cells. Needs vary significantly by sex, age, and diet — this is one supplement where testing before supplementing really matters.",
    positiveEffects: [
      "Corrects and prevents iron-deficiency anemia",
      "Supports oxygen transport and energy metabolism",
      "Particularly relevant for menstruating individuals, pregnant people, and plant-based eaters",
    ],
    cautions: [
      "Iron overload (hemochromatosis or simply over-supplementing) can damage the liver and other organs over time",
      "Common side effects include constipation and stomach upset",
      "Accidental overdose is a leading cause of fatal poisoning in young children — keep supplements secured",
      "Supplementing without a confirmed deficiency is not recommended",
    ],
    typicalDose:
      "8 mg/day for adult men and postmenopausal women; 18 mg/day for menstruating women. Therapeutic doses for diagnosed deficiency are higher and should be guided by bloodwork.",
    evidenceLevel: "Strong",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Iron Fact Sheet", url: "https://ods.od.nih.gov/factsheets/Iron-Consumer/" },
    ],
  },
  {
    slug: "calcium",
    commonName: "Calcium",
    scientificName: "Ca (elemental) — carbonate, citrate forms",
    category: "Mineral",
    tags: ["Bone Health"],
    description:
      "The most abundant mineral in the body, almost entirely stored in bones and teeth. Works alongside vitamin D and vitamin K for bone density and also plays a role in muscle contraction and nerve signaling.",
    positiveEffects: [
      "Builds and maintains bone density, reducing fracture/osteoporosis risk over time",
      "Supports normal muscle contraction and nerve transmission",
      "Most effective when paired with adequate vitamin D",
    ],
    cautions: [
      "High-dose supplements (not dietary calcium) have been linked in some studies to increased cardiovascular risk — evidence is mixed and debated",
      "Can cause constipation and bloating",
      "Interferes with absorption of iron and some thyroid medications when taken together — space doses apart",
    ],
    typicalDose:
      "1,000-1,200 mg/day total from food + supplements for most adults; avoid exceeding the Tolerable Upper Intake Level of 2,000-2,500 mg/day.",
    evidenceLevel: "Strong",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Calcium Fact Sheet", url: "https://ods.od.nih.gov/factsheets/Calcium-Consumer/" },
    ],
  },
  {
    slug: "ashwagandha",
    commonName: "Ashwagandha",
    scientificName: "Withania somnifera",
    category: "Herb",
    tags: ["Stress / Adaptogen", "Sleep", "Recovery"],
    description:
      'An evergreen shrub central to Ayurvedic medicine, classified as an "adaptogen." Modern interest centers on its withanolide compounds and their effects on stress hormones, sleep, and recovery.',
    positiveEffects: [
      "Some evidence for reduced perceived stress and anxiety",
      "May improve sleep quality, particularly in people with insomnia",
      "Limited evidence suggests modest increases in strength and testosterone in some studies",
    ],
    cautions: [
      "Avoid during pregnancy and breastfeeding",
      "Not recommended for people with autoimmune conditions, thyroid disorders, or those about to have surgery",
      "May interact with sedatives, thyroid medication, immunosuppressants, and diabetes/blood pressure medications",
      "Long-term safety (beyond ~3 months) is not well established",
    ],
    typicalDose:
      "300-600 mg/day of standardized root extract (often KSM-66 or Sensoril), typically split into 1-2 doses.",
    evidenceLevel: "Moderate",
    researchLinks: [
      { title: "NCCIH — Ashwagandha: Usefulness and Safety", url: "https://www.nccih.nih.gov/health/ashwagandha" },
    ],
  },
  {
    slug: "turmeric-curcumin",
    commonName: "Turmeric (Curcumin)",
    scientificName: "Curcuma longa",
    category: "Herb",
    tags: ["Joint Health", "Antioxidant"],
    description:
      "A bright yellow spice in the ginger family, used for centuries in traditional Chinese and Ayurvedic medicine. Curcumin, its most-studied compound, has poor natural bioavailability — many supplements add piperine (black pepper extract) to improve absorption.",
    positiveEffects: [
      "Some evidence for reduced joint pain and stiffness in osteoarthritis",
      "Anti-inflammatory and antioxidant properties shown in lab and some human studies",
      "Traditionally used for digestive complaints",
    ],
    cautions: [
      "NCCIH notes evidence is not yet strong enough to confirm benefit for any specific condition",
      "Highly bioavailable/concentrated curcumin formulations have been linked to rare cases of liver injury",
      "Can increase bleeding risk and interact with blood thinners",
      "May worsen gallbladder problems",
    ],
    typicalDose:
      "500-1,000 mg/day of curcumin extract (standardized to ~95% curcuminoids), often taken with piperine or a fat source to aid absorption.",
    evidenceLevel: "Limited",
    researchLinks: [
      { title: "NCCIH — Turmeric: Usefulness and Safety", url: "https://www.nccih.nih.gov/health/turmeric" },
    ],
  },
  {
    slug: "ginger",
    commonName: "Ginger",
    scientificName: "Zingiber officinale",
    category: "Herb",
    tags: ["Digestive Health", "Joint Health"],
    description:
      "A pungent, aromatic rhizome used throughout Asian traditional medicine and as a common kitchen spice. Best-supported for nausea relief, from motion sickness to pregnancy-related queasiness.",
    positiveEffects: [
      "Good evidence for relieving pregnancy-related nausea and vomiting (short-term use)",
      "May help with nausea from chemotherapy or surgery, though evidence is mixed",
      "Traditionally used for mild indigestion and joint/muscle discomfort",
    ],
    cautions: [
      "Mild side effects can include heartburn, abdominal discomfort, and diarrhea, especially at higher doses",
      "May increase bleeding risk at high doses when combined with blood thinners",
      "Generally well-tolerated across many studies",
    ],
    typicalDose:
      "250 mg, 3-4 times daily (around 1 g/day total) is a common regimen used in nausea studies; fresh or dried root in food works for mild use.",
    evidenceLevel: "Moderate",
    researchLinks: [
      { title: "NCCIH — Ginger: Usefulness and Safety", url: "https://www.nccih.nih.gov/health/ginger" },
    ],
  },
  {
    slug: "rhodiola-rosea",
    commonName: "Rhodiola Rosea",
    scientificName: "Rhodiola rosea",
    category: "Herb",
    tags: ["Stress / Adaptogen", "Energy", "Cognitive"],
    description:
      "A high-altitude flowering plant used in traditional Scandinavian and Russian medicine, marketed as an adaptogen for fatigue and stress resilience.",
    positiveEffects: [
      "Some studies suggest reduced fatigue and improved mental performance under stress",
      "Traditionally used to improve stress tolerance and physical endurance",
    ],
    cautions: [
      "NCCIH states there is insufficient reliable evidence to confirm benefit for any specific health purpose",
      "Possibly safe for up to 12 weeks; longer-term safety isn't well studied",
      "Mild side effects include dizziness, dry mouth, and insomnia, especially at higher doses",
      "May interact with losartan and other blood pressure medications",
    ],
    typicalDose:
      "200-600 mg/day of standardized extract (typically 3% rosavins, 1% salidroside), often taken in the morning due to mild stimulating effects.",
    evidenceLevel: "Limited",
    researchLinks: [
      { title: "NCCIH — Rhodiola: Usefulness and Safety", url: "https://www.nccih.nih.gov/health/rhodiola" },
    ],
  },
  {
    slug: "ginkgo-biloba",
    commonName: "Ginkgo Biloba",
    scientificName: "Ginkgo biloba",
    category: "Herb",
    tags: ["Cognitive"],
    description:
      "Extract from one of the oldest living tree species, long used in traditional Chinese medicine and widely marketed for memory and circulation, despite increasingly disappointing clinical trial results.",
    positiveEffects: [
      "Traditionally used for memory, circulation, and tinnitus",
      "Some older, smaller studies suggested modest cognitive benefits",
    ],
    cautions: [
      "Large, rigorous trials have NOT shown ginkgo prevents or slows cognitive decline or dementia",
      "Can increase bleeding risk, especially combined with blood thinners or before surgery",
      "Raw or roasted ginkgo seeds (not leaf extract) are toxic and should never be eaten",
      "Generally safe in moderate amounts as a standardized leaf-extract supplement",
    ],
    typicalDose: "120-240 mg/day of standardized leaf extract, split into 2-3 doses.",
    evidenceLevel: "Limited",
    researchLinks: [
      { title: "NCCIH — Ginkgo: Usefulness and Safety", url: "https://www.nccih.nih.gov/health/ginkgo" },
    ],
  },
  {
    slug: "echinacea",
    commonName: "Echinacea",
    scientificName: "Echinacea purpurea / E. angustifolia / E. pallida",
    category: "Herb",
    tags: ["Immune Support"],
    description:
      "A North American wildflower historically used by Indigenous peoples and now one of the most popular herbal supplements for preventing or shortening colds.",
    positiveEffects: [
      "Individual trials show positive but inconsistent trends for reducing cold duration/severity",
      "Widely used at the first sign of upper respiratory symptoms",
    ],
    cautions: [
      "NCCIH describes overall evidence for meaningful cold-treatment effects as weak",
      "Can cause allergic reactions, which may be severe in people allergic to ragweed, chrysanthemums, marigolds, or daisies",
      "Long-term use safety is not well established — typically used short-term at symptom onset",
    ],
    typicalDose:
      "300-500 mg of extract, 2-3 times daily, usually started at the first sign of cold symptoms and used for 7-10 days.",
    evidenceLevel: "Limited",
    researchLinks: [
      { title: "NCCIH — Echinacea: Usefulness and Safety", url: "https://www.nccih.nih.gov/health/echinacea" },
    ],
  },
  {
    slug: "l-theanine",
    commonName: "L-Theanine",
    scientificName: "N-ethyl-L-glutamine",
    category: "Amino Acid",
    tags: ["Stress / Adaptogen", "Cognitive", "Sleep"],
    description:
      'A naturally occurring amino acid found almost exclusively in tea leaves (Camellia sinensis). Known for promoting "calm focus" — increasing alpha brain wave activity associated with relaxed alertness without sedation.',
    positiveEffects: [
      "May reduce subjective stress and anxiety symptoms",
      "Often paired with caffeine to smooth out jitters while preserving alertness",
      "Some evidence for modestly improved sleep quality",
    ],
    cautions: [
      "Very well-tolerated with a strong safety profile in studies to date",
      "No major known drug interactions, though it may have mild blood-pressure-lowering effects",
      "Most research uses tea-derived or synthetic L-theanine in the 100-400 mg range — megadosing hasn't been well studied",
    ],
    typicalDose:
      "100-400 mg/day — often 100-200 mg paired with 50-100 mg caffeine for focus, or 200 mg before bed for relaxation.",
    evidenceLevel: "Moderate",
    researchLinks: [
      {
        title: "Systematic Review — L-Theanine for Managing Stress and Anxiety",
        url: "https://pubmed.ncbi.nlm.nih.gov/31758301/",
      },
    ],
  },
  {
    slug: "omega-3",
    commonName: "Omega-3 (Fish Oil)",
    scientificName: "Eicosapentaenoic acid (EPA) / Docosahexaenoic acid (DHA)",
    category: "Other",
    tags: ["Heart Health", "Cognitive", "Joint Health"],
    description:
      "Polyunsaturated fats (EPA and DHA from fish oil, ALA from plant sources) that the body can't produce efficiently on its own. Among the most-studied supplements for cardiovascular and anti-inflammatory support.",
    positiveEffects: [
      "Can lower triglyceride levels",
      "Supports cardiovascular health as part of an overall healthy diet",
      "May help reduce joint stiffness associated with inflammation",
      "DHA supports brain and eye development, especially during pregnancy",
    ],
    cautions: [
      "High doses can increase bleeding risk, especially alongside blood thinners like warfarin or aspirin",
      "Fishy aftertaste and mild GI upset are common, especially on an empty stomach",
      "Choose a third-party-tested brand — fish oil can carry contaminants if poorly sourced",
    ],
    typicalDose:
      "250-500 mg/day combined EPA+DHA for general health; 1,000-2,000+ mg/day is common for targeted triglyceride or joint support, typically under medical guidance.",
    evidenceLevel: "Strong",
    researchLinks: [
      { title: "NIH Office of Dietary Supplements — Omega-3 Fatty Acids Fact Sheet", url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/" },
    ],
  },
  {
    slug: "creatine-monohydrate",
    commonName: "Creatine (Monohydrate)",
    scientificName: "Creatine monohydrate (methylguanidinoacetic acid)",
    category: "Other",
    tags: ["Muscle & Recovery", "Energy"],
    description:
      "A compound stored in muscle that helps regenerate ATP during short, intense efforts. One of the most-researched and consistently effective supplements in sports nutrition — not a steroid or stimulant.",
    positiveEffects: [
      "Increases strength, power, and capacity for repeated short, intense efforts (sprinting, heavy lifting)",
      "Well-supported for supporting muscle mass gains when combined with resistance training",
      "Emerging evidence for cognitive benefits, especially under sleep deprivation",
    ],
    cautions: [
      "Causes water retention in muscle tissue, which shows up as a small amount of scale weight gain",
      "Generally considered safe for healthy adults at recommended doses, including long-term use",
      "Not shown to meaningfully benefit pure endurance activities like distance running",
      "People with pre-existing kidney disease should consult a doctor before use",
    ],
    typicalDose:
      "3-5 g/day of creatine monohydrate, taken consistently (timing doesn't matter much). Some protocols use a 20 g/day loading phase for 5-7 days first — not required, just faster saturation.",
    evidenceLevel: "Strong",
    researchLinks: [
      { title: "NIH ODS — Dietary Supplements for Exercise and Athletic Performance", url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/" },
    ],
  },
  {
    slug: "melatonin",
    commonName: "Melatonin",
    scientificName: "N-acetyl-5-methoxytryptamine",
    category: "Other",
    tags: ["Sleep"],
    description:
      "A hormone your brain naturally produces in response to darkness to regulate your sleep-wake cycle. Supplemental melatonin is mainly useful for shifting the timing of sleep, not as a general sedative.",
    positiveEffects: [
      "Can help with jet lag and shift-work-related circadian misalignment",
      "Useful for delayed sleep-wake phase disorder (shifting a late sleep schedule earlier)",
      "Some evidence for reducing pre- and post-surgery anxiety",
    ],
    cautions: [
      "Clinical guidelines generally recommend AGAINST using melatonin for chronic, ongoing insomnia",
      "Long-term safety data is limited",
      "Can cause grogginess, headache, or vivid dreams, especially at higher doses",
      "U.S. supplements are often sold in doses far higher than what's been studied as effective",
    ],
    typicalDose:
      "0.5-3 mg, taken 30-60 minutes before the targeted bedtime — lower doses are often just as effective as the 5-10 mg commonly sold.",
    evidenceLevel: "Moderate",
    researchLinks: [
      { title: "NCCIH — Melatonin: What You Need To Know", url: "https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know" },
    ],
  },
  {
    slug: "probiotics",
    commonName: "Probiotics",
    scientificName: "Varies by strain — e.g., Lactobacillus spp., Bifidobacterium spp.",
    category: "Other",
    tags: ["Digestive Health", "Immune Support"],
    description:
      'Live microorganisms intended to support a healthy gut microbiome, found in fermented foods, supplements, and some beauty products. Effects are highly strain-specific — "probiotics" as a category is too broad to generalize about.',
    positiveEffects: [
      "Some evidence for helping with acute infectious diarrhea and antibiotic-associated diarrhea",
      "May help with atopic eczema, particularly in infants",
      "Specific strains are studied for specific conditions — check that a product's strain matches your goal",
    ],
    cautions: [
      "The FDA has not approved any health claims for probiotics",
      "Safety data, especially for long-term use, is limited",
      "In 2023 the FDA warned that probiotics pose a risk of serious infection in premature infants — avoid in immunocompromised or critically ill people without medical guidance",
      "Generally low side-effect rate in healthy adults (mild gas/bloating is most common)",
    ],
    typicalDose:
      "Varies enormously by strain and product — typically 1-10 billion CFU/day, but effective dosing is specific to the studied strain and condition, not a one-size-fits-all number.",
    evidenceLevel: "Limited",
    researchLinks: [
      { title: "NCCIH — Probiotics: Usefulness and Safety", url: "https://www.nccih.nih.gov/health/probiotics-usefulness-and-safety" },
    ],
  },
];

export function getUniqueTags(): string[] {
  const set = new Set<string>();
  for (const s of SUPPLEMENTS) {
    for (const t of s.tags) set.add(t);
  }
  return Array.from(set).sort();
}

export const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  Strong: 3,
  Moderate: 2,
  Limited: 1,
};
