"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type StyleItem = {
  id: number;
  name: string;
  image: string;
  category: string;
  badge?: "HOT" | "NEW" | "TRENDING";
  description?: string;
};

const styleData: StyleItem[] = [
  { id: 1, name: "None", image: "https://picsum.photos/150/150?random=1", category: "All" },
  { id: 2, name: "Ghibli", image: "https://picsum.photos/150/150?random=2", category: "Anime", badge: "HOT", description: "Ghibli style" },
  { id: 3, name: "Pope", image: "https://picsum.photos/150/150?random=3", category: "Meme", badge: "NEW", description: "Pope style" },
  { id: 4, name: "Soyjak", image: "https://picsum.photos/150/150?random=4", category: "Meme", badge: "HOT", description: "Soyjak style" },
  { id: 5, name: "Toy Figure", image: "https://picsum.photos/150/150?random=5", category: "Toy Figure", badge: "TRENDING", description: "Toy Figure style" },
  { id: 6, name: "Wojak", image: "https://picsum.photos/150/150?random=6", category: "Meme", badge: "HOT", description: "Wojak style" },
  { id: 7, name: "Rage Face", image: "https://picsum.photos/150/150?random=7", category: "Meme", badge: "HOT", description: "Rage Face style" },
  { id: 8, name: "Troll Face", image: "https://picsum.photos/150/150?random=8", category: "Meme", badge: "NEW" , description: "Troll Face style"},
  { id: 9, name: "Retro Game", image: "https://picsum.photos/150/150?random=9", category: "Retro", description: "Retro Game style" },
  { id: 10, name: "Cursed2", image: "https://picsum.photos/150/150?random=10", category: "Meme", badge: "NEW", description: "Cursed2 style" },
  { id: 11, name: "Surreal", image: "https://picsum.photos/150/150?random=11", category: "Meme", badge: "NEW" , description: "Surreal style"},
  { id: 12, name: "Barbie", image: "https://picsum.photos/150/150?random=12", category: "Action Figure", badge: "TRENDING", description: "Barbie style" },
  { id: 13, name: "LEGO", image: "https://picsum.photos/150/150?random=13", category: "Action Figure", badge: "HOT", description: "LEGO style" },
  { id: 14, name: "Cursed", image: "https://picsum.photos/150/150?random=14", category: "Meme", badge: "TRENDING" , description: "Cursed style"},
  { id: 15, name: "Nuked1", image: "https://picsum.photos/150/150?random=15", category: "Meme", badge: "NEW", description: "Nuked1 style" },
  { id: 16, name: "3D Cute", image: "https://picsum.photos/150/150?random=16", category: "3D", badge: "HOT" , description: "3D Cute style"},
  { id: 17, name: "Nuked2", image: "https://picsum.photos/150/150?random=17", category: "Meme", badge: "NEW", description: "Nuked2 style" },
  { id: 18, name: "Chibi Emoji", image: "https://picsum.photos/150/150?random=18", category: "Emoji" , description: "Chibi Emoji style"},
  { id: 19, name: "Disturbed", image: "https://picsum.photos/150/150?random=19", category: "Meme", badge: "NEW", description: "Disturbed style" },
  { id: 20, name: "Caricature2", image: "https://picsum.photos/150/150?random=20", category: "Avatar" , description: "Caricature2 style" },
];

// 将样式数据翻倍以增加可浏览的预览数量
const extendedStyleData: StyleItem[] = [
  ...styleData,
  ...styleData.map((item) => ({
    ...item,
    id: item.id + styleData.length,
    // 使用不同的随机图保证与原列表区分
    image: `https://picsum.photos/150/150?random=${item.id + styleData.length}`,
  })),
];

const filterCategories = [
  "All",
  "Image ReStyle",
  "Anime",
  "Avatar",
  "Meme",
  "Action Figure",
  "Toy Figure",
  "Retro",
  "3D",
  "Emoji",
  "Comic",
] as const;

type FilterCategory = (typeof filterCategories)[number];

function StyleCard({
  name,
  image,
  badge,
  description,
  isSelected,
  onClick,
}: {
  name: string;
  image: string;
  badge?: "HOT" | "NEW" | "TRENDING";
  description?: string;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative cursor-pointer group transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-600 rounded mb-1 mx-auto flex items-center justify-center">
                📷
              </div>
              <div>{name}</div>
            </div>
          </div>
        )}

        {/* 悬浮描述蒙版 */}
        {description && (
          <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white text-xs leading-snug line-clamp-2 w-full">{description}</p>
          </div>
        )}
      </div>

      {badge && (
        <div className="absolute top-1 right-1 z-10">
          <Badge
            variant={badge === "HOT" ? "destructive" : "secondary"}
            className={badge === "TRENDING" ? "bg-orange-500 text-white border-transparent" : undefined}
          >
            {badge}
          </Badge>
        </div>
      )}

      <div className="mt-2 text-center">
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
          {name}
        </span>
      </div>
    </div>
  );
}

export default function SelectStyleBlock() {
  const t = useTranslations("select_style");

  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("All");
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);

  const filteredStyles =
    selectedFilter === "All"
      ? extendedStyleData
      : extendedStyleData.filter((style) => style.category === selectedFilter);

  return (
    <section className="py-10">
      <div className="container max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-xl p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_10px_30px_-10px_rgba(0,0,0,0.6)]">
        <div className="mx-auto mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">{t("title")}</h2>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === category
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-foreground/80 hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 固定高度 + 纵向滚动 + 玻璃感滚动条 */}
        <div className="relative max-h-[520px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredStyles.map((style) => (
              <StyleCard
                key={style.id}
                name={style.name}
                image={style.image}
                badge={style.badge}
                description={style.description}
                isSelected={selectedStyle === style.id}
                onClick={() => {
                  setSelectedStyle(style.id);
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("switch-hero-to-two"));
                    const el = document.getElementById("hero");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200">
          <Link
            href="/"
            className="text-sm mr-1 underline hover:text-primary transition-colors duration-200"
          >
            {t("more_styles")}
          </Link>
          <ChevronDown size={16} />
        </div>
      </div>
    </section>
  );
}
