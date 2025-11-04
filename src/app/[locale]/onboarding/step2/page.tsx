"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OnboardingStep2Page() {
  const t = useTranslations("pages.onboarding.step2");
  const tProgress = useTranslations("pages.onboarding.progress");
  const router = useRouter();

  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Auto-detect timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(detectedTimezone);
  }, []);

  const handleBack = () => {
    router.push("/onboarding/step1");
  };

  const handleNext = async () => {
    // Save settings to session storage
    sessionStorage.setItem("onboarding_timezone", timezone);
    sessionStorage.setItem("onboarding_language", language);
    sessionStorage.setItem("onboarding_location", location);
    router.push("/onboarding/step3");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {/* Progress Indicator */}
        <div className="text-center text-sm text-muted-foreground">
          {tProgress("step", { current: 2, total: 3 })}
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mb-6">
              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone">{t("timezone_label")}</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder={t("timezone_auto_detected")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                    <SelectItem value="Asia/Shanghai">Asia/Shanghai</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                  </SelectContent>
                </Select>
                {timezone && (
                  <p className="text-xs text-muted-foreground">
                    {t("timezone_auto_detected")}: {timezone}
                  </p>
                )}
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">{t("language_label")}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">{t("location_label")}</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder={t("location_placeholder")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t("location_hint")}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-between">
              <Button variant="outline" onClick={handleBack}>
                {t("back_button")}
              </Button>
              <Button onClick={handleNext}>
                {t("next_button")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
