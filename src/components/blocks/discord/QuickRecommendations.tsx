"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Code, Globe } from "lucide-react";

const recommendationIcons = {
  newPlayers: Users,
  scriptUsers: Code,
  international: Globe,
};

export default function QuickRecommendations() {
  const t = useTranslations("pages.discord.discord.recommendations");

  const recommendations = [
    {
      id: "newPlayers",
      icon: recommendationIcons.newPlayers,
      emoji: "🆕",
      link: "https://discord.gg/WEWMqwb5",
    },
    {
      id: "scriptUsers",
      icon: recommendationIcons.scriptUsers,
      emoji: "💻",
      link: "https://discord.gg/99nightsscripts",
    },
    {
      id: "international",
      icon: recommendationIcons.international,
      emoji: "🌍",
      link: "https://discord.gg/99nightsinternational",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto rounded-3xl border border-border/60 bg-muted/40 backdrop-blur-sm">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <span>🚀</span> {t("title")}
        </h2>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Card key={rec.id} className="text-center transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <span className="text-4xl">{rec.emoji}</span>
                </div>
                <h3 className="text-xl font-bold">{t(`${rec.id}.title`)}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t(`${rec.id}.description`)}
                </p>
                <Button asChild className="w-full">
                  <a href={rec.link} target="_blank" rel="noopener noreferrer">
                    {t(`${rec.id}.button`)}
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}