import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { interests, timezone, language, location, selectedPlan } = await req.json();

    // Update user with onboarding data
    await db
      .update(users)
      .set({
        interests: interests ? JSON.stringify(interests) : null,
        timezone: timezone || null,
        locale: language || null,
        region: location || null,
        onboarding_completed: true,
        updated_at: new Date()
      })
      .where(eq(users.uuid, session.user.uuid));

    return NextResponse.json({
      success: true,
      selectedPlan
    });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
