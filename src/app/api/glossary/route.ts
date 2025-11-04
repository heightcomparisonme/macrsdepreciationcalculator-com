import { NextResponse } from "next/server";
import { db } from "@/db";
import { glossaryTerm, glossaryTermLocale } from "@/db/schema/glossary";
import { and, eq, sql, asc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const letter = searchParams.get("letter");
    const q = searchParams.get("q");
    const locale = searchParams.get("locale") ?? "en";
    const includeDrafts = searchParams.get("includeDrafts") === "1";
    const limit = parseInt(searchParams.get("limit") || "200");

    const conditions: unknown[] = [];

    if (!includeDrafts) {
      conditions.push(eq(glossaryTerm.status, "published"));
    }

    if (letter) {
      if (letter === "#") {
        conditions.push(sql`NOT (${glossaryTerm.firstLetter} ~ '^[A-Za-z]$')`);
      } else {
        conditions.push(eq(glossaryTerm.firstLetter, letter.toUpperCase()));
      }
    }

    // Combine all conditions
    const allConditions = [...conditions];
    if (q) {
      allConditions.push(
        sql`${glossaryTermLocale.title} ILIKE ${`%${q}%`} OR ${glossaryTermLocale.definition} ILIKE ${`%${q}%`}`
      );
    }

    const query = db()
      .select({
        id: glossaryTerm.id,
        slug: glossaryTerm.slug,
        firstLetter: glossaryTerm.firstLetter,
        status: glossaryTerm.status,
        createdAt: glossaryTerm.createdAt,
        updatedAt: glossaryTerm.updatedAt,
        title: glossaryTermLocale.title,
        definition: glossaryTermLocale.definition,
        synonyms: glossaryTermLocale.synonyms,
      })
      .from(glossaryTerm)
      .leftJoin(
        glossaryTermLocale,
        and(
          eq(glossaryTermLocale.termId, glossaryTerm.id),
          eq(glossaryTermLocale.locale, locale)
        )
      )
      .where(allConditions.length > 0 ? and(...allConditions) : undefined);

    const items = await query
      .orderBy(asc(glossaryTerm.firstLetter), asc(glossaryTerm.slug))
      .limit(limit);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching glossary terms:", error);
    return NextResponse.json(
      { error: "Failed to fetch glossary terms" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, status = "draft", locales = [] } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const firstLetter = /^[a-z]/i.test(cleanSlug)
      ? cleanSlug[0].toUpperCase()
      : "#";

    const [newTerm] = await db()
      .insert(glossaryTerm)
      .values({
        slug: cleanSlug,
        firstLetter,
        status,
      })
      .returning();

    if (locales.length > 0) {
      await db().insert(glossaryTermLocale).values(
        locales.map((l: {locale: string; title: string; definition: string; synonyms?: string | null; seoTitle?: string | null; seoDescription?: string | null}) => ({
          termId: newTerm.id,
          locale: l.locale,
          title: l.title,
          definition: l.definition,
          synonyms: l.synonyms || null,
          seoTitle: l.seoTitle || null,
          seoDescription: l.seoDescription || null,
        }))
      );
    }

    return NextResponse.json({ termId: newTerm.id, slug: cleanSlug });
  } catch (error) {
    console.error("Error creating glossary term:", error);
    return NextResponse.json(
      { error: "Failed to create glossary term" },
      { status: 500 }
    );
  }
}