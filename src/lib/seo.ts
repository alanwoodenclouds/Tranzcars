import type { Metadata } from "next";
import { BUSINESS_RULES } from "@/constants/businessRules";

export const SITE_NAME = "TranzCars";
export const SITE_TAGLINE = "Rent A Car. Drive Better.";
export const SITE_POSITIONING = "Self Drive Cars & Bikes in Kochi, Kerala";

export const DEFAULT_TITLE = `${SITE_NAME} | ${SITE_POSITIONING}`;
export const DEFAULT_DESCRIPTION =
  "MVD-approved self-drive car & bike rental in Kochi & Kerala since 2017. Free km daily, airport delivery, hatchbacks to SUVs and electric scooters. Search without signing in.";

export const SITE_KEYWORDS = [
  "self drive car rental Kochi",
  "self drive bike rental Kerala",
  "TranzCars",
  "rent a car Kochi Airport",
  "MVD approved self drive",
  "car rental Cochin",
  "SUV rental Kerala",
  "electric scooter rental Kochi",
  "self drive Thar Kochi",
  "airport car delivery COK",
];

/** Production-safe absolute site origin (no trailing slash). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.tranzcars.com";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Absolute or site-relative image path for Open Graph / Twitter */
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

/** Shared page metadata with canonical, OG, and Twitter. */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  keywords,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: "Tranz Cars Kerala Rent A Car Company",
  url: getSiteUrl(),
  logo: absoluteUrl("/brand/tranzcars-logo.png"),
  phone: BUSINESS_RULES.phoneDisplay,
  phoneE164: `+${BUSINESS_RULES.phoneE164}`,
  foundingDate: String(BUSINESS_RULES.foundedYear),
  areaServed: ["Kochi", "Ernakulam", "Kerala", "Trivandrum", "Kozhikode"],
  address: {
    streetAddress: "Kalamassery",
    addressLocality: "Kochi",
    addressRegion: "Kerala",
    postalCode: "683104",
    addressCountry: "IN",
  },
  geo: {
    latitude: 10.0535,
    longitude: 76.328,
  },
  sameAs: [
    process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL,
  ].filter(Boolean) as string[],
} as const;
