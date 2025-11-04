"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ToolPageHeroProps {
  namespace: string; // e.g., "tools.roi.hero"
  showCTA?: boolean; // Whether to show CTA buttons
}

export function ToolPageHero({ namespace, showCTA = false }: ToolPageHeroProps) {
  const t = useTranslations(namespace);

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-10">
          {/* Badge */}
          {t.has("badge") && (
            <div className="flex justify-center">
              <Badge className="relative text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white drop-shadow-2xl border border-primary/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full animate-float shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm -z-10 animate-pulse" />
                <span className="relative z-10">{t("badge")}</span>
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent leading-tight sm:leading-tight">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed sm:leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Description (optional) */}
          {t.has("description") && (
            <p className="text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          )}

          {/* CTA Buttons */}
          {showCTA && t.has("cta_primary") && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button size="lg" className="group px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
                {t("cta_primary")}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              {t.has("cta_secondary") && (
                <Button size="lg" variant="outline" className="px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold border-border/50 bg-card/80 sm:bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300">
                  {t("cta_secondary")}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
