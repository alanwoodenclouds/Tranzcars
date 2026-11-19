import * as React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { PageHero } from "@/components/layout/page-hero";

export const LEGAL_LINKS = [
  { href: "/terms-and-conditions", label: "Terms & conditions" },
  { href: "/cancellation-policy", label: "Cancellation policy" },
  { href: "/refund-policy", label: "Refund policy" },
  { href: "/privacy-policy", label: "Privacy policy" },
] as const;

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

/** Shared shell for policy documents: hero, side nav, readable prose column. */
export function LegalPage({
  title,
  summary,
  updated = "1 January 2026",
  currentHref,
  sections,
}: {
  title: string;
  summary: string;
  updated?: string;
  currentHref: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={summary} />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[220px_1fr] lg:gap-16 lg:py-16">
        <nav
          aria-label="Policies"
          className="lg:sticky lg:top-28 lg:h-fit"
        >
          <p className="text-meta">Policies</p>
          <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {LEGAL_LINKS.map((l) => {
              const active = l.href === currentHref;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`interactive text-caption block rounded-[var(--radius-md)] px-3 py-2 font-semibold ${
                      active
                        ? "bg-ink-900 text-white"
                        : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-[var(--radius-xl)] border border-hairline bg-surface p-4">
            <p className="text-caption">Questions about these terms?</p>
            <a
              href={`tel:${BUSINESS_RULES.phoneE164}`}
              className="text-caption mt-2 flex items-center gap-2 font-bold text-brand-600 hover:underline"
            >
              <Phone className="size-4" />
              {BUSINESS_RULES.phoneDisplay}
            </a>
          </div>
        </nav>

        <article className="max-w-2xl">
          <p className="text-caption font-medium text-ink-400">
            Last updated {updated}
          </p>

          <div className="mt-8 space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-display-sm">{s.heading}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p} className="text-body mt-3">
                    {p}
                  </p>
                ))}
                {s.bullets ? (
                  <ul className="mt-4 space-y-2.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="text-body flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <p className="text-caption mt-12 rounded-[var(--radius-xl)] bg-surface-sunken p-5">
            This page is a plain-language summary for the demo site. The binding
            commercial terms are the ones shown at checkout and printed on your
            rental agreement.
          </p>
        </article>
      </div>
    </>
  );
}
