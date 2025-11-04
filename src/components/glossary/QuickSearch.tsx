"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchItem {
  title: string;
  slug: string;
}

interface QuickSearchProps {
  locale?: string;
}

export default function QuickSearch({ locale = "en" }: QuickSearchProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const searchTerms = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/glossary?${new URLSearchParams({
          q: searchQuery,
          locale,
          limit: "10"
        })}`
      );

      if (res.ok) {
        const data = await res.json();
        setItems(
          data.items.map((item: any) => ({
            title: item.title || item.slug,
            slug: item.slug,
          }))
        );
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    searchTerms(debouncedQuery);
  }, [debouncedQuery, searchTerms]);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Search className="h-4 w-4" />
        Quick Search
      </h3>
      <div className="space-y-3">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms..."
          className="w-full"
        />
        {loading && (
          <div className="text-sm text-muted-foreground">Searching...</div>
        )}
        {!loading && items.length > 0 && (
          <ul className="space-y-2 max-h-64 overflow-auto">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/glossary/${item.slug}`}
                  className="text-sm hover:underline hover:text-primary block"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!loading && query && items.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}