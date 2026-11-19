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
            eyebrow="Self-drive fleet Kochi"
            title="Popular cars for Kerala trips."
            description="Hatchbacks for the city, SUVs for Munnar & Wayanad, scooters for the coast — cleaned and serviced between every rental."
            action={
              <Button asChild variant="outline">
                <Link href="/cars">
                  View all self-drive cars
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
