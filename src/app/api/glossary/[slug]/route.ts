import { NextResponse } from "next/server";
import { db } from "@/db";
import { glossaryTerm, glossaryTermLocale } from "@/db/schema/glossary";
import { and, eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    const result = await db()
      .select({
        glossary_term: glossaryTerm,
        glossary_term_locale: glossaryTermLocale,
      })
      .from(glossaryTerm)
      .leftJoin(
        glossaryTermLocale,
        and(
          eq(glossaryTermLocale.termId, glossaryTerm.id),
          eq(glossaryTermLocale.locale, locale)
        )
      )
      .where(eq(glossaryTerm.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Term not found" },
        { status: 404 }
      );
    }

    const term = result[0];

    if (term.glossary_term.status !== "published") {
      const isAdmin = request.headers.get("x-admin") === "true";
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Term not published" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(term);
  } catch (error) {
    console.error("Error fetching glossary term:", error);
    return NextResponse.json(
      { error: "Failed to fetch glossary term" },
      { status: 500 }
    );
  }
}