// import BackgroundGlow from "@/components/ui/background-glow";
import Branding from "@/components/blocks/branding";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature0 from "@/components/blocks/feature0";
import Feature1 from "@/components/blocks/feature1";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero/Hero/index";
// import HeroSection from "@/components/blocks/hero/HeroSection";
// import AeroSection from "@/components/blocks/aero/AeroSection";
// import MoonVisualizer from "@/components/moon-visualizer";
// import Pricing from "@/components/blocks/pricing";
import FeaturedCreations from "@/components/blocks/featured-creations";
import Showcase from "@/components/blocks/showcase";
import Stats from "@/components/blocks/stats";
import Testimonial from "@/components/blocks/testimonial";
// import { MoonVisualizerBlock } from "@/components/blocks/moon-visualizer";
import TestCalculator from "@/components/Tools/testCalculator";
import { getLandingPage } from "@/services/page";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getBaseUrl } from "@/lib/url";
import { defaultLocale } from "@/i18n/locale";
import { createSocialMetadata } from "@/lib/metadata";

export const revalidate = 60;
// Changed from "force-static" to "force-dynamic" to prevent build-time hanging
// when moon calculations are performed during SSR in Docker environments
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const baseUrl = getBaseUrl();
  const localeSegment = locale === defaultLocale ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localeSegment}`;
  const social = createSocialMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
    path: locale === defaultLocale ? "/" : `/${locale}`,
  });

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    ...social,
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getLandingPage(locale);

  // 可以通过环境变量或配置来切换Hero组件
  // 现在无论线上还是本地，都统一使用新版Hero组件
  const useNewHero = true;

  return (
    <>
      {/* <BackgroundGlow /> */}
      
      {/* AeroSection - 新的第一屏组件 */}
      {/* <AeroSection /> */}
      
      {/* Mondkalender - 第一屏
      <section className="py-20 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('hero_description')}
            </p>
          </div>
          <CPMCalculator />
        </div>
      </section> */}
      
      {/* 新的Hero切换组件 - 可以通过配置开启 */}
      {/* {useNewHero ? (
        <HeroSection 
          initialMode="one"
          animationDuration={0.3}
          className="mb-12"
        />
      ) : (
        page.hero && <Hero hero={page.hero} />
      )} */}


      {/* MACRS Calculator - 第一屏计算器 */}
      <section className="py-12 md:py-20">
        <TestCalculator />
      </section>

      {/* Hero - 第一屏 */}
      {page.hero && <Hero hero={page.hero} />}
      {page.branding && <Branding section={page.branding} />}
      
      

      {/* Feature0 - 3D轮盘展示组件 */}
          <Feature0 />
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Feature section={page.feature} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.stats && <Stats section={page.stats} />}
      {/* {page.pricing && <Pricing pricing={page.pricing} />} */}
      <FeaturedCreations />
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
