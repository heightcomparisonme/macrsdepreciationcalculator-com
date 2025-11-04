import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ToolFeatures, type FeatureItem } from "./ToolFeatures";
import { ToolShowcase } from "./ToolShowcase";
import { ToolFAQ } from "./ToolFAQ";
import { ToolCTA } from "./ToolCTA";
import { ToolFeatures2, type Features2Item } from "./ToolFeatures2";
import { ToolPageHero } from "./ToolPageHero";
import ToolTestimonials from "./ToolTestimonials";

type SectionKey = "hero" | "features" | "showcase" | "features2" | "testimonials" | "faq" | "cta";

interface ToolPageLayoutProps {
  toolKey: string;
  calculator: ReactNode;
  features: FeatureItem[];
  features2: Features2Item[];
  containerClassName?: string;
  calculatorWrapperClassName?: string;
  sections?: Partial<Record<SectionKey, string>>;
  testimonialStats?: {
    modelsCreated?: string;
    averageRating?: string;
    successRate?: string;
    countriesServed?: string;
  };
  showTestimonials?: boolean;
}

export function ToolPageLayout({
  toolKey,
  calculator,
  features,
  features2,
  containerClassName,
  calculatorWrapperClassName,
  sections,
  testimonialStats,
  showTestimonials = true,
}: ToolPageLayoutProps) {
  const resolveNamespace = (section: SectionKey) =>
    sections?.[section] ?? `tools.${toolKey}.${section}`;

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-background via-muted/50 to-background", containerClassName)}>
      <div className="container mx-auto px-4 py-8">
        <ToolPageHero namespace={resolveNamespace("hero")} />

        <div className={cn("max-w-4xl mx-auto mb-16", calculatorWrapperClassName)}>
          {calculator}
        </div>

        <ToolFeatures namespace={resolveNamespace("features")} features={features} />
        <ToolShowcase namespace={resolveNamespace("showcase")} />
        <ToolFeatures2 namespace={resolveNamespace("features2")} items={features2} />
        {showTestimonials && (
          <ToolTestimonials toolKey={toolKey} stats={testimonialStats} />
        )}
        <ToolFAQ namespace={resolveNamespace("faq")} />
        <ToolCTA namespace={resolveNamespace("cta")} />
      </div>
    </div>
  );
}

export type { FeatureItem, Features2Item };
