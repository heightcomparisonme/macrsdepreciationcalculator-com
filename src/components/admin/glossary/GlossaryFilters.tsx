"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface GlossaryFiltersProps {
  locale: string;
}

export default function GlossaryFilters({ locale }: GlossaryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [letterFilter, setLetterFilter] = useState(searchParams.get("letter") || "all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (letterFilter !== "all") params.set("letter", letterFilter);

    router.push(`/${locale}/admin/glossary?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLetterFilter("all");
    router.push(`/${locale}/admin/glossary`);
  };

  const letters = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 border rounded-lg bg-card">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>

      <Select value={letterFilter} onValueChange={setLetterFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by letter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Letters</SelectItem>
          {letters.map((letter) => (
            <SelectItem key={letter} value={letter}>
              {letter}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button onClick={handleSearch} size="sm">
          Search
        </Button>
        <Button onClick={handleClear} variant="outline" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}