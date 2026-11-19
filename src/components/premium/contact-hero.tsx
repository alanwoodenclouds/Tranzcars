"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { MEDIA } from "@/content/media";
import { Button } from "@/components/ui/button";

export function ContactHero() {
  const reduce = useReducedMotion();
  const wa =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? BUSINESS_RULES.phoneE164;

  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.7,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <header className="relative isolate -mt-16 overflow-hidden bg-ink-950 pt-16 text-white sm:-mt-[72px] sm:pt-[72px]">
      <motion.div
        aria-hidden
        className="absolute inset-0"
        {...(reduce
          ? {}
          : {
              initial: { scale: 1.06 },
              animate: { scale: 1 },
              transition: { duration: 7.5, ease: [0.22, 1, 0.36, 1] },
            })}
      >
        <Image
          src={MEDIA.heroFullBleed}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_38%] sm:object-[62%_40%]"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/88 to-ink-950/45 sm:from-ink-950/90 sm:via-ink-950/60 sm:to-ink-950/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/55"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_12%_18%,rgba(248,120,0,0.26),transparent_58%)]"
      />

      <div className="container-page relative flex min-h-[min(92svh,820px)] flex-col justify-between pb-28 pt-8 sm:min-h-[min(82svh,740px)] sm:justify-end sm:pb-16 sm:pt-16">
        <motion.div {...fade()} className="min-w-0 max-w-xl sm:pb-4">
          <p className="text-eyebrow flex items-center gap-2 text-brand-300">
            <span
              aria-hidden
              className="inline-block h-px w-6 bg-brand-400"
            />
            Contact{" "}
            <span className="tracking-normal">
              Tranz<span className="text-brand-yellow">Cars</span>
            </span>
          </p>

          <h1 className="text-hero mt-4 text-white">
            We pick up
            <br className="hidden sm:block" /> the phone.
          </h1>

          <p className="text-lead-on-dark mt-5 max-w-md">
            Bookings, airport delivery, extensions or promo codes — the Kochi
            desk answers any hour of the day.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
                <Phone />
                Call {BUSINESS_RULES.phoneDisplay}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15 hover:text-white sm:w-auto"
            >
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                <MessageCircle />
                WhatsApp
              </a>
            </Button>
          </div>

          <p className="text-meta mt-6 text-white/60">
            Open 24×7 · South Kalamassery, Kochi
          </p>
        </motion.div>

        {/* Spacer keeps justify-between from collapsing on mobile */}
        <div aria-hidden className="h-8 sm:hidden" />
      </div>
    </header>
  );
}
