"use client";

import Image from "next/image";
import { Bell, QrCode, Route } from "lucide-react";
import { MEDIA } from "@/content/media";
import { Reveal } from "@/components/motion/reveal";
import { toast } from "@/lib/toast";

const PERKS = [
  { icon: Route, label: "Live trip timeline" },
  { icon: Bell, label: "Return reminders" },
];

export function AppPromo() {
  function comingSoon(e: React.MouseEvent) {
    e.preventDefault();
    toast("The app is coming soon — we’ll email you at launch.", "info");
  }

  return (
    <section className="section-y-sm">
      <div className="container-page">
        <Reveal>
          <div className="relative grid items-center gap-10 overflow-hidden rounded-[var(--radius-3xl)] bg-ink-900 px-6 py-12 text-white sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 top-0 size-72 rounded-full bg-brand-500/25 blur-3xl"
            />

            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">
                Coming soon
              </p>
              <h2 className="text-display-md mt-3 text-white">
                Every trip, in your pocket.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-400">
                Extend a rental, share your live location with family, or find
                the nearest fuel stop — without calling anyone.
              </p>

              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                {PERKS.map((perk) => (
                  <li
                    key={perk.label}
                    className="flex items-center gap-2 text-[13px] font-semibold text-ink-300"
                  >
                    <perk.icon className="size-4 text-brand-400" />
                    {perk.label}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="grid size-24 place-items-center rounded-[var(--radius-lg)] bg-white/[0.07]">
                  <QrCode className="size-12 text-white/80" strokeWidth={1.25} />
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="#"
                    onClick={comingSoon}
                    className="flex h-11 w-40 items-center justify-center rounded-full bg-white text-sm font-bold text-ink-900 transition-transform hover:-translate-y-0.5"
                  >
                    App Store
                  </a>
                  <a
                    href="#"
                    onClick={comingSoon}
                    className="flex h-11 w-40 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Play Store
                  </a>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="relative mx-auto aspect-[9/17] w-[min(100%,250px)] overflow-hidden rounded-[38px] border-[6px] border-ink-800 bg-ink-800 shadow-e4">
                <Image
                  src={MEDIA.appScreen}
                  alt="TranzCars app preview"
                  fill
                  className="object-cover"
                  sizes="250px"
                />
                <div className="absolute inset-x-0 top-0 flex justify-center pt-2.5">
                  <span className="h-5 w-20 rounded-full bg-ink-900" />
                </div>
                <div className="absolute inset-x-3 bottom-4 rounded-[var(--radius-lg)] bg-surface/95 p-4 shadow-e3 backdrop-blur">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-500">
                    Next trip
                  </p>
                  <p className="mt-1 font-display text-base font-extrabold text-ink-900">
                    COK → Munnar
                  </p>
                  <p className="text-[12px] text-ink-500">
                    Thar Roxx · Sat 9:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
