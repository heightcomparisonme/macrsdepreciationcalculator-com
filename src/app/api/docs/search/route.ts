import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import { NextRequest } from "next/server";

// Create search API with English tokenization
const searchAPI = createFromSource(source, {
  // https://docs.orama.com/open-source/supported-languages
  language: "english",
  localeMap: {
    // Map unsupported locales to an available tokenizer
    zh: { language: "english" },
  },
});

const SUPPORTED_LANGUAGES = new Set(["en", "zh"]);

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();

  const requestedLang = url.searchParams.get("language")?.toLowerCase();
  const normalizedLang = SUPPORTED_LANGUAGES.has(requestedLang ?? "")
    ? requestedLang!
    : "en";
  url.searchParams.set("language", normalizedLang);

  const headers = new Headers(request.headers);
  headers.set("accept-language", normalizedLang);

  try {
    // Always use English tokenization since Orama doesn't support Chinese
    // This allows Chinese content to be searched using English tokenization
    return await searchAPI.GET(
      new NextRequest(url, {
        headers,
      })
    );
  } catch (error) {
    if (error instanceof Error && (error as { code?: string }).code === "LANGUAGE_NOT_SUPPORTED") {
      console.warn("Docs search fallback to English tokenizer:", error);
      url.searchParams.set("language", "en");
      headers.set("accept-language", "en");
      return searchAPI.GET(new NextRequest(url, { headers }));
    }

    console.error("Docs search error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Search service unavailable",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
