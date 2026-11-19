import { MEDIA } from "@/content/media";

export type TripStop = {
  day: string;
  title: string;
  detail: string;
};

export type Destination = {
  slug: string;
  name: string;
  line: string;
  summary: string;
  drive: string;
  distanceKm: number;
  suggestedDays: string;
  bestFor: string;
  vehicleTip: string;
  /** Fleet car types that suit this trip */
  recommendedTypes: string[];
  /** Optional car slugs to feature first */
  featuredCarSlugs: string[];
  highlights: string[];
  itinerary: TripStop[];
  tips: string[];
  image: string;
  /** Home bento span classes */
  span: string;
  featured?: boolean;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "munnar",
    name: "Munnar",
    line: "Tea estates and misty hairpins",
    summary:
      "A classic Kochi self-drive — climb into the Western Ghats, stop for chai at viewpoints, and let the Thar or Innova handle the hairpins.",
    drive: "4h from Kochi",
    distanceKm: 130,
    suggestedDays: "2–3 days",
    bestFor: "Couples & small groups",
    vehicleTip: "SUV or compact SUV with good ground clearance for estate roads.",
    recommendedTypes: ["SUV", "Compact SUV", "MUV"],
    featuredCarSlugs: ["mahindra-thar-roxx", "tata-nexon-at", "toyota-innova-crysta"],
    highlights: [
      "Tea garden viewpoints",
      "Eravikulam & Mattupetty",
      "Cool climate evenings",
      "Photo stops on the climb",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Kochi → Munnar",
        detail:
          "Pick up in Kochi or at COK, drive via Adimali. Check in by late afternoon and catch sunset over the estates.",
      },
      {
        day: "Day 2",
        title: "Local loops",
        detail:
          "Short self-drive loops to Top Station, Mattupetty Dam, and nearby viewpoints — easy day mileage.",
      },
      {
        day: "Day 3",
        title: "Return via waterfalls",
        detail:
          "Optional Cheeyappara / Valara stops on the way down. Hand back the car same evening in Kochi.",
      },
    ],
    tips: [
      "Start early from Kochi to avoid afternoon fog on the climb.",
      "Keep fuel topped before Adimali — pumps thin out higher up.",
      `${130} km one way fits comfortably inside free km on a 2–3 day rental.`,
    ],
    image: MEDIA.destinations.munnar,
    span: "sm:col-span-2 sm:row-span-2",
    featured: true,
  },
  {
    slug: "alleppey",
    name: "Alleppey",
    line: "Backwaters at golden hour",
    summary:
      "A short coastal hop from Kochi — perfect for a day trip or overnight when you want canals, houseboats nearby, and an easy city-to-shore drive.",
    drive: "1h 30m",
    distanceKm: 55,
    suggestedDays: "1–2 days",
    bestFor: "Day trips & couples",
    vehicleTip: "Hatchback or sedan is enough; scooters work for canal-side rides.",
    recommendedTypes: ["Hatchback", "Sedan", "Compact SUV"],
    featuredCarSlugs: ["maruti-swift-at", "honda-city", "tata-nexon-at"],
    highlights: [
      "Punnamada backwaters",
      "Sunset on the beach road",
      "Easy day-trip mileage",
      "Houseboat pier access",
    ],
    itinerary: [
      {
        day: "Morning",
        title: "Kochi → Alleppey",
        detail:
          "Leave after breakfast via NH66. Park near the boat jetty or beach stretch and walk the canals.",
      },
      {
        day: "Afternoon",
        title: "Backwaters & beach",
        detail:
          "Optional short cruise, then drive to Alleppey Beach for golden hour. Dinner in town before returning.",
      },
      {
        day: "Overnight",
        title: "Stay & slow morning",
        detail:
          "If you overnight, keep the car for a relaxed village loop next morning — still well within free km.",
      },
    ],
    tips: [
      "Weekend traffic near the jetty — park a short walk away.",
      "Great first self-drive for new renters: short distance, flat roads.",
      "Pair with a scooter if you mainly want canal-side exploration.",
    ],
    image: MEDIA.destinations.alleppey,
    span: "",
    featured: true,
  },
  {
    slug: "wayanad",
    name: "Wayanad",
    line: "Forests, falls, open roads",
    summary:
      "Longer highland drive with forests, waterfalls, and open stretches — rent a comfortable SUV or MUV when the group and bags grow.",
    drive: "5h",
    distanceKm: 280,
    suggestedDays: "3–4 days",
    bestFor: "Families & friends",
    vehicleTip: "MUV or SUV for luggage and mountain roads; Automatic preferred.",
    recommendedTypes: ["SUV", "MUV"],
    featuredCarSlugs: ["toyota-innova-crysta", "mahindra-thar-roxx", "tata-nexon-at"],
    highlights: [
      "Edakkal & Soochipara",
      "Plantation stays",
      "Cool weather driving",
      "Group-friendly mileage",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Kochi → Wayanad",
        detail:
          "Full morning start via Kozhikode route or Palakkad. Arrive Kalpetta / Vythiri by evening.",
      },
      {
        day: "Day 2–3",
        title: "Explore locally",
        detail:
          "Self-drive to waterfalls, caves, and viewpoints. Distances between spots are short once you are in the district.",
      },
      {
        day: "Day 4",
        title: "Return to Kochi",
        detail:
          "Leave mid-morning. Excess km is rare on a 3–4 day booking if you stay local after arrival.",
      },
    ],
    tips: [
      "Plan fuel stops in Kozhikode / Kalpetta — don’t push empty tanks in the hills.",
      "Monsoon roads can be slick; SUVs feel more confident.",
      "Book 3+ days so the long inbound drive doesn’t eat your free km stressfully.",
    ],
    image: MEDIA.destinations.wayanad,
    span: "",
    featured: true,
  },
  {
    slug: "thekkady",
    name: "Thekkady",
    line: "Spice hills & Periyar edge",
    summary:
      "Drive into spice country with Periyar nearby — a strong 2–3 day self-drive when you want wildlife buffers and quieter roads than Munnar’s peak weekends.",
    drive: "4h 30m",
    distanceKm: 160,
    suggestedDays: "2–3 days",
    bestFor: "Nature & couples",
    vehicleTip: "SUV or sedan with comfortable seats for the climb via Kottayam / Mundakkayam.",
    recommendedTypes: ["SUV", "Sedan", "MUV"],
    featuredCarSlugs: ["toyota-innova-crysta", "honda-city", "tata-nexon-at"],
    highlights: [
      "Periyar periphery",
      "Spice plantations",
      "Quiet highland roads",
      "Boat safari base",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Kochi → Thekkady",
        detail:
          "Drive via Kottayam. Arrive for evening spice-market stroll and an early night.",
      },
      {
        day: "Day 2",
        title: "Periyar day",
        detail:
          "Morning boat / nature programme, afternoon plantation visit — car stays parked for most of the day.",
      },
      {
        day: "Day 3",
        title: "Optional return",
        detail:
          "Leisurely descent, or extend toward Munnar if you want a twin-hill circuit on a longer rental.",
      },
    ],
    tips: [
      "Wildlife zone timings matter — plan boat slots before you leave Kochi.",
      "Good middle ground between Alleppey ease and Wayanad distance.",
      "Innova / Crysta shines if you’re a family of 5–7 with bags.",
    ],
    image: MEDIA.destinations.thekkady,
    span: "",
    featured: false,
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function getFeaturedDestinations(): Destination[] {
  return DESTINATIONS.filter((d) => d.featured);
}
