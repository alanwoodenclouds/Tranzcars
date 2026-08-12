"use client";

import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
import type { Faq } from "@/content/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";

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
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="text-eyebrow mb-3">FAQ</p>
            <h2 className="text-display-md">{title}</h2>
            {showContact ? (
              <div className="mt-6 rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
                <MessageCircleQuestion className="size-5 text-brand-500" />
                <p className="mt-3 text-[14px] font-bold text-ink-900">
                  Still unsure about something?
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                  Our Kochi team answers licence, deposit and delivery questions
                  in minutes.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-block text-[13.5px] font-bold text-brand-600 hover:underline"
                >
                  Talk to a human →
                </Link>
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface">
              <Accordion type="single" collapsible>
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
