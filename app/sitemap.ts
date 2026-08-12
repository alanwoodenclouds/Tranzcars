import type { MetadataRoute } from "next";
import { CARS } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = [
    "",
    "/cars",
    "/about",
    "/faq",
    "/contact",
    "/terms-and-conditions",
    "/privacy-policy",
    "/cancellation-policy",
    "/refund-policy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const carRoutes = CARS.map((car) => ({
    url: `${base}/cars/${car.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...carRoutes];
}
