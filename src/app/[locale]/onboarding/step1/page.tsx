"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Heart, Home, Briefcase } from "lucide-react";

const interests = [
  { id: "gardening", icon: Sprout, color: "text-green-600 bg-green-50 hover:bg-green-100 border-green-200" },
  { id: "health", icon: Heart, color: "text-red-600 bg-red-50 hover:bg-red-100 border-red-200" },
  { id: "housework", icon: Home, color: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200" },
  { id: "business", icon: Briefcase, color: "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200" }
];

export default function OnboardingStep1Page() {
  const t = useTranslations("pages.onboarding.step1");
  const tProgress = useTranslations("pages.onboarding.progress");
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    // Save interests to session storage for now
    sessionStorage.setItem("onboarding_interests", JSON.stringify(selectedInterests));
    router.push("/onboarding/step2");
  };

  const handleSkip = () => {
    router.push("/onboarding/step2");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {/* Progress Indicator */}
        <div className="text-center text-sm text-muted-foreground">
          {tProgress("step", { current: 1, total: 3 })}
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {interests.map(({ id, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => toggleInterest(id)}
                  className={`
                    flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all
                    ${selectedInterests.includes(id)
                      ? `${color} ring-2 ring-offset-2 ring-current`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <Icon className={`w-12 h-12 ${selectedInterests.includes(id) ? '' : 'text-gray-400'}`} />
                  <span className={`font-medium ${selectedInterests.includes(id) ? '' : 'text-gray-700'}`}>
                    {t(`interests.${id}`)}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 justify-between">
              <Button variant="outline" onClick={handleSkip}>
                {t("skip_button")}
              </Button>
              <Button onClick={handleNext} disabled={selectedInterests.length === 0}>
                {t("next_button")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
