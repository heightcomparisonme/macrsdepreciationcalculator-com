"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  MessageSquare,
  Shield,
  Bell,
  TrendingUp,
  Users,
  Trophy,
} from "lucide-react";

const featureIcons = {
  realTimeChat: MessageSquare,
  verifiedScripts: Shield,
  instantUpdates: Bell,
  tradingHub: TrendingUp,
  expertTips: Users,
  events: Trophy,
};

export default function CommunityFeatures() {
  const t = useTranslations("pages.discord.discord.features");

  const features = [
    { id: "realTimeChat", icon: featureIcons.realTimeChat },
    { id: "verifiedScripts", icon: featureIcons.verifiedScripts },
    { id: "instantUpdates", icon: featureIcons.instantUpdates },
    { id: "tradingHub", icon: featureIcons.tradingHub },
    { id: "expertTips", icon: featureIcons.expertTips },
    { id: "events", icon: featureIcons.events },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{t(`${feature.id}.title`)}</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t(`${feature.id}.description`)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}