'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { TrendingUp, Star, Calculator, UserPlus, MousePointer, Mouse, LucideIcon } from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Calculator,
  UserPlus,
  MousePointer,
  Mouse,
  TrendingUp,
};

interface TrendingTool {
  title: string;
  url: string;
  icon: string;
  usageCount?: number;
}

interface TrendingToolsSidebarProps {
  tools: TrendingTool[];
  title?: string;
}

export function TrendingToolsSidebar({ tools, title = "Trending Tools" }: TrendingToolsSidebarProps) {
  return (
    <div className="space-y-4 sticky top-4">
      {/* Trending Tools Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <CardDescription className="text-xs">Most popular tools this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {tools.map((tool, index) => {
            const IconComponent = iconMap[tool.icon] || Calculator;
            return (
              <Link key={index} href={tool.url as any}>
                <div className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {tool.title}
                    </p>
                    {tool.usageCount && (
                      <p className="text-xs text-muted-foreground">
                        {tool.usageCount.toLocaleString()} uses
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0 text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      {/* Favorites hint */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Star your favorites</p>
            <p className="text-xs text-muted-foreground">
              Click the star icon on any tool to add it to your favorites
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
