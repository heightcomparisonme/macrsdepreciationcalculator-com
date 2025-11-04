"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ToolPlaceholderProps {
  className?: string;
  variant?: "default" | "gradient" | "minimal";
}

export default function ToolPlaceholder({
  className,
  variant = "gradient",
}: ToolPlaceholderProps) {
  const t = useTranslations("tools.example.placeholder");

  const variants = {
    default: "bg-gradient-to-br from-background via-muted/30 to-background",
    gradient: "bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10",
    minimal: "bg-background",
  };

  return (
    <Card className={cn("relative overflow-hidden border-2", variants[variant], className)}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <CardHeader className="relative border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t("title")}</h3>
              <Badge variant="secondary" className="mt-1">
                {t("badge")}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6 pt-6">
        {/* Main placeholder area */}
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/5 p-8">
          {/* Icon animation */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <div className="w-16 h-16 rounded-full bg-primary" />
            </div>
            <div className="relative p-4 rounded-full bg-primary/10 border-2 border-primary/20">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Description */}
          <div className="text-center space-y-2 max-w-md">
            <p className="text-muted-foreground">{t("description")}</p>
          </div>

          {/* Placeholder features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
            {[
              { label: t("features.0"), icon: "✨" },
              { label: t("features.1"), icon: "⚡" },
              { label: t("features.2"), icon: "🎯" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-4">
          <Button size="lg" className="group" disabled>
            {t("ctaText")}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("progressLabel")}</span>
            <span>{t("progressValue")}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: "75%" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
