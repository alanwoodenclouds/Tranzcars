export type Branch = {
  id: string;
  name: string;
  city: string;
  type: "office" | "airport" | "railway" | "delivery";
  lat: number;
  lng: number;
};

export type Car = {
  id: string;
  slug: string;
  name: string;
  /** Fleet kind — cars vs bikes/scooters */
  category: "car" | "bike";
  type: string;
  transmission: "Automatic" | "Manual";
  seats: number;
  fuel: string;
  pricePerDay: number;
  image: string;
  popular?: boolean;
  tripHint?: string;
  features: string[];
  kmPerDay: number;
};

export type Testimonial = {
  id: string;
  name: string;
  title: string;
  body: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type UserSession = {
  token: string;
  mobile: string;
  name?: string;
  email?: string;
};

/** Canonical business rules for v1 marketing copy */
export const BUSINESS_RULES = {
  kmPerDay: 120,
  mvdApproved: true,
  foundedYear: 2017,
  googleRating: 4.6,
  googleReviewCount: "1000+",
  phoneDisplay: "+91 98950 41111",
  phoneE164: "919895041111",
  minRentalHours: 24,
  deliveryCharge: 1500,
  seniorDiscountPercent: 15,
  ladyDiscountPercent: 10,
  eligibilityAge: 21,
  licenceYears: 1,
} as const;

export const BRANCHES: Branch[] = [
  {
    id: "cok-airport",
    name: "Cochin Airport (COK)",
    city: "Kochi",
    type: "airport",
    lat: 10.152,
    lng: 76.4019,
  },
  {
    id: "kalamassery",
    name: "Kalamassery Office",
    city: "Kochi",
    type: "office",
    lat: 10.0535,
    lng: 76.328,
  },
  {
    id: "ernakulam-jn",
    name: "Ernakulam Junction",
    city: "Kochi",
    type: "railway",
    lat: 9.9688,
    lng: 76.2875,
  },
  {
    id: "vyttila",
    name: "Vyttila",
    city: "Kochi",
    type: "office",
    lat: 9.967,
    lng: 76.318,
  },
  {
    id: "home-delivery-kochi",
    name: "Home Delivery – Kochi",
    city: "Kochi",
    type: "delivery",
    lat: 9.9816,
    lng: 76.2999,
  },
  {
    id: "trv-airport",
    name: "Trivandrum Airport (TRV)",
    city: "Trivandrum",
    type: "airport",
    lat: 8.4821,
    lng: 76.92,
  },
  {
    id: "calicut-airport",
    name: "Calicut Airport",
    city: "Kozhikode",
    type: "airport",
    lat: 11.1368,
    lng: 75.9553,
  },
];

export const CARS: Car[] = [
  {
    id: "1",
    slug: "mahindra-thar-roxx",
    name: "Mahindra Thar Roxx",
    category: "car",
    type: "SUV",
    transmission: "Automatic",
    seats: 5,
    fuel: "Diesel",
    pricePerDay: 4500,
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
    popular: true,
    tripHint: "Ideal for Munnar & hill trips",
    features: ["Automatic", "5-seater", "Diesel", "SUV"],
    kmPerDay: 120,
  },
  {
    id: "2",
    slug: "toyota-innova-crysta",
    name: "Toyota Innova Crysta",
    category: "car",
    type: "MUV",
    transmission: "Manual",
    seats: 7,
    fuel: "Diesel",
    pricePerDay: 4200,
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
    popular: true,
    tripHint: "Family & group travel",
    features: ["Manual", "7-seater", "Diesel", "MUV"],
    kmPerDay: 120,
  },
  {
    id: "3",
    slug: "maruti-swift-at",
    name: "Maruti Swift AT",
    category: "car",
    type: "Hatchback",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    pricePerDay: 2200,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    popular: true,
    tripHint: "City drives & airport runs",
    features: ["Automatic", "5-seater", "Petrol", "Hatchback"],
    kmPerDay: 120,
  },
  {
    id: "4",
    slug: "tata-nexon-at",
    name: "Tata Nexon AT",
    category: "car",
    type: "Compact SUV",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    pricePerDay: 2800,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    popular: true,
    tripHint: "Weekend getaways",
    features: ["Automatic", "5-seater", "Petrol", "Compact SUV"],
    kmPerDay: 120,
  },
  {
    id: "5",
    slug: "honda-city",
    name: "Honda City",
    category: "car",
    type: "Sedan",
    transmission: "Manual",
    seats: 5,
    fuel: "Petrol",
    pricePerDay: 2600,
    image:
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80",
    popular: false,
    tripHint: "Comfortable long drives",
    features: ["Manual", "5-seater", "Petrol", "Sedan"],
    kmPerDay: 120,
  },
  {
    id: "6",
    slug: "hyundai-i20",
    name: "Hyundai i20",
    category: "car",
    type: "Hatchback",
    transmission: "Manual",
    seats: 5,
    fuel: "Petrol",
    pricePerDay: 2000,
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    popular: false,
    tripHint: "Budget-friendly city car",
    features: ["Manual", "5-seater", "Petrol", "Hatchback"],
    kmPerDay: 120,
  },

  {
    id: "7",
    slug: "ather-450x",
    name: "Ather 450X",
    category: "bike",
    type: "E-Scooter",
    transmission: "Automatic",
    seats: 2,
    fuel: "Electric",
    pricePerDay: 899,
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
    popular: true,
    tripHint: "City zip & Fort Kochi runs",
    features: ["Electric", "2-seater", "Connected", "E-Scooter"],
    kmPerDay: 80,
  },
  {
    id: "8",
    slug: "ola-s1-pro",
    name: "Ola S1 Pro",
    category: "bike",
    type: "E-Scooter",
    transmission: "Automatic",
    seats: 2,
    fuel: "Electric",
    pricePerDay: 799,
    image:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=80",
    popular: true,
    tripHint: "Quiet electric daily rides",
    features: ["Electric", "2-seater", "Fast charge", "E-Scooter"],
    kmPerDay: 80,
  },
  {
    id: "9",
    slug: "tvs-iqube",
    name: "TVS iQube",
    category: "bike",
    type: "E-Scooter",
    transmission: "Automatic",
    seats: 2,
    fuel: "Electric",
    pricePerDay: 699,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80",
    popular: false,
    tripHint: "Reliable commute scooter",
    features: ["Electric", "2-seater", "Smart dash", "E-Scooter"],
    kmPerDay: 80,
  },
  {
    id: "10",
    slug: "royal-enfield-hunter-350",
    name: "Royal Enfield Hunter 350",
    category: "bike",
    type: "Motorcycle",
    transmission: "Manual",
    seats: 2,
    fuel: "Petrol",
    pricePerDay: 1299,
    image:
      "https://images.unsplash.com/photo-1558981852-426c6c22a060?auto=format&fit=crop&w=1200&q=80",
    popular: true,
    tripHint: "Coastal & weekend rides",
    features: ["Petrol", "2-seater", "Manual", "Motorcycle"],
    kmPerDay: 100,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Muzamil Hasham",
    title: "Seamless airport delivery",
    body: "Right from booking to delivery at Kochi Airport and pickup after, the process was seamless. Clean car, prompt deposit refund. Highly recommend.",
  },
  {
    id: "2",
    name: "Karthikeyan M S",
    title: "Thar for Munnar & Vagamon",
    body: "Booked Thar Roxx for Munnar and Vagamon. Car was clean, documents hassle-free, and Vineesh arranged everything on time. 10/10.",
  },
  {
    id: "3",
    name: "Parivesh C",
    title: "3 AM airport pickup",
    body: "Took Swift AT for 8 days with Kochi Airport pickup at 3 AM. Staff on time, car like new. Best self-drive rental I've used.",
  },
  {
    id: "4",
    name: "Deepak Deepu",
    title: "10-day rental",
    body: "Outstanding service. Smooth pickup and drop at Kochi Airport for a 10-day rental. Friendly staff and a flawless car.",
  },
];

export const FAQS: Faq[] = [
  {
    id: "1",
    question: "Is TranzCars a government-approved rental company?",
    answer:
      "Yes. TranzCars is a government-approved, licensed self-drive operator in Kerala (MVD authorised), offering cars and bikes since 2017.",
  },
  {
    id: "2",
    question: "How many free kilometres do I get per day?",
    answer:
      "Car rentals include 120 km free per day. Bike & scooter rentals include 80–100 km free per day depending on the model. Extra kilometres are charged at the published per-km rate.",
  },
  {
    id: "3",
    question: "Can I pick up at Cochin Airport?",
    answer:
      "Yes. TranzCars offers pickup and drop for cars and bikes at Cochin International Airport and Ernakulam railway station, with advance booking. Home delivery is also available within service areas.",
  },
  {
    id: "4",
    question: "Do I need to pay a security deposit?",
    answer:
      "A refundable security deposit applies and is returned after your trip, minus any tolls or fines.",
  },
  {
    id: "5",
    question: "What documents do I need?",
    answer:
      "Cars: original LMV licence held for at least 1 year. Bikes & scooters: valid two-wheeler licence (MCWG / equivalent). Aadhaar or passport for ID. Drivers must be 21 or older. Self-drive only — no chauffeur.",
  },
  {
    id: "6",
    question: "When do I need to create an account?",
    answer:
      "You can search and browse cars & bikes without signing in. We only ask for mobile OTP verification at checkout before payment.",
  },
];
