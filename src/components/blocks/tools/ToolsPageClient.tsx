'use client';

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ToolCard } from "@/components/blocks/tools/ToolCard";
import { TrendingToolsSidebar } from "@/components/blocks/tools/TrendingToolsSidebar";
import { ToolsSearch } from "@/components/blocks/tools/ToolsSearch";
import { ToolsPagination } from "@/components/blocks/tools/ToolsPagination";

const ITEMS_PER_PAGE = 12;

interface Tool {
  title: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  category?: string;
  tags?: string[];
}

interface TrendingTool {
  title: string;
  url: string;
  icon: string;
  usageCount: number;
}

interface ToolsPageClientProps {
  allTools: Tool[];
  trendingTools: TrendingTool[];
}

export default function ToolsPageClient({ allTools, trendingTools }: ToolsPageClientProps) {
  const t = useTranslations("pages.tools");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return allTools;

    const query = searchQuery.toLowerCase();
    return allTools.filter((tool) => {
      const searchableText = [
        tool.title,
        tool.description,
        tool.category,
        ...(tool.tags || [])
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery, allTools]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTools = filteredTools.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const toggleFavorite = (url: string) => {
    setFavorites((prev) =>
      prev.includes(url) ? prev.filter((f) => f !== url) : [...prev, url]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <ToolsSearch
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t("search_placeholder")}
          />
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Tools Grid - Main Content */}
          <div className="lg:col-span-9">
            {/* Results count */}
            {searchQuery && (
              <div className="mb-4 text-sm text-muted-foreground">
                {t("results_found", { count: filteredTools.length, query: searchQuery })}
              </div>
            )}

            {/* Tools Grid */}
            {currentTools.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {currentTools.map((tool, index) => (
                    <ToolCard
                      key={index}
                      {...tool}
                      isFavorite={favorites.includes(tool.url)}
                      onFavoriteToggle={() => toggleFavorite(tool.url)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <ToolsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              // No results
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-muted-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("no_results_title")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("no_results_description")}
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:underline"
                >
                  {t("clear_search")}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Trending Tools */}
          <aside className="lg:col-span-3">
            <TrendingToolsSidebar tools={trendingTools} title={t("trending_title")} />
          </aside>
        </div>
      </div>
    </div>
  );
}
