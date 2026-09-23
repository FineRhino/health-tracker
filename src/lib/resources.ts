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

export const links: LinkResource[] = [];

export function getArticle(slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.slug === slug);
}
