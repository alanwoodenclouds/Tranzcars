import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Gauge, IdCard, ShieldCheck } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { getFaqs } from "@/lib/api/server";
import { FaqSection } from "@/components/home/faq-section";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Self-drive car rental FAQ Kochi — documents, km & deposits",
  description:
    "TranzCars FAQ: Kerala Govt / MVD approval, 120 km free/day, Cochin Airport pickup, security deposit, licence rules (23+, 3 years), fuel, tolls and refunds.",
  path: "/faq",
});

const QUICK_FACTS = [
  {
    icon: IdCard,
    label: "Eligibility",
    value: `${BUSINESS_RULES.eligibilityAge}+ years, Indian DL held ${BUSINESS_RULES.licenceYears}+ years`,
  },
  {
    icon: Gauge,
    label: "Free kilometres",
    value: `${BUSINESS_RULES.kmPerDay} km free every day`,
  },
  {
    icon: ShieldCheck,
    label: "Support",
    value: "24×7 roadside & customer care",
  },
  {
    icon: BadgeCheck,
    label: "Approval",
    value: "Kerala Govt approved since 2017",
  },
];

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <PageHero
        eyebrow="Help centre"
        title="Everything about renting from us."
        description="Licences, deposits, kilometre limits and airport hand-over — the answers travellers ask for most."
      >
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">Ask us directly</Link>
        </Button>
      </PageHero>

      <section className="hairline-b bg-surface">
        <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_FACTS.map((f) => (
            <div key={f.label} className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-brand-50 text-brand-600">
                <f.icon className="size-[18px]" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
                  {f.label}
                </p>
                <p className="mt-1 text-[13.5px] font-semibold leading-snug text-ink-900">
                  {f.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FaqSection
        faqs={faqs}
        title="Self-drive car rental questions, answered"
      />
    </>
  );
}
