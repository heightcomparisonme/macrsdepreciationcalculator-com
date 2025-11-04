import { LandingPage, PricingPage, ShowcasePage } from "@/types/pages/landing";
import { generateToolsNavigation } from "./navigation";

export async function getLandingPage(locale: string): Promise<LandingPage> {
  const page = (await getPage("landing", locale)) as LandingPage;

  // Dynamically replace tools navigation children in header
  if (page.header?.nav?.items) {
    const toolsNavIndex = page.header.nav.items.findIndex(
      (item) => item.url === "/tools"
    );

    if (toolsNavIndex !== -1) {
      const dynamicToolsNav = await generateToolsNavigation(locale, 10);
      page.header.nav.items[toolsNavIndex].children = dynamicToolsNav as any;
    }
  }

  // Dynamically replace tools navigation children in footer
  if (page.footer?.nav?.items) {
    const toolsNavIndex = page.footer.nav.items.findIndex(
      (item) => item.title === "Tools"
    );

    if (toolsNavIndex !== -1) {
      const dynamicToolsNav = await generateToolsNavigation(locale, 10);
      // Map to footer format (only needs title, url, target)
      const footerTools = dynamicToolsNav.map((tool) => ({
        title: tool.title,
        url: tool.url,
        target: "_self" as const,
      }));
      page.footer.nav.items[toolsNavIndex].children = footerTools as any;
    }
  }

  return page;
}

export async function getPricingPage(locale: string): Promise<PricingPage> {
  return (await getPage("pricing", locale)) as PricingPage;
}

export async function getShowcasePage(locale: string): Promise<ShowcasePage> {
  return (await getPage("showcase", locale)) as ShowcasePage;
}

export async function getPage(
  name: string,
  locale: string
): Promise<LandingPage | PricingPage | ShowcasePage> {
  try {
    if (locale === "zh-CN") {
      locale = "zh";
    }

    return await import(
      `@/i18n/pages/${name}/${locale.toLowerCase()}.json`
    ).then((module) => module.default);
  } catch (error) {
    console.warn(`Failed to load ${locale}.json, falling back to en.json`);

    return await import(`@/i18n/pages/${name}/en.json`).then(
      (module) => module.default
    );
  }
}
