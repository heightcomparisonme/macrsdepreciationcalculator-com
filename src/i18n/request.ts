import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getAllToolSlugs } from "@/lib/tools-config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  if (["zh-CN"].includes(locale)) {
    locale = "zh";
  }

  if (["de-DE", "de-AT", "de-CH"].includes(locale)) {
    locale = "de";
  }

  if (["es-ES", "es-MX", "es-AR", "es-CO", "es-CL"].includes(locale)) {
    locale = "es";
  }

  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const loadJson = async (
    importer: () => Promise<{ default: unknown }>,
    label: string
  ) => {
    try {
      return (await importer()).default;
    } catch (error) {
      console.warn(`Translation file missing or invalid: ${label}`, error);
      return undefined;
    }
  };

  // Helper function to load page translations
  const loadPageTranslations = async (localeLower: string) => {
    const pageTranslations: {
      pages: Record<string, unknown>;
      tools: Record<string, unknown>;
    } = { pages: {}, tools: {} };

    // Define page translation mappings
    const pageMapping = [
      { path: "discord", key: "discord" },
      { path: "comingsoon", key: "comingsoon" },
      { path: "glossary", key: "glossary" },
      { path: "featured-creations", key: "featuredCreations" },
      { path: "onboarding", key: "onboarding" },
      { path: "hero", key: "hero" },
      { path: "landing", key: "landing" },
      { path: "pricing", key: "pricing" },
      { path: "showcase", key: "showcase" },
      { path: "workstation", key: "workstation" },
      { path: "tools", key: "tools" },
    ];

    // Define tools translation mappings - automatically discover all tools
    const toolSlugs = getAllToolSlugs();
    const toolsMapping = toolSlugs.map(slug => ({
      path: `tools/${slug}`,
      key: slug
    }));

    // Load page translations
    await Promise.all(
      pageMapping.map(async ({ path, key }) => {
        const messages = await loadJson(
          () => import(`./pages/${path}/${localeLower}.json`),
          `pages/${path}/${localeLower}.json`
        );
        if (messages) {
          pageTranslations.pages[key] = messages;
        }
      })
    );

    // Load tools translations
    await Promise.all(
      toolsMapping.map(async ({ path, key }) => {
        const messages = await loadJson(
          () => import(`./pages/${path}/${localeLower}.json`),
          `pages/${path}/${localeLower}.json`
        );
        if (messages) {
          pageTranslations.tools[key] = messages;
        }
      })
    );

    return pageTranslations;
  };

  try {
    const messages = (await import(`./messages/${locale.toLowerCase()}.json`))
      .default;

    const localeLower = locale.toLowerCase();
    const pageTranslations = await loadPageTranslations(localeLower);

    return {
      locale: locale,
      messages: {
        ...messages,
        pages: {
          ...messages.pages,
          ...pageTranslations.pages
        },
        tools: {
          ...pageTranslations.tools
        }
      },
    };
  } catch (e) {
    // Fallback to default locale messages
    const fallbackLocale = routing.defaultLocale;
    const fallbackLocaleLower = fallbackLocale.toLowerCase();
    const fallbackMessages = (
      await import(`./messages/${fallbackLocaleLower}.json`)
    ).default;

    const fallbackPageTranslations = await loadPageTranslations(fallbackLocaleLower);

    return {
      locale: fallbackLocale,
      messages: {
        ...fallbackMessages,
        pages: {
          ...fallbackMessages.pages,
          ...fallbackPageTranslations.pages
        },
        tools: {
          ...fallbackPageTranslations.tools
        }
      },
    };
  }
});
