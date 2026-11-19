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

export type FaqCategory =
  | "eligibility"
  | "pricing"
  | "pickup"
  | "trip"
  | "booking";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
};

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  eligibility: "Eligibility",
  pricing: "Pricing & km",
  pickup: "Pickup & delivery",
  trip: "During your trip",
  booking: "Booking & refunds",
};

export type UserSession = {
  token: string;
  mobile: string;
  name?: string;
  email?: string;
};

export { BUSINESS_RULES } from "@/constants/businessRules";

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
    image: "/images/fleet/mahindra-thar-roxx.jpg",
    popular: true,
    tripHint: "Ideal for Munnar & hill trips",
    features: ["4×4 ready", "Automatic", "Diesel", "Hill trips"],
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
    image: "/images/fleet/innova-hycross.png",
    popular: true,
    tripHint: "Family & group travel",
    features: ["7-seater", "Manual", "Diesel", "Airport runs"],
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
    features: ["Automatic", "Petrol", "Easy parking", "City"],
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
    image: "/images/fleet/tata-punch.png",
    popular: true,
    tripHint: "Weekend getaways",
    features: ["Automatic", "Petrol", "Compact SUV", "Weekends"],
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
    features: ["Manual", "Petrol", "Boot space", "Highway"],
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
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
    popular: false,
    tripHint: "Budget-friendly city car",
    features: ["Manual", "Petrol", "City", "Value"],
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
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=80",
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

/** Testimonials from https://www.tranzcars.com (unique reviews). */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Ravi Jakhar",
    title: "It was a great experience!",
    body: "We hired a car for Kerala trip from them. This trip was so fantastic and car company service was very good. Provided a new condition car. Thanks Tranz Cars.",
  },
  {
    id: "2",
    name: "Muzamil Hasham",
    title: "Good Experience",
    body: "Great experience over all. Right from booking process to delivery at airport and pick up after we used the car was quite seamless. The car was clean and had no issues. The refund process of the deposit was also very seamless and promptly done. Highly recommend Tranz cars.",
  },
  {
    id: "3",
    name: "Karthikeyan M S",
    title: "Good Experience",
    body: "We booked Thar Roxx in Tranzcars with Vineesh for Munnar and Vagamon trip. Car was so clean and hassle free process related to documents. Car was maintained in very good condition and their service is top. Mr. Vineesh assisted throughout the process — he was kind and arranged everything on time. On a scale of 1 to 10 I'll recommend this for 10.",
  },
  {
    id: "4",
    name: "Parivesh C",
    title: "Quickly and Efficiently",
    body: "This is the best car rental I have used so far. I took Swift AT for 8 days and it was a wonderful experience. My pickup and drop was at Kochi airport and they provide services round the clock. They delivered the car at 3 AM in the morning. The guy was on time and we didn't have to wait at all. Cars are in very good condition — good as new. Highly recommended.",
  },
  {
    id: "5",
    name: "Deepak Deepu",
    title: "Great collaboration",
    body: "Outstanding service from Tranzcars! Easily the best car rental experience I've had. Super smooth pickup and drop-off right at Kochi Airport for my 10-day rental. Extremely nice staff, great dealings, and a flawless car. Will definitely use them again!",
  },
  {
    id: "6",
    name: "Manojkumar M",
    title: "It was a great experience!",
    body: "I had a fantastic experience with Tranz Cars Kalamassery. What impressed me most was the wide range of cars they have available — everything from budget-friendly hatchbacks to premium SUVs. All the vehicles are in excellent condition, very clean, and well-maintained. If you're looking for variety and quality at a fair price, this is the place to go!",
  },
  {
    id: "7",
    name: "Travel Diaries India",
    title: "Quickly and Efficiently",
    body: "I want to say a big thank you to Tranzcars for giving us a wonderful service. We hired a car for two days and the check out as well as check in process was hassle free and done in not less than ten minutes even though it was in the morning at 6am. The car was clean and in good condition and we got it at an affordable price with kms range that was beyond the limit which other service providers gave. Overall, it was a good trip with a safe ride.",
  },
];

/** FAQs curated from https://www.tranzcars.com and /faq */
export const FAQS: Faq[] = [
  {
    id: "1",
    category: "eligibility",
    question: "Is TranzCars a government-approved car rental company?",
    answer:
      "Yes. TranzCars is a government-approved, licensed self-drive car rental operator in Kerala, operating since 2017 as a Kerala Govt Approved Self Drive Rent A Cab company.",
  },
  {
    id: "2",
    category: "eligibility",
    question: "Am I eligible to use TranzCars services?",
    answer:
      "Indian citizens must be above 23 years of age, hold a valid Indian driving licence that is at least three years old, and present an Aadhaar card or voter ID. Foreign nationals must be above 23, hold a valid International Driving Permit, their home-country driving licence, and a passport with a valid visa. Original documents are required at delivery.",
  },
  {
    id: "3",
    category: "pricing",
    question: "How many free kilometres do I get per day?",
    answer:
      "Every TranzCars rental includes 120 km of free driving per day. Extra kilometres beyond the daily free limit are charged at the published per-km rate for that vehicle.",
  },
  {
    id: "4",
    category: "pickup",
    question: "Can I pick up a car at Cochin Airport?",
    answer:
      "Yes. TranzCars offers pickup and drop at Cochin International Airport and Ernakulam railway station, plus doorstep / home delivery across service areas in Kerala and South India.",
  },
  {
    id: "5",
    category: "pricing",
    question: "Do I need to pay a security deposit?",
    answer:
      "Yes. A refundable security deposit is collected and returned after your trip (typically within 7 working days), minus any tolls, fines or damages as per the terms.",
  },
  {
    id: "6",
    category: "eligibility",
    question: "What documents do I need at delivery?",
    answer:
      "Original driving licence (with clear photo) and Aadhaar or passport. Printed A4 copies of the licence are not accepted. Foreign nationals also need the original International Driving Permit, home-country licence, and passport. Missing originals are treated as a late cancellation.",
  },
  {
    id: "7",
    category: "booking",
    question: "Can I book a TranzCars car with a driver?",
    answer:
      "No. TranzCars is self-drive only — you drive the vehicle yourself. There is no chauffeur option.",
  },
  {
    id: "8",
    category: "pickup",
    question: "Does TranzCars operate outside Kochi?",
    answer:
      "Yes. TranzCars is headquartered in Kochi and operates throughout Kerala (including Trivandrum and Calicut), with delivery and drop-off available anywhere in South India.",
  },
  {
    id: "9",
    category: "pricing",
    question: "Is fuel included in my booking?",
    answer:
      "Fuel is not included. Return the vehicle at the same fuel level you received. Top-up costs apply if the level is lower; unused extra fuel is not refunded.",
  },
  {
    id: "10",
    category: "pricing",
    question: "Who pays for tolls, parking and traffic fines?",
    answer:
      "You pay tolls, FasTag usage, parking, interstate entry taxes and any traffic / parking fines incurred during the rental. Challans that arrive after return remain your responsibility.",
  },
  {
    id: "11",
    category: "booking",
    question: "What if I need to modify or cancel my booking?",
    answer:
      "You can modify or cancel via the website or by calling us. Charges depend on how close you are to pick-up time — see the Cancellation Policy. Security deposit is fully refundable on cancellations including no-shows; deductions apply only to rental and delivery charges.",
  },
  {
    id: "12",
    category: "booking",
    question: "How long do refunds take?",
    answer:
      "Refunds are typically initiated within 7 working days to the original payment account or bank. Bank processing may add a few days — contact us if a refund has not appeared after 7 working days.",
  },
  {
    id: "13",
    category: "trip",
    question: "Is there a speed limit?",
    answer:
      "Yes. Vehicles have tracking devices and the maximum speed limit is 80 km/h. Overspeeding attracts a penalty as per company policy.",
  },
  {
    id: "14",
    category: "trip",
    question: "Can I take a pet along?",
    answer:
      "Pets are not allowed in TranzCars vehicles. A cleaning charge applies if this rule is violated.",
  },
  {
    id: "15",
    category: "trip",
    question: "What do I do if the vehicle breaks down or I meet with an accident?",
    answer:
      "Call TranzCars immediately on +91 98950 41111. Do not leave the scene unless unavoidable. Take spot photos, inform the local police (GD / FIR as required), and follow instructions from our team and the insurer.",
  },
];
