import { ImmersiveHero } from "@/components/premium/immersive-hero";
import { ValueProps } from "@/components/premium/value-props";
import { FeaturedFleet } from "@/components/premium/featured-fleet";
import { HowItWorks } from "@/components/premium/how-it-works";
import { WhyTranzCars } from "@/components/premium/why-tranzcars";
import { TrustStrip } from "@/components/premium/trust-strip";
import { ExperienceKerala } from "@/components/premium/experience-kerala";
import { Membership } from "@/components/premium/membership";
import { PremiumTestimonials } from "@/components/premium/premium-testimonials";
import { AppPromo } from "@/components/premium/app-promo";
import { FaqSection } from "@/components/home/faq-section";
import { ClosingJourney } from "@/components/premium/closing-journey";
import {
  getBranches,
  getFaqs,
  getPopularCars,
  getTestimonials,
} from "@/lib/api/server";

export default async function HomePage() {
  const [branches, popular, testimonials, faqs] = await Promise.all([
    getBranches(),
    getPopularCars(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      <ImmersiveHero branches={branches} />
      <ValueProps />
      <FeaturedFleet cars={popular} />
      <HowItWorks />
      <WhyTranzCars />
      <TrustStrip />
      <ExperienceKerala />
      <Membership />
      <PremiumTestimonials items={testimonials.slice(0, 3)} />
      <AppPromo />
      <FaqSection faqs={faqs.slice(0, 5)} />
      <ClosingJourney />
    </>
  );
}
