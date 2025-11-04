import { NextResponse } from "next/server";
import { db } from "@/db";
import { glossaryTerm, glossaryTermLocale } from "@/db/schema/glossary";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const term = await db()
      .select()
      .from(glossaryTerm)
      .where(eq(glossaryTerm.id, id))
      .limit(1);

    if (term.length === 0) {
      return NextResponse.json(
        { error: "Term not found" },
        { status: 404 }
      );
    }

    const locales = await db()
      .select()
      .from(glossaryTermLocale)
      .where(eq(glossaryTermLocale.termId, id));

    return NextResponse.json({
      ...term[0],
      locales,
    });
  } catch (error) {
    console.error("Error fetching glossary term:", error);
    return NextResponse.json(
      { error: "Failed to fetch glossary term" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { locale, title, definition, synonyms, seoTitle, seoDescription } = body;

    if (!locale) {
      return NextResponse.json(
        { error: "Locale is required" },
        { status: 400 }
      );
    }

    const existing = await db()
      .select()
      .from(glossaryTermLocale)
      .where(
        and(
          eq(glossaryTermLocale.termId, id),
          eq(glossaryTermLocale.locale, locale)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db()
        .update(glossaryTermLocale)
        .set({
          title,
          definition,
          synonyms: synonyms || null,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(glossaryTermLocale.termId, id),
            eq(glossaryTermLocale.locale, locale)
          )
        );
    } else {
      await db().insert(glossaryTermLocale).values({
        termId: id,
        locale,
        title,
        definition,
        synonyms: synonyms || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      });
    }

    await db()
      .update(glossaryTerm)
      .set({ updatedAt: new Date() })
      .where(eq(glossaryTerm.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating glossary term:", error);
    return NextResponse.json(
      { error: "Failed to update glossary term" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db().delete(glossaryTerm).where(eq(glossaryTerm.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting glossary term:", error);
    return NextResponse.json(
      { error: "Failed to delete glossary term" },
      { status: 500 }
    );
  }
}