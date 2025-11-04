"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ToolFAQProps {
  namespace: string; // e.g., "tools.roi.faq"
}

export function ToolFAQ({ namespace }: ToolFAQProps) {
  const t = useTranslations(namespace);

  const faqItems = t.raw("items") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <Badge className="inline-flex text-xs sm:text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 sm:py-2">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {t("title")}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
            {faqItems?.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg bg-card/80 px-4 sm:px-6 shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-primary/40"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6 text-base sm:text-lg font-semibold">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pb-4 sm:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {item.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
