"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Shield,
  Users,
  Award,
  Sparkles,
  Moon,
  CalendarDays,
  CloudSun,
  Sunrise,
  Check,
  Globe,
  type LucideIcon,
} from "lucide-react";

// Icon mapping - all available icons
const ICON_MAP: Record<string, LucideIcon> = {
  calculator: Calculator,
  trending: TrendingUp,
  target: Target,
  chart: BarChart3,
  zap: Zap,
  shield: Shield,
  users: Users,
  award: Award,
  sparkles: Sparkles,
  moon: Moon,
  calendar: CalendarDays,
  cloud: CloudSun,
  sunrise: Sunrise,
  check: Check,
  globe: Globe,
};

export interface FeatureItem {
  icon: keyof typeof ICON_MAP; // Icon name from the map
  key: string; // The nested object key, e.g., "calculate", "optimize"
  color: string;
}

interface ToolFeaturesProps {
  namespace: string; // e.g., "tools.roi.features"
  features: FeatureItem[];
}

export function ToolFeatures({ namespace, features }: ToolFeaturesProps) {
  const t = useTranslations(namespace);

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {t("title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = ICON_MAP[feature.icon];
            return (
              <Card key={index} className="group text-center hover:shadow-xl transition-all duration-300 border-border bg-card/80 sm:bg-card/90 backdrop-blur-sm hover:-translate-y-1 sm:hover:-translate-y-2">
                <CardHeader className="pb-3 sm:pb-4 space-y-4 sm:space-y-6">
                  <div className="mx-auto p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors duration-300">
                    {t(`${feature.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {t(`${feature.key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
