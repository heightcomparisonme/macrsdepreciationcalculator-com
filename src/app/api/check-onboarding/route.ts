import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { needsOnboarding: false },
        { status: 200 }
      );
    }

    // Check if user has completed onboarding
    const [user] = await db
      .select({ onboarding_completed: users.onboarding_completed })
      .from(users)
      .where(eq(users.uuid, session.user.uuid))
      .limit(1);

    return NextResponse.json({
      needsOnboarding: !user?.onboarding_completed
    });
  } catch (error) {
    console.error("Check onboarding error:", error);
    return NextResponse.json(
      { needsOnboarding: false },
      { status: 500 }
    );
  }
}
