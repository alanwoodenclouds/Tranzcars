"use client";

import Link from "next/link";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import type { Faq } from "@/content/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function FaqSection({
  faqs,
  title = "Questions, answered",
  showContact = true,
}: {
  faqs: Faq[];
  title?: string;
  showContact?: boolean;
}) {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <Reveal>
            <p className="text-eyebrow mb-3 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-px w-6 bg-brand-400"
              />
              FAQ
            </p>
            <h2 className="text-display-md max-w-[16ch]">{title}</h2>
            <p className="text-body-sm mt-4 max-w-sm text-ink-500">
              Documents, free kilometres, airport pickup and deposits — the
              short version travellers ask for first.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/faq">
                Browse all FAQs
                <ArrowRight />
              </Link>
            </Button>
            {showContact ? (
              <div className="mt-5 rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
                <MessageCircleQuestion className="size-5 text-brand-500" />
                <p className="text-body-sm mt-3 font-bold text-ink-900">
                  Still unsure about something?
                </p>
                <p className="text-caption mt-1">
                  Our Kochi team answers licence, deposit and delivery questions
                  in minutes.
                </p>
                <Link
                  href="/contact"
                  className="text-caption mt-3 inline-block font-bold text-brand-600 hover:underline"
                >
                  Talk to a human →
                </Link>
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface">
              <Accordion type="single" collapsible defaultValue={faqs[0]?.id}>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
