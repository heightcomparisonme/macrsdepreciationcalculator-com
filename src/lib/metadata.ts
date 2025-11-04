import type { Metadata } from "next";

import { getBaseUrl } from "@/lib/url";
import { defaultLocale } from "@/i18n/locale";

const DEFAULT_SITE_NAME = "Macrs Depreciation Calculator";
const DEFAULT_TWITTER_HANDLE = "@mondkalenderai";
const DEFAULT_SOCIAL_IMAGE_PATH = "/og";

type SocialType = "website" | "article" | "product" | "profile" | "video.other";

export interface SocialMetadataOptions {
  title: string;
  description: string;
  locale?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: SocialType;
}

function normalizePath(path?: string): string {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function resolveImageUrl(image?: string): string {
  const baseUrl = getBaseUrl();
  if (!image) {
    return `${baseUrl}${DEFAULT_SOCIAL_IMAGE_PATH}`;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${baseUrl}${normalizePath(image)}`;
}

export function createOpenGraphMetadata(
  options: SocialMetadataOptions
): NonNullable<Metadata["openGraph"]> {
  const baseUrl = getBaseUrl();
  const path = normalizePath(options.path);
  const url = `${baseUrl}${path}`;
  const imageUrl = resolveImageUrl(options.image);
  const locale = options.locale ?? defaultLocale;

  // Map broader SocialType to Next.js allowed OpenGraph types
  const ogTypeMap: Record<SocialType, "website" | "article" | "profile" | "video.other"> = {
    website: "website",
    article: "article",
    product: "website",
    profile: "profile",
    "video.other": "video.other",
  };

  return {
    type: ogTypeMap[(options.type ?? "website") as SocialType],
    url,
    title: options.title,
    description: options.description,
    siteName: DEFAULT_SITE_NAME,
    locale,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: options.imageAlt ?? options.title,
      },
    ],
  };
}

export function createTwitterMetadata(
  options: SocialMetadataOptions
): NonNullable<Metadata["twitter"]> {
  const imageUrl = resolveImageUrl(options.image);

  return {
    card: "summary_large_image",
    title: options.title,
    description: options.description,
    creator: DEFAULT_TWITTER_HANDLE,
    images: [imageUrl],
  };
}

export function createSocialMetadata(
  options: SocialMetadataOptions
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: createOpenGraphMetadata(options),
    twitter: createTwitterMetadata(options),
  };
}
