"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ToolShowcaseProps {
  namespace: string; // e.g., "tools.roi.showcase"
}

export function ToolShowcase({ namespace }: ToolShowcaseProps) {
  const t = useTranslations(namespace);

  const benefits = t.raw("benefits") as Array<string>;
  const imageUrl = t("image_url");
  const imageAlt = t("image_alt");

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <Badge className="inline-flex text-xs sm:text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 px-4 py-1.5 sm:py-2 animate-float">
            {t("badge")}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {t("title")}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-12 lg:gap-16 md:grid-cols-2 items-center max-w-7xl mx-auto">
          {/* Benefits List */}
          <div className="space-y-8">
            {benefits?.map((benefit, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-xl border border-border bg-card/80 sm:bg-card/60 hover:bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-foreground group-hover:text-primary transition-colors duration-300 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          {/* Showcase Image */}
          <div className="animate-float-delayed">
            <Card className="overflow-hidden group border border-border bg-card/90">
              <CardContent className="p-0 aspect-video">
                <div className="relative aspect-video">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
