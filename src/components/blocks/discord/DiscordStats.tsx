"use client";

import { useTranslations } from "next-intl";

export default function DiscordStats() {
  const t = useTranslations("pages.discord.discord.stats");

  const stats = [
    { value: "43,000+", label: t("totalMembers") },
    { value: "6", label: t("servers") },
    { value: "24/7", label: t("activeChat") },
    { value: "200+", label: t("channels") },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}