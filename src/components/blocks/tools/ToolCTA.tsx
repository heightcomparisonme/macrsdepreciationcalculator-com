"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ToolCTAProps {
  namespace: string; // e.g., "tools.roi.cta"
}

export function ToolCTA({ namespace }: ToolCTAProps) {
  const t = useTranslations(namespace);

  const primaryLink = t("primary_link");
  const secondaryLink = t("secondary_link");

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {t("title")}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="group h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href={primaryLink}>
                {t("primary_button")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="h-12 sm:h-14 px-6 sm:px-8 border hover:bg-primary/5 transition-all duration-300"
            >
              <Link href={secondaryLink}>
                {t("secondary_button")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
