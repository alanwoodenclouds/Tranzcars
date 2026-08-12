"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Car } from "@/content/site";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { CarCard } from "@/components/fleet/car-card";

export function FeaturedFleet({ cars }: { cars: Car[] }) {
  const list = cars.slice(0, 4);

  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Featured fleet"
            title="Rides people keep coming back for."
            description="Hatchbacks for the city, SUVs for the hills, scooters for the coast — all serviced between trips."
            action={
              <Button asChild variant="outline">
                <Link href="/cars">
                  View all vehicles
                  <ArrowRight />
                </Link>
              </Button>
            }
          />
        </Reveal>

        <RevealStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((car) => (
            <RevealItem key={car.id} className="h-full">
              <CarCard car={car} />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
