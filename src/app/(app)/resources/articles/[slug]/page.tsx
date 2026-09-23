import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { articleContent, articles, getArticle } from "@/lib/resources";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage(
  props: PageProps<"/resources/articles/[slug]">
) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  const Content = articleContent[slug];

  if (!article || !Content) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/resources"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Resources
      </Link>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="font-heading text-3xl font-semibold">{article.title}</h1>
        <p className="text-sm text-muted-foreground">
          {new Date(article.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {article.readTime}
        </p>
      </div>

      <article className="max-w-3xl">
        <Content />
      </article>
    </div>
  );
}
