import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Gauge, IdCard, ShieldCheck } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { getFaqs } from "@/lib/api/server";
import { FaqSection } from "@/components/home/faq-section";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "FAQ for TranzCars self-drive rentals — MVD approval, 120 km/day, airport pickup, deposits.",
};

const QUICK_FACTS = [
  {
    icon: IdCard,
    label: "Eligibility",
    value: `${BUSINESS_RULES.eligibilityAge}+ years, LMV licence held ${BUSINESS_RULES.licenceYears}+ year`,
  },
  {
    icon: Gauge,
    label: "Free kilometres",
    value: `${BUSINESS_RULES.kmPerDay} km per day on cars`,
  },
  {
    icon: ShieldCheck,
    label: "Minimum rental",
    value: `${BUSINESS_RULES.minRentalHours} hours`,
  },
  {
    icon: BadgeCheck,
    label: "Approval",
    value: "MVD-authorised self-drive fleet",
  },
];

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
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

      <FaqSection faqs={faqs} title="Frequently asked questions" />
    </>
  );
}
