import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import GlossaryFilters from "@/components/admin/glossary/GlossaryFilters";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; status?: string; letter?: string }>;
}

export default async function AdminGlossaryPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({
    locale,
    namespace: "pages.glossary",
  });

  const queryParams = new URLSearchParams();
  queryParams.set("includeDrafts", "1");
  queryParams.set("limit", "500");
  queryParams.set("locale", locale);

  if (resolvedSearchParams.q) queryParams.set("q", resolvedSearchParams.q);
  if (resolvedSearchParams.status && resolvedSearchParams.status !== "all") {
    if (resolvedSearchParams.status === "published") {
      // Don't include drafts for published filter
      queryParams.delete("includeDrafts");
    } else if (resolvedSearchParams.status === "draft") {
      queryParams.set("status", "draft");
    }
  }
  if (resolvedSearchParams.letter && resolvedSearchParams.letter !== "all") {
    queryParams.set("letter", resolvedSearchParams.letter);
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/glossary?${queryParams}`;
  let items: any[] = [];

  if (process.env.SKIP_GLOSSARY_BUILD_FETCH === "1") {
    console.warn("Skipping admin glossary fetch during build phase");
  } else {
    try {
      const response = await fetch(apiUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const json = await response.json();
        items = json.items ?? [];
      } else {
        console.error("Admin glossary fetch failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Admin glossary fetch error:", error);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("glossary.admin.title")}</h1>
          <p className="text-muted-foreground">
            Manage glossary terms and definitions. {items.length} terms found.
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/glossary/new`}>
            <Plus className="h-4 w-4 mr-2" />
            {t("glossary.admin.newTerm")}
          </Link>
        </Button>
      </div>

      <GlossaryFilters locale={locale} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Letter</TableHead>
              <TableHead>{t("glossary.admin.slug")}</TableHead>
              <TableHead>{t("glossary.admin.termTitle")}</TableHead>
              <TableHead className="w-[120px]">{t("glossary.admin.status")}</TableHead>
              <TableHead className="w-[140px]">{t("glossary.admin.updated")}</TableHead>
              <TableHead className="text-right w-[200px]">{t("glossary.admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((term: any) => (
              <TableRow key={term.id} className="hover:bg-muted/50">
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {term.firstLetter}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm max-w-[200px] truncate">
                  {term.slug}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <div>
                    <div className="font-medium truncate">
                      {term.title || "-"}
                    </div>
                    {term.definition && (
                      <div
                        className="text-xs text-muted-foreground line-clamp-1"
                        dangerouslySetInnerHTML={{
                          __html: term.definition.substring(0, 100) + "...",
                        }}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={term.status === "published" ? "default" : "secondary"}
                  >
                    {term.status === "published"
                      ? t("glossary.admin.published")
                      : t("glossary.admin.draft")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(term.updatedAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                    >
                      <Link href={`/${locale}/glossary/${term.slug}`} target="_blank">
                        View
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                    >
                      <Link href={`/${locale}/admin/glossary/${term.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        {t("glossary.admin.edit")}
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No glossary terms yet. Create your first term to get started.
        </div>
      )}
    </div>
  );
}
