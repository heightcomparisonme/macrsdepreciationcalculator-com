"use client";

import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import BeforeAfterSlider from "@/components/ui/before-after-slider";
import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

export default function Feature2({ section }: { section: SectionType }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Progressive content display
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotation feature (optional)
  useEffect(() => {
    if (section.items && section.items.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % (section.items?.length || 1));
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [section.items]);

  if (section.disabled) {
    return null;
  }

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    setExpandedIndex((prev) => (prev === index ? null : index));
    // Add click feedback
    const element = document.getElementById(`feature-item-${index}`);
    if (element) {
      element.style.transform = "scale(0.95)";
      setTimeout(() => {
        element.style.transform = "scale(1)";
      }, 150);
    }
  };

  return (
    <section id={section.name} className="py-32">
      <div className="container">
        <div className="mx-auto grid gap-20 lg:grid-cols-2">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {section.label && (
              <Badge 
                variant="outline" 
                className={`mb-4 transition-all duration-700 delay-200 ${showContent ? "opacity-100" : "opacity-0"}`}
              >
                {section.label}
              </Badge>
            )}
            <h2 className={`mb-6 text-pretty text-3xl font-bold lg:text-4xl transition-all duration-700 delay-300 ${showContent ? "opacity-100" : "opacity-0"}`}>
              {section.title}
            </h2>
            <p className={`mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg transition-all duration-700 delay-400 ${showContent ? "opacity-100" : "opacity-0"}`}>
              {section.description}
            </p>
            
            {/* Feature List */}
            <div className="space-y-6">
              {section.items?.map((item, i) => (
                <div
                  key={i}
                  id={`feature-item-${i}`}
                  className={`group p-4 rounded-lg border cursor-pointer transition-all duration-500 ease-out transform hover:scale-[1.02] overflow-hidden ${
                    activeIndex === i
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                      : hoveredIndex === i
                      ? "border-primary/70 bg-primary/5 shadow-md"
                      : "border-muted bg-background hover:border-primary/50"
                  } ${showContent ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                  style={{
                    transitionDelay: `${500 + i * 100}ms`,
                    transform: hoveredIndex === i ? "translateY(-2px)" : "translateY(0)"
                  }}
                  onClick={() => handleItemClick(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {item.icon && (
                      <div className={`flex size-8 items-center justify-center rounded-lg transition-all duration-300 ${
                        activeIndex === i 
                          ? "bg-primary text-primary-foreground scale-110" 
                          : hoveredIndex === i
                          ? "bg-primary/20 text-primary scale-105"
                          : "bg-muted"
                      }`}>
                        <Icon
                          name={item.icon}
                          className={`size-4 transition-all duration-300 ${
                            activeIndex === i || hoveredIndex === i ? "rotate-12" : ""
                          }`}
                        />
                      </div>
                    )}
                    <h3 className={`font-semibold lg:text-lg transition-all duration-300 ${
                      expandedIndex === i ? "" : "line-clamp-1 group-hover:line-clamp-none"
                    } ${
                      activeIndex === i ? "text-primary" : hoveredIndex === i ? "text-primary/80" : ""
                    }`}>
                      {item.title}
                    </h3>
                    {/* Active state indicator */}
                    {activeIndex === i && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  <p className={`text-muted-foreground text-sm lg:text-base ml-11 transition-all duration-300 ${
                    expandedIndex === i ? "" : "line-clamp-2 group-hover:line-clamp-none"
                  }`} aria-expanded={expandedIndex === i}
                  >
                    {item.description}
                  </p>
                  
                  {/* Hover hint for additional information */}
                  {hoveredIndex === i && (
                    <div className="mt-3 ml-11 p-2 bg-muted/50 rounded text-xs text-muted-foreground animate-in slide-in-from-top-2 duration-200">
                      Click to see the comparison
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress indicator */}
            {section.items && section.items.length > 1 && (
              <div className={`mt-8 flex justify-center gap-2 transition-all duration-700 delay-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
                {section.items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeIndex === i
                        ? "bg-primary scale-125"
                        : "bg-muted hover:bg-primary/50 hover:scale-110"
                    }`}
                    aria-label={`Switch to feature ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Before/After Slider */}
          <div className={`flex items-center justify-center transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {section.items && section.items[activeIndex] && (
              <div className="relative group">
                <BeforeAfterSlider
                  beforeImage={section.items[activeIndex].image?.src || ""}
                  afterImage={section.items[activeIndex].afterImage?.src || section.items[activeIndex].image?.src || ""}
                  beforeAlt="Before"
                  afterAlt="After"
                  className="w-full h-96 lg:h-[500px] transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]"
                />
                
                {/* Hover operation hint - positioned to not block interaction */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-sm">
                  <div className="text-center">
                    <p className="font-semibold">Drag to Compare</p>
                    <p className="text-xs opacity-90 mt-1">Use the slider to see before and after</p>
                  </div>
                </div>

                {/* Current feature label */}
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-in slide-in-from-top-2 duration-300">
                  {section.items[activeIndex].title}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
