import type { Car, Faq } from "@/content/site";
import {
  absoluteUrl,
  getSiteUrl,
  ORGANIZATION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Safe JSON-LD script tag for App Router pages. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "AutoRental", "LocalBusiness"],
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    image: ORGANIZATION.logo,
    foundingDate: ORGANIZATION.foundingDate,
    telephone: ORGANIZATION.phoneE164,
    areaServed: ORGANIZATION.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      ...ORGANIZATION.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORGANIZATION.geo.latitude,
      longitude: ORGANIZATION.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "₹₹",
    sameAs: ORGANIZATION.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: ORGANIZATION.phoneE164,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Malayalam", "Hindi"],
      },
    ],
  };
}

export function websiteJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/cars?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function carProductJsonLd(car: Car) {
  const kind = car.category === "bike" ? "bike" : "car";
  const url = absoluteUrl(`/cars/${car.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: car.name,
    description: `Self-drive ${kind} rental in Kochi — ${car.transmission}, ${car.seats} seats, ${car.kmPerDay} free km/day.`,
    image: [car.image],
    brand: {
      "@type": "Brand",
      name: car.name.split(" ")[0] ?? SITE_NAME,
    },
    category: car.category === "bike" ? "MotorcycleRental" : "AutoRental",
    sku: car.id,
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: car.pricePerDay,
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 90
      )
        .toISOString()
        .slice(0, 10),
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Transmission", value: car.transmission },
      { "@type": "PropertyValue", name: "Seats", value: String(car.seats) },
      { "@type": "PropertyValue", name: "Fuel", value: car.fuel },
      {
        "@type": "PropertyValue",
        name: "Free km per day",
        value: String(car.kmPerDay),
      },
      { "@type": "PropertyValue", name: "Type", value: car.type },
    ],
  };
}

export function fleetItemListJsonLd(cars: Car[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TranzCars self-drive fleet",
    itemListElement: cars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/cars/${car.slug}`),
      name: car.name,
    })),
  };
}
