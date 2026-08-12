import type { Metadata } from "next";
import { fontBody, fontDisplay } from "@/lib/fonts";
import { SiteNav } from "@/components/layout/site-nav";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { AiAssistant } from "@/components/ai/ai-assistant";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TranzCars | Self Drive Cars & Bikes in Kochi, Kerala",
    template: "%s | TranzCars",
  },
  description:
    "MVD-approved self-drive car & bike rental in Kochi & Kerala. Free km daily, airport delivery, hatchbacks to SUVs and electric scooters. Search without signing in.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "TranzCars | Self Drive Cars & Bikes in Kochi, Kerala",
    description:
      "MVD-approved self-drive cars and bikes with free km/day and Kochi Airport delivery.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontDisplay.variable} ${fontBody.variable}`}>
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to content
          </a>
          <SiteNav />
          <main id="main" className="min-h-screen pt-16 sm:pt-[72px]">
            {children}
          </main>
          <SiteFooter />
          <MobileTabBar />
          <AiAssistant />
        </Providers>
      </body>
    </html>
  );
}
