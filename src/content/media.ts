/** Central imagery for marketing surfaces. Every entry here is in use. */
export const MEDIA = {
  /** Slanted hero collage panels, left to right — TranzCars fleet photos */
  heroPanels: [
    {
      id: "fronx",
      alt: "Maruti Suzuki Fronx self-drive crossover — TranzCars Kochi",
      src: "/images/fleet/maruti-fronx.png",
      href: "/cars?type=SUV",
    },
    {
      id: "hycross",
      alt: "Toyota Innova Hycross self-drive MUV — TranzCars Kochi",
      src: "/images/fleet/innova-hycross.png",
      href: "/cars?type=MUV",
    },
    {
      id: "punch",
      alt: "Tata Punch self-drive compact SUV — TranzCars Kochi",
      src: "/images/fleet/tata-punch.png",
      href: "/cars?type=SUV",
    },
  ],
  /** Story image in the "why TranzCars" section */
  keralaRoadCar: "/images/fleet/innova-hycross.png",
  appScreen: "/images/fleet/mobile-booking-ui.jpg",
  destinations: {
    munnar:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1400&q=80",
    alleppey:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80",
    wayanad:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
    kozhikode:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  },
} as const;
