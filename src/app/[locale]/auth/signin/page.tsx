import SignForm from "@/components/sign/form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAuthEnabled } from "@/lib/auth";
import Link from "next/link";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  if (!isAuthEnabled()) {
    return redirect("/");
  }

  const { callbackUrl } = await searchParams;
  const session = await auth();
  if (session) {
    // Check if user needs onboarding
    const checkResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/check-onboarding`, {
      cache: 'no-store'
    });
    const { needsOnboarding } = await checkResponse.json();

    if (needsOnboarding) {
      return redirect("/onboarding/step1");
    }

    return redirect(callbackUrl || "/");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border text-primary-foreground">
            <img src="/logo.png" alt="Mondkalender platform logo for artificial intelligence tools and applications" title="Mondkalender platform logo for artificial intelligence tools and applications" className="size-4" />
          </div>
          {process.env.NEXT_PUBLIC_PROJECT_NAME}
        </Link>
        <SignForm />
      </div>
    </div>
  );
}
