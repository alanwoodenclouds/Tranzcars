import type { Metadata } from "next";
import { ImmersiveHero } from "@/components/premium/immersive-hero";
import { ValueProps } from "@/components/premium/value-props";
import { FeaturedFleet } from "@/components/premium/featured-fleet";
import { HowItWorks } from "@/components/premium/how-it-works";
import { WhyTranzCars } from "@/components/premium/why-tranzcars";
import { TrustStrip } from "@/components/premium/trust-strip";
import { ExperienceKerala } from "@/components/premium/experience-kerala";
import { PremiumTestimonials } from "@/components/premium/premium-testimonials";
import { AppPromo } from "@/components/premium/app-promo";
import { FaqSection } from "@/components/home/faq-section";
import { ClosingJourney } from "@/components/premium/closing-journey";
import { JsonLd, faqJsonLd } from "@/components/seo/json-ld";
import {
  getBranches,
  getFaqs,
  getPopularCars,
  getTestimonials,
} from "@/lib/api/server";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
  title: {
    absolute: DEFAULT_TITLE,
  },
};

export default async function HomePage() {
  const [branches, popular, testimonials, faqs] = await Promise.all([
    getBranches(),
    getPopularCars(),
    getTestimonials(),
    getFaqs(),
  ]);

  const homeFaqs = faqs.slice(0, 6);

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <ImmersiveHero branches={branches} />
      <ValueProps />
      <FeaturedFleet cars={popular} />
      <HowItWorks />
      <WhyTranzCars />
      <TrustStrip />
      <ExperienceKerala />
      <PremiumTestimonials items={testimonials.slice(0, 6)} />
      <AppPromo />
      <FaqSection
        faqs={homeFaqs}
        title="Self-drive rental FAQ — Kochi & Kerala"
      />
      <ClosingJourney />
    </>
  );
}
