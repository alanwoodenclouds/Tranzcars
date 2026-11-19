import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { BRANCHES, BUSINESS_RULES } from "@/content/site";
import { MEDIA } from "@/content/media";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/premium/contact-hero";
import { ClosingJourney } from "@/components/premium/closing-journey";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact TranzCars Kochi — 24/7 self-drive bookings",
  description:
    "Call +91 98950 41111 or WhatsApp TranzCars Kochi for self-drive car rental, Cochin Airport delivery and trip extensions. South Kalamassery desk open 24/7.",
  path: "/contact",
});

const BRANCH_LABEL: Record<string, string> = {
  airport: "Airport desk",
  railway: "Railway station",
  office: "Office",
  delivery: "Home delivery",
};

const CITY_IMAGE: Record<string, string> = {
  Kochi: MEDIA.destinations.alleppey,
  Trivandrum: MEDIA.destinations.munnar,
  Kozhikode: MEDIA.destinations.kozhikode,
};

export default function ContactPage() {
  const wa =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? BUSINESS_RULES.phoneE164;

  const cities = ["Kochi", "Trivandrum", "Kozhikode"] as const;
  const branchesByCity = cities.map((city) => ({
    city,
    image: CITY_IMAGE[city],
    branches: BRANCHES.filter((b) => b.city === city),
  }));

  return (
    <>
      <ContactHero />

      <section className="section-y" aria-labelledby="reach-heading">
        <div className="container-page grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <Reveal className="min-w-0">
            <p className="text-eyebrow mb-3 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-px w-6 bg-brand-400"
              />
              Reach the desk
            </p>
            <h2 id="reach-heading" className="text-display-md max-w-[16ch]">
              Call, WhatsApp, or leave a note.
            </h2>
            <p className="text-lead mt-4 max-w-md">
              Same-day cars, Cochin Airport hand-over, and long-term rates —
              humans on the line, not a call centre script.
            </p>

            <div className="mt-8 border-t border-hairline">
              <div className="flex items-start justify-between gap-4 border-b border-hairline py-6">
                <div className="min-w-0">
                  <p className="text-meta flex items-center gap-2 text-jade-600">
                    <Clock3 className="size-3.5" />
                    Open 24×7
                  </p>
                  <a
                    href={`tel:${BUSINESS_RULES.phoneE164}`}
                    className="text-numeric mt-2 block truncate font-display text-3xl font-extrabold tracking-tight text-ink-900 transition-colors hover:text-brand-600 sm:text-4xl"
                  >
                    {BUSINESS_RULES.phoneDisplay}
                  </a>
                  <a
                    href={`tel:${BUSINESS_RULES.phoneAltE164}`}
                    className="text-body mt-1.5 block font-semibold text-ink-600 transition-colors hover:text-brand-600"
                  >
                    {BUSINESS_RULES.phoneAltDisplay}
                  </a>
                </div>
                <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Phone className="size-5" />
                </span>
              </div>

              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 border-b border-hairline py-5 transition-colors hover:text-brand-600"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-jade-50 text-jade-600">
                    <MessageCircle className="size-4" />
                  </span>
                  <div>
                    <p className="text-title">WhatsApp</p>
                    <p className="text-caption mt-0.5">
                      Photos, extensions, late-night landings
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </a>

              <a
                href={`mailto:${BUSINESS_RULES.email}`}
                className="group flex items-center justify-between gap-4 border-b border-hairline py-5 transition-colors hover:text-brand-600"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-ink-100 text-ink-700">
                    <Mail className="size-4" />
                  </span>
                  <div>
                    <p className="text-title">{BUSINESS_RULES.email}</p>
                    <p className="text-caption mt-0.5">
                      Contracts, invoices, long-term fleet
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </a>

              <div className="flex gap-3 py-6">
                <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-700">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-title">Head office</p>
                  <p className="text-body-sm mt-1.5 max-w-sm text-ink-600">
                    {BUSINESS_RULES.addressLine}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2.5">
              <Button asChild size="lg">
                <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                  <Phone />
                  Call now
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                  <MessageCircle />
                  WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0 lg:sticky lg:top-24">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-surface-sunken" aria-label="Pick-up and delivery points">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Pick-up & delivery"
              title="Where we hand over the keys."
              description="Airport desks, railway stations, and doorstep delivery — pick the point that fits your trip."
              action={
                <Button asChild variant="outline">
                  <Link href="/cars">
                    Browse fleet
                    <ArrowRight />
                  </Link>
                </Button>
              }
            />
          </Reveal>

          <RevealStagger className="mt-10 grid gap-4 lg:grid-cols-3">
            {branchesByCity.map((group) => (
              <RevealItem key={group.city}>
                <article className="overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface">
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                    <Image
                      src={group.image}
                      alt={`${group.city} — TranzCars pick-up`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/25 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-title-lg text-white">{group.city}</h3>
                      <p className="text-caption mt-0.5 text-white/80">
                        {group.branches.length} pick-up{" "}
                        {group.branches.length === 1 ? "point" : "points"}
                      </p>
                    </div>
                  </div>

                  <ul className="divide-y divide-hairline">
                    {group.branches.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-start gap-3 px-4 py-3.5"
                      >
                        <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                        <div className="min-w-0">
                          <p className="text-body-sm font-semibold text-ink-900">
                            {b.name}
                          </p>
                          <p className="text-caption mt-0.5">
                            {BRANCH_LABEL[b.type] ?? b.type}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <ClosingJourney />
    </>
  );
}
