'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Star, ArrowRight, ArrowUpRight, Calculator, UserPlus, MousePointer, Mouse, TrendingUp, LucideIcon } from "lucide-react";
import { useState } from "react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Calculator,
  UserPlus,
  MousePointer,
  Mouse,
  TrendingUp,
};

interface ToolCardProps {
  title: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export function ToolCard({
  title,
  description,
  url,
  icon,
  color,
  isFavorite = false,
  onFavoriteToggle
}: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[icon] || Calculator;

  return (
    <Card
      className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onFavoriteToggle?.();
        }}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-200 ${
          isFavorite
            ? 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
            : 'text-muted-foreground/40 hover:text-yellow-500 hover:bg-yellow-500/10'
        }`}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <Link href={url as any} className="block relative">
        {/* Corner external arrow (inside card) */}
        <div className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-80'}`}>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>

        <CardHeader className="pb-3 pr-8">
          {/* Icon with gradient background */}
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <IconComponent className="w-7 h-7 text-white" />
          </div>

          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 break-words">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-4">
          <CardDescription className="text-sm leading-relaxed line-clamp-3 text-muted-foreground break-words">
            {description}
          </CardDescription>

          {/* View Tool button - shows on hover */}
          <div className={`mt-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-primary hover:bg-primary/10 group/btn"
            >
              <span>View Tool</span>
              <ArrowRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
