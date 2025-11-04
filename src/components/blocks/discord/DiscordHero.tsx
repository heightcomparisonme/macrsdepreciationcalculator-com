"use client";

import { useTranslations } from "next-intl";

export default function DiscordHero() {
  const t = useTranslations("pages.discord.discord.hero");

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          {t("title")}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t("description")}
        </p>
      </div>
    </section>
  );
}