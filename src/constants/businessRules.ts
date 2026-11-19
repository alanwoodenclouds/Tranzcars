/** Canonical business rules — sourced from https://www.tranzcars.com */
export const BUSINESS_RULES = {
  kmPerDay: 120,
  speedLimitKmh: 80,
  mvdApproved: true,
  foundedYear: 2017,
  googleRating: 4.6,
  googleReviewCount: "1000+",
  phoneDisplay: "+91 98950 41111",
  phoneE164: "919895041111",
  phoneAltDisplay: "+91 98952 65111",
  phoneAltE164: "919895265111",
  minRentalHours: 24,
  deliveryCharge: 1500,
  airportDeliveryOneWay: 1100,
  seniorDiscountPercent: 15,
  ladyDiscountPercent: 10,
  /** Terms & Conditions eligibility (tranzcars.com) */
  eligibilityAge: 23,
  licenceYears: 3,
  coDriverFee: 1000,
  smokingFine: 2500,
  petFine: 2500,
  lateReturnFine: 2000,
  maxDamageLiability: 25000,
  refundWorkingDays: 7,
  legalName: "Trust Pilot Trans & Trades Pvt Ltd",
  brandLegalName: "TranzCars",
  addressLine:
    "Metro Pillar No-287, In front of Ashis Convention Centre, South Kalamassery, Kochi, Kerala 682022",
  address: {
    streetAddress:
      "Metro Pillar No-287, In front of Ashis Convention Centre, South Kalamassery",
    addressLocality: "Kochi",
    addressRegion: "Kerala",
    postalCode: "682022",
    addressCountry: "IN",
  },
  email: "hello@tranzcars.com",
  ownership:
    "A joint venture of 10 leading Kerala travel operators and a division of Trust Pilot Trans & Trades Pvt Ltd",
  fleetSizeLabel: "100+",
  fleetVariantsLabel: "50+",
} as const;
