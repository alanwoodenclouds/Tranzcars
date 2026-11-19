"use client";

import Link from "next/link";
import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { useToggleAiAssistant } from "@/hooks/useAiAssistantUi";

export function FaqHelpBand() {
  const openAi = useToggleAiAssistant();
  const wa =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? BUSINESS_RULES.phoneE164;

  return (
    <section className="section-y-sm" aria-labelledby="faq-help-heading">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-3xl)] border border-hairline bg-ink-900 px-6 py-10 text-white sm:px-10 sm:py-12">
            <div
              aria-hidden
              className="absolute -right-16 -top-20 size-64 rounded-full bg-brand-500/25 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-brand-yellow/10 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <p className="text-eyebrow text-brand-300 flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block h-px w-6 bg-brand-400"
                  />
                  Still stuck?
                </p>
                <h2
                  id="faq-help-heading"
                  className="text-display-md mt-3 text-white"
                >
                  Talk to Kochi — or ask AI in a tap.
                </h2>
                <p className="text-body mt-3 max-w-lg text-white/65">
                  Licence rules, deposit timing, airport hand-over — our desk
                  answers 24×7, and the in-page assistant knows the same FAQs.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:justify-end">
                <Button asChild size="lg" variant="primary">
                  <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                    <Phone />
                    Call desk
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10"
                >
                  <a
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle />
                    WhatsApp
                  </a>
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="subtle"
                  className="bg-brand-yellow text-ink-900 hover:brightness-95"
                  onClick={openAi}
                >
                  <Sparkles />
                  Ask AI
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contact">Write to us</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
