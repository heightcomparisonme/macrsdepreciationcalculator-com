import { Pathnames } from "next-intl/routing";

// Enable i18n with English, German, and Spanish
export const locales = ["en"];
// export const locales = ["en", "de", "es"];

export const localeNames: any = {
  en: "English",
  // de: "Deutsch",
  // es: "Español",
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection = true;
