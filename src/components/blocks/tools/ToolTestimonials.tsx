"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useMessages } from "next-intl";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

interface ToolTestimonialsProps {
  toolKey: string;
  stats?: {
    modelsCreated?: string;
    averageRating?: string;
    successRate?: string;
    countriesServed?: string;
  };
}

export default function ToolTestimonials({
  toolKey,
  stats,
}: ToolTestimonialsProps) {
  const t = useTranslations(`tools.${toolKey}`);
  const messages = useMessages() as any;
  const plugin = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
    })
  );

  // Default stats if not provided
  const defaultStats = {
    modelsCreated: "25,000+",
    averageRating: "4.9/5",
    successRate: "99%",
    countriesServed: "80+",
  };

  const displayStats = { ...defaultStats, ...stats };

  // Get testimonials from translations safely
  const testimonials: Testimonial[] = [];
  const toolMessages = messages?.tools?.[toolKey]?.testimonials?.items;
  
  if (Array.isArray(toolMessages)) {
    toolMessages.forEach((item: any, index: number) => {
      if (item && item.name && item.quote) {
        testimonials.push({
          name: item.name,
          role: item.role || "",
          avatar: item.avatar || "",
          quote: item.quote,
          rating: parseInt(item.rating || "5"),
        });
      }
    });
  }

  // Don't render if no testimonials
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="container py-16 lg:py-24">
      <div className="flex flex-col items-center gap-6">
        {/* Title */}
        <h2 className="text-center text-3xl font-bold lg:text-4xl">
          {t("testimonials.title")}
        </h2>
        
        {/* Description */}
        <p className="text-center text-muted-foreground lg:text-lg max-w-2xl">
          {t("testimonials.description")}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8 w-full max-w-4xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {displayStats.modelsCreated}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("testimonials.stats.modelsCreated")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {displayStats.averageRating}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("testimonials.stats.averageRating")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {displayStats.successRate}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("testimonials.stats.successRate")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {displayStats.countriesServed}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("testimonials.stats.countriesServed")}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="lg:container mt-16">
        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[plugin.current]}
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
          className="relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-10 before:w-20 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:bottom-0 after:right-0 after:top-0 after:z-10 after:w-20 after:bg-gradient-to-l after:from-background after:to-transparent"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, idx) => (
              <CarouselItem
                key={idx}
                className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full select-none p-6 hover:shadow-lg transition-shadow duration-300">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex gap-3 items-center border-t pt-4">
                    <Avatar className="size-12 ring-2 ring-border">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
