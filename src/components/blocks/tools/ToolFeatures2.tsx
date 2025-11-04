"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import BeforeAfterSlider from "@/components/ui/before-after-slider";
import {
  Calculator,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Shield,
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  Moon,
  CalendarDays,
  CloudSun,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  calculator: Calculator,
  trending: TrendingUp,
  target: Target,
  chart: BarChart3,
  zap: Zap,
  shield: Shield,
  users: Users,
  award: Award,
  check: CheckCircle2,
  sparkles: Sparkles,
  moon: Moon,
  calendar: CalendarDays,
  cloud: CloudSun,
};

export interface Features2Item {
  icon: keyof typeof ICON_MAP;
  key: string;
  beforeImage: string;
  afterImage: string;
}

interface ToolFeatures2Props {
  namespace: string;
  items: Features2Item[];
}

export function ToolFeatures2({ namespace, items }: ToolFeatures2Props) {
  const t = useTranslations(namespace);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (items.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 8000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [items]);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto grid gap-20 lg:grid-cols-2">
          <div
            className={`transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {t.has("label") && (
              <Badge
                className={`mb-6 text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-4 py-2 transition-opacity duration-500 ${
                  showContent ? "opacity-100" : "opacity-0"
                }`}
              >
                {t("label")}
              </Badge>
            )}
            <h2
              className={`mb-8 text-pretty text-4xl font-bold lg:text-5xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-opacity duration-500 delay-100 ${
                showContent ? "opacity-100" : "opacity-0"
              }`}
            >
              {t("title")}
            </h2>
            <p
              className={`mb-12 max-w-xl text-muted-foreground lg:max-w-none lg:text-xl leading-relaxed transition-opacity duration-500 delay-150 ${
                showContent ? "opacity-100" : "opacity-0"
              }`}
            >
              {t("description")}
            </p>

            <div className="space-y-6">
              {items.map((item, i) => {
                const IconComponent = ICON_MAP[item.icon];
                const isActive = activeIndex === i;
                const isHovered = hoveredIndex === i;
                return (
                  <button
                    type="button"
                    key={i}
                    id={`feature-item-${i}`}
                    className={`w-full text-left rounded-xl border px-6 py-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "border-primary/50 bg-primary/5 shadow-lg"
                        : isHovered
                        ? "border-primary/30 bg-primary/10 shadow"
                        : "border-border bg-card/80 hover:border-primary/30 hover:bg-card"
                    } ${showContent ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
                    style={{ transitionDelay: `${200 + i * 60}ms` }}
                    onClick={() => handleItemClick(i)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span
                        className={`flex size-10 items-center justify-center rounded-xl bg-muted transition-transform duration-300 ${
                          isActive || isHovered ? "scale-110 bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        <IconComponent className="size-5" />
                      </span>
                      <span
                        className={`font-semibold text-lg lg:text-xl transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-foreground"
                        } ${expandedIndex === i ? "" : "line-clamp-1"}`}
                      >
                        {t(`items.${item.key}.title`)}
                      </span>
                    </div>
                    <p
                      className={`ml-14 text-muted-foreground lg:text-lg transition-colors duration-300 ${
                        expandedIndex === i ? "" : "line-clamp-2"
                      } ${isActive ? "text-foreground/90" : ""}`}
                    >
                      {t(`items.${item.key}.description`)}
                    </p>
                    {isHovered && t.has("hover_tip") && (
                      <p className="mt-4 ml-14 text-sm text-foreground/80">
                        {t("hover_tip")}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {items.length > 1 && (
              <div
                className={`mt-10 flex justify-center gap-3 transition-opacity duration-500 delay-300 ${
                  showContent ? "opacity-100" : "opacity-0"
                }`}
              >
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`h-3 w-3 rounded-full transition-all duration-200 ${
                      activeIndex === i ? "bg-primary scale-125" : "bg-muted hover:bg-primary/60"
                    }`}
                    aria-label={`Switch to feature ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            className={`flex items-center justify-center transition-all duration-500 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {items[activeIndex] && (
              <BeforeAfterSlider
                beforeImage={items[activeIndex].beforeImage}
                afterImage={items[activeIndex].afterImage}
                beforeAlt={t.has("slider_before_alt") ? t("slider_before_alt") : "Before"}
                afterAlt={t.has("slider_after_alt") ? t("slider_after_alt") : "After"}
                className="w-full h-72 sm:h-80 lg:h-[500px] rounded-xl border border-border/60 bg-card shadow-lg"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
