import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BRANCHES, BUSINESS_RULES } from "@/content/site";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { Badge } from "@/components/ui/badge";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact TranzCars Kochi",
  description:
    "Call, WhatsApp or write to TranzCars for self-drive bookings, airport delivery and extensions across Kochi and Kerala. Open 24/7.",
  path: "/contact",
});

const BRANCH_LABEL: Record<string, string> = {
  airport: "Airport desk",
  railway: "Railway station",
  office: "Office",
  delivery: "Home delivery",
};

export default function ContactPage() {
  const wa =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? BUSINESS_RULES.phoneE164;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We pick up the phone."
        description="Bookings, airport delivery, extensions or promo codes — reach the Kochi desk any hour of the day."
      />

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:py-16">
        <div className="space-y-4">
          <div className="rounded-[var(--radius-2xl)] border border-hairline bg-surface p-6 shadow-e1">
            <Badge tone="success" size="sm">
              <Clock3 />
              Open 24/7
            </Badge>
            <a
              href={`tel:${BUSINESS_RULES.phoneE164}`}
              className="text-numeric mt-4 block font-display text-2xl font-extrabold tracking-tight text-ink-900 transition-colors hover:text-brand-600 sm:text-3xl"
            >
              {BUSINESS_RULES.phoneDisplay}
            </a>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">
              Call for same-day availability, airport hand-over timings and
              long-term rates.
            </p>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <a
                href={`tel:${BUSINESS_RULES.phoneE164}`}
                className="interactive inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-ink-900 text-[14px] font-semibold text-white hover:bg-ink-800"
              >
                <Phone className="size-4" />
                Call now
              </a>
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="interactive inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-ink-200 bg-surface text-[14px] font-semibold text-ink-900 hover:bg-ink-50"
              >
                <MessageCircle className="size-4 text-jade-600" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-[var(--radius-2xl)] border border-hairline bg-surface p-6">
            <h2 className="font-display text-[16px] font-bold tracking-tight">
              Pick-up & delivery points
            </h2>
            <ul className="mt-4 space-y-3.5">
              {BRANCHES.map((b) => (
                <li key={b.id} className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  <div>
                    <p className="text-[14px] font-semibold text-ink-900">
                      {b.name}
                    </p>
                    <p className="text-[12.5px] text-ink-500">
                      {b.city} · {BRANCH_LABEL[b.type] ?? b.type}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-2xl)] border border-hairline bg-surface p-6">
            <h2 className="font-display text-[16px] font-bold tracking-tight">
              Head office
            </h2>
            <p className="mt-3 flex gap-3 text-[14px] leading-relaxed text-ink-600">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ink-400" />
              TranzCars, Kalamassery, Kochi, Kerala 683104
            </p>
            <p className="mt-2.5 flex gap-3 text-[14px] text-ink-600">
              <Mail className="mt-0.5 size-4 shrink-0 text-ink-400" />
              hello@tranzcars.com
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </>
  );
}
