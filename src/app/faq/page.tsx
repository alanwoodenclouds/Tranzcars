import type { Metadata } from "next";
import {
  BadgeCheck,
  Gauge,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { getFaqs } from "@/lib/api/server";
import { FaqExplorer } from "@/components/faq/faq-explorer";
import { FaqHelpBand } from "@/components/faq/faq-help-band";
import { Reveal } from "@/components/motion/reveal";
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

      <header className="hairline-b relative isolate overflow-hidden bg-surface-sunken">
        <div aria-hidden className="bg-aurora absolute inset-0 -z-10 opacity-70" />
        <div
          aria-hidden
          className="bg-grid mask-fade-b absolute inset-0 -z-10 opacity-[0.45]"
        />
        <div className="container-page py-12 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-eyebrow mb-3.5 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-px w-6 bg-brand-400"
              />
              Help centre
            </p>
            <h1 className="text-display-lg">
              Everything about renting from{" "}
              <span className="italic text-brand-600">
                Tranz<span className="text-brand-500">Cars</span>
              </span>.
            </h1>
            <p className="text-lead mt-4 max-w-2xl sm:mt-5">
              Licences, deposits, kilometre limits and airport hand-over — search
              or browse by topic.
            </p>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_FACTS.map((f) => (
              <li
                key={f.label}
                className="flex gap-3 rounded-[var(--radius-xl)] border border-hairline/80 bg-surface/80 px-4 py-3.5 backdrop-blur-sm"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600">
                  <f.icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-meta">{f.label}</p>
                  <p className="text-caption mt-0.5 font-semibold leading-snug text-ink-900">
                    {f.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="section-y">
        <div className="container-page">
          <Reveal y={24}>
            <FaqExplorer faqs={faqs} />
          </Reveal>
        </div>
      </section>

      <FaqHelpBand />
    </>
  );
}
