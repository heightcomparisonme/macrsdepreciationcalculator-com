"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function OnboardingStep3Page() {
  const t = useTranslations("pages.onboarding.step3");
  const tProgress = useTranslations("pages.onboarding.progress");
  const router = useRouter();

  const handleBack = () => {
    router.push("/onboarding/step2");
  };

  const handleSelectPlan = async (plan: "free" | "premium" | "lifetime") => {
    // Get data from session storage
    const interests = sessionStorage.getItem("onboarding_interests");
    const timezone = sessionStorage.getItem("onboarding_timezone");
    const language = sessionStorage.getItem("onboarding_language");
    const location = sessionStorage.getItem("onboarding_location");

    // Save to database via API
    try {
      const response = await fetch("/api/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: interests ? JSON.parse(interests) : [],
          timezone,
          language,
          location,
          selectedPlan: plan
        })
      });

      if (response.ok) {
        // Clear session storage
        sessionStorage.removeItem("onboarding_interests");
        sessionStorage.removeItem("onboarding_timezone");
        sessionStorage.removeItem("onboarding_language");
        sessionStorage.removeItem("onboarding_location");

        // Redirect based on plan selection
        if (plan === "free") {
          router.push("/");
        } else {
          // Redirect to checkout for paid plans
          router.push(`/pricing?plan=${plan}`);
        }
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const plans = [
    {
      id: "free",
      features: t.raw("free_plan.features") as string[]
    },
    {
      id: "premium",
      features: t.raw("premium_plan.features") as string[]
    },
    {
      id: "lifetime",
      features: t.raw("lifetime_plan.features") as string[]
    }
  ];

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        {/* Progress Indicator */}
        <div className="text-center text-sm text-muted-foreground">
          {tProgress("step", { current: 3, total: 3 })}
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>{t("free_plan.title")}</CardTitle>
              <CardDescription>{t("free_plan.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plans[0].features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSelectPlan("free")}
              >
                {t("free_plan.button")}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Popular
            </div>
            <CardHeader>
              <CardTitle>{t("premium_plan.title")}</CardTitle>
              <div className="text-2xl font-bold">{t("premium_plan.price")}</div>
              <CardDescription>{t("premium_plan.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plans[1].features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handleSelectPlan("premium")}
              >
                {t("premium_plan.button")}
              </Button>
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>{t("lifetime_plan.title")}</CardTitle>
              <div className="text-2xl font-bold">{t("lifetime_plan.price")}</div>
              <CardDescription>{t("lifetime_plan.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plans[2].features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="default"
                className="w-full"
                onClick={() => handleSelectPlan("lifetime")}
              >
                {t("lifetime_plan.button")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={handleBack}>
            {t("back_button")}
          </Button>
        </div>
      </div>
    </div>
  );
}
