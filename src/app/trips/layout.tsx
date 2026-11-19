import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "My trips",
  description: "View and manage your TranzCars bookings.",
  path: "/trips",
  noIndex: true,
});

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
