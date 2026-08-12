/** Central imagery for marketing surfaces. Every entry here is in use. */
export const MEDIA = {
  /** Slanted hero collage panels, left to right */
  heroPanels: [
    {
      id: "road",
      alt: "Self-drive car on a winding hill road",
      src: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=85",
      href: "/cars?type=SUV",
    },
    {
      id: "handover",
      alt: "Premium self-drive car ready for hand-over",
      src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=85",
      href: "/cars?transmission=Automatic",
    },
    {
      id: "city",
      alt: "Self-drive hatchback on a tree-lined street",
      src: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85",
      href: "/cars?type=Hatchback",
    },
  ],
  /** Story image in the "why TranzCars" section */
  keralaRoadCar:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80",
  appScreen:
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=80",
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
