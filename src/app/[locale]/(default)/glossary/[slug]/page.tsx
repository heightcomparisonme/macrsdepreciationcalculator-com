import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/glossary/${slug}?locale=${locale}`;

  if (process.env.SKIP_GLOSSARY_BUILD_FETCH === "1") {
    return {
      title: slug,
    };
  }

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        title: "Term Not Found",
      };
    }

    const data = await response.json();
    const termData = data.glossary_term_locale;

    return {
      title: termData?.seoTitle || termData?.title || slug,
      description: termData?.seoDescription || termData?.definition?.substring(0, 160),
    };
  } catch (error) {
    console.error("Glossary metadata fetch error:", error);
    return {
      title: "Term Not Found",
    };
  }
}

export default async function TermPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.glossary",
  });

  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/glossary/${slug}?locale=${locale}`;
  if (process.env.SKIP_GLOSSARY_BUILD_FETCH === "1") {
    notFound();
  }

  let data: any | null = null;

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      data = await response.json();
    } else {
      console.error("Glossary term fetch failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Glossary term fetch error:", error);
  }

  if (!data) {
    notFound();
  }

  const { glossary_term, glossary_term_locale } = data;

  const title = glossary_term_locale?.title || glossary_term?.slug;
  const definition = glossary_term_locale?.definition || "";
  const synonyms = glossary_term_locale?.synonyms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Button
            asChild
            variant="ghost"
            className="mb-8 hover:bg-accent/50"
          >
            <Link href={`/${locale}/glossary`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Glossary
            </Link>
          </Button>

          <article className="bg-card/50 backdrop-blur-sm rounded-xl border p-8 lg:p-12 shadow-sm">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {title}
              </h1>

              {synonyms && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground mb-6">
                  <span className="font-medium">{t("glossary.page.synonyms")}:</span>
                  <span>{synonyms}</span>
                </div>
              )}
            </div>

            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: definition }}
            />
          </article>

          <div className="mt-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Link
                  href={`/${locale}/glossary`}
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  View all terms
                </Link>
                <div className="flex gap-3">
                  <Button asChild variant="outline">
                    <Link href={`/${locale}/docs`}>
                      Browse Docs
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/community">Join our Community</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
