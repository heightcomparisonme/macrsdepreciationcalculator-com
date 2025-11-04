import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import DiscordHero from "@/components/blocks/discord/DiscordHero";
import DiscordServers from "@/components/blocks/discord/DiscordServers";
import ServerComparison from "@/components/blocks/discord/ServerComparison";
import QuickRecommendations from "@/components/blocks/discord/QuickRecommendations";
import CommunityFeatures from "@/components/blocks/discord/CommunityFeatures";
import CommunityGuidelines from "@/components/blocks/discord/CommunityGuidelines";
import DiscordStats from "@/components/blocks/discord/DiscordStats";
import { getBaseUrl } from "@/lib/url";
import { defaultLocale } from "@/i18n/locale";
import { createSocialMetadata } from "@/lib/metadata";

export const revalidate = 60;
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.discord" });

  const baseUrl = getBaseUrl();
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}/discord`;
  const social = createSocialMetadata({
    title: t("discord.metadata.title"),
    description: t("discord.metadata.description"),
    locale,
    path: `${localePrefix}/discord`,
  });

  return {
    title: t("discord.metadata.title"),
    description: t("discord.metadata.description"),
    alternates: {
      canonical: canonicalUrl,
    },
    ...social,
  };
}

export default async function DiscordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <DiscordHero />
      <DiscordServers />
      <DiscordStats />
      <ServerComparison />
      <QuickRecommendations />
      <CommunityFeatures />
      <CommunityGuidelines />
    </>
  );
}
