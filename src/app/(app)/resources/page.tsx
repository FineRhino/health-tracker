import Link from "next/link";
import { FileText, Link2, Video } from "lucide-react";

import { articles, links, videos } from "@/lib/resources";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Resources</h1>
        <p className="text-sm text-muted-foreground">
          Articles, videos, and links worth keeping handy.
        </p>
      </div>

      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles">
            <FileText />
            Articles
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video />
            Videos
          </TabsTrigger>
          <TabsTrigger value="links">
            <Link2 />
            Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          {articles.length === 0 ? (
            <EmptyState label="No articles yet." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.slug} href={`/resources/articles/${article.slug}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <CardTitle>{article.title}</CardTitle>
                      <CardDescription>{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {article.readTime}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos">
          {videos.length === 0 ? (
            <EmptyState label="No videos yet." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <a key={video.url} href={video.url} target="_blank" rel="noreferrer">
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <CardTitle>{video.title}</CardTitle>
                      <CardDescription>{video.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="links">
          {links.length === 0 ? (
            <EmptyState label="No links yet." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <CardTitle>{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="py-8 text-center text-sm text-muted-foreground">
        {label}
      </CardContent>
    </Card>
  );
}
