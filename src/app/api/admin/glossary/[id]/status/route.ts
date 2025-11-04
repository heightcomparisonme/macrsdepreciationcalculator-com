import { NextResponse } from "next/server";
import { db } from "@/db";
import { glossaryTerm } from "@/db/schema/glossary";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

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
    const { status } = body;

    if (!status || !["draft", "published"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    await db()
      .update(glossaryTerm)
      .set({ status, updatedAt: new Date() })
      .where(eq(glossaryTerm.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating glossary term status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}