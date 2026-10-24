import type { ComponentType } from "react";
import CalorieBreakdownArticle from "@/app/(app)/resources/articles/content/calorie-breakdown-throughout-the-day";

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
};

export type VideoResource = {
  title: string;
  description: string;
  url: string;
};

export type LinkResource = {
  title: string;
  description: string;
  url: string;
  source?: string;
};

export const articles: ArticleMeta[] = [
  {
    slug: "calorie-breakdown-throughout-the-day",
    title: "Where Your Daily Calories Actually Go",
    description:
      "A practical model for estimating total daily energy expenditure — resting metabolism, everyday movement, exercise, and digestion — instead of trusting a single number from your watch.",
    publishedAt: "2026-09-23",
    readTime: "6 min read",
    tags: ["Nutrition", "TDEE", "Fat Loss"],
  },
];

export const articleContent: Record<string, ComponentType> = {
  "calorie-breakdown-throughout-the-day": CalorieBreakdownArticle,
};

export const videos: VideoResource[] = [];

export const links: LinkResource[] = [
  {
    title: "Vigorous Exercise Delivers 4–9x the Health Impact of Moderate Activity",
    description:
      "Vigorous activity showed 4.1x the impact on all-cause mortality, 7.8x for heart disease, and 9.4x for type 2 diabetes compared to moderate activity, based on UK Biobank data — a case for a few genuinely hard efforts over padding out moderate-intensity minutes.",
    url: "https://www.youtube.com/watch?v=QnloZ45PVxQ",
    source: "YouTube · Dr. Brad Stanfield",
  },
  {
    title: "Exercise Variety Linked to 19% Lower Mortality Risk",
    description:
      "A 30-year Harvard T.H. Chan School study of 111,000+ people found that mixing exercise types — not just total activity time — was associated with a 19% lower risk of premature death. Published in BMJ Medicine.",
    url: "https://hsph.harvard.edu/news/exercise-variety-not-just-amount-linked-to-lower-risk-of-premature-mortality",
    source: "Harvard T.H. Chan School of Public Health",
  },
  {
    title: "A Few Minutes of Sprinting Reshapes Blood Chemistry More Than 90 Minutes of Cycling",
    description:
      "Six 30-second sprints altered nearly a quarter of measured blood proteins and 200+ metabolites — many linked to lower risk of obesity and type 2 diabetes — more than a much longer moderate session did.",
    url: "https://www.sciencedaily.com/releases/2026/08/260821012208.htm",
    source: "Science Daily",
  },
  {
    title: "2026 ACSM Worldwide Fitness Trends",
    description:
      "Traditional strength training and \"Fitness Programs for Older Adults\" rank among the top global trends for 2026, based on a survey of 2,000 fitness professionals — both centered on resistance training, balance, and mobility.",
    url: "https://acsm.org/top-fitness-trends-2026/",
    source: "American College of Sports Medicine",
  },
  {
    title: "Creatine May Build Muscle Even Without Exercise",
    description:
      "A 12-week study found adults aged 45-65 gained lean tissue and strength on creatine alone, with even greater gains when it was combined with resistance training and a calorie-reduced diet.",
    url: "https://www.sciencedaily.com/releases/2026/09/260928100547.htm",
    source: "Science Daily",
  },
  {
    title: "Blueberry Compound May Help Muscle Cells Burn Fat",
    description:
      "Pterostilbene, a compound in blueberries and grapes, reduced fat buildup in cultured muscle cells by stabilizing a protein that drives fat-burning. Early, cell-level research — not yet tested in humans.",
    url: "https://www.sciencedaily.com/releases/2026/09/260903064219.htm",
    source: "Science Daily",
  },
];

export function getArticle(slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.slug === slug);
}
