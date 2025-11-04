import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import AlphabetNav from "@/components/glossary/AlphabetNav";
import QuickSearch from "@/components/glossary/QuickSearch";
import RecentPosts from "@/components/glossary/RecentPosts";
import JoinCommunity from "@/components/glossary/JoinCommunity";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ letter?: string; q?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.glossary",
  });

  return {
    title: t("glossary.metadata.title"),
    description: t("glossary.metadata.description"),
  };
}

export default async function GlossaryPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.glossary",
  });

  const resolvedSearchParams = await searchParams;
  const letter = resolvedSearchParams.letter || undefined;
  const q = resolvedSearchParams.q || undefined;

  const queryParams = new URLSearchParams();
  if (letter) queryParams.set("letter", letter);
  if (q) queryParams.set("q", q);
  queryParams.set("locale", locale);

  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/glossary?${queryParams}`;
  let items: any[] = [];

  if (process.env.SKIP_GLOSSARY_BUILD_FETCH === "1") {
    // Avoid network calls during static builds
    console.warn("Skipping glossary fetch during build phase");
  } else {
    try {
      const response = await fetch(apiUrl, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const json = await response.json();
        items = json.items ?? [];
      } else {
        console.error("Glossary fetch failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Glossary fetch error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("glossary.page.title")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t("glossary.page.subtitle")}
              </p>
              {items.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {items.length} terms found
                  {(letter || q) && (
                    <>
                      {letter && ` • Filtered by "${letter}"`}
                      {q && ` • Search: "${q}"`}
                    </>
                  )}
                </p>
              )}
            </div>

            <AlphabetNav active={letter} baseUrl={`/${locale}/glossary`} />

            <div className="space-y-1">
              {items.map((item: any) => (
                <article
                  key={item.slug}
                  className="group p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-md transition-all duration-200"
                  id={item.slug}
                >
                  <Link
                    href={`/${locale}/glossary/${item.slug}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {item.title || item.slug}
                      </h2>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0 ml-4">
                        {item.firstLetter}
                      </span>
                    </div>
                    <p
                      className="text-muted-foreground line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{
                        __html: item.definition || "",
                      }}
                    />
                    <span className="text-primary text-sm font-medium group-hover:underline inline-flex items-center gap-1">
                      {t("glossary.page.readMore")}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </Link>
                </article>
              ))}

              {items.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("glossary.page.noResults")}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {q || letter
                      ? "Try adjusting your search or filter criteria"
                      : "No glossary terms have been added yet"}
                  </p>
                  {(q || letter) && (
                    <Link
                      href={`/${locale}/glossary`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View All Terms
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              <Suspense
                fallback={
                  <div className="rounded-xl border bg-card p-4 h-32 animate-pulse" />
                }
              >
                <QuickSearch locale={locale} />
              </Suspense>
              <Suspense
                fallback={
                  <div className="rounded-xl border bg-card p-4 h-32 animate-pulse" />
                }
              >
                <RecentPosts limit={5} locale={locale} />
              </Suspense>
              <JoinCommunity />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
