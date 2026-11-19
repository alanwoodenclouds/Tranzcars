import type { Metadata } from "next";
import { BUSINESS_RULES } from "@/content/site";
import { LegalPage } from "@/components/legal/legal-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms and conditions",
  description:
    "TranzCars self-drive rental terms — eligibility, kilometres, fuel, cancellation, liability and jurisdiction in Kerala.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <LegalPage
      currentHref="/terms-and-conditions"
      title="Rental terms & conditions"
      summary="What you agree to when you book a self-drive vehicle with TranzCars. Sourced from our live rental agreement."
      sections={[
        {
          heading: "Eligibility",
          bullets: [
            `Indian citizen: must be above ${BUSINESS_RULES.eligibilityAge} years of age, hold a minimum ${BUSINESS_RULES.licenceYears}-year-old valid Indian driving licence, and an Aadhaar card or voter’s ID.`,
            `Foreigner: must be above ${BUSINESS_RULES.eligibilityAge} years of age, hold a valid International Driving Permit along with their mother country’s driving licence and a passport with a valid visa.`,
          ],
        },
        {
          heading: "Verification & delivery",
          bullets: [
            "The booking is confirmed only after successful verification by our backend team.",
            "The vehicle is handed over only after verification is completed at delivery.",
            "If required documents are not submitted, TranzCars may cancel the booking and refund only the security deposit.",
            "Original driving licence (clear photo) and Aadhaar/passport are mandatory. Foreign nationals must also present the original IDP, home-country licence and passport.",
          ],
        },
        {
          heading: "Kilometres, fuel & pricing",
          bullets: [
            `Every rental includes ${BUSINESS_RULES.kmPerDay} km free driving per day. Extra kilometres are charged at the published per-km rate.`,
            "Fuel is not included. Return the vehicle at the same fuel level provided at pick-up. Extra fuel at return is not refunded.",
            "Rent, refundable security deposit, delivery/drop-off and location charges are calculated dynamically and may vary.",
            `Airport delivery (one way) may attract additional charges (from ₹${BUSINESS_RULES.airportDeliveryOneWay}).`,
          ],
        },
        {
          heading: "Toll, parking & FasTag",
          bullets: [
            "Customers must pay all toll, FasTag, parking charges and interstate permit entry taxes during the rental period.",
            "All vehicles have an active FasTag; customers pay FasTag charges used during the trip.",
            "The company is not responsible for double payments or FasTag-related penalties.",
          ],
        },
        {
          heading: "Interstate travel",
          bullets: [
            "Inform the company by email before pick-up if you intend to travel outside Kerala.",
            "All interstate permits and other check-post charges are paid by the customer before crossing state borders.",
            "Vehicles carry All India Tourist Permit documents (RC, insurance, self-drive licence, permit).",
          ],
        },
        {
          heading: "Speed, traffic & vehicle use",
          bullets: [
            `All cars have government-approved tracking devices. Maximum speed limit is ${BUSINESS_RULES.speedLimitKmh} km/h.`,
            "Customers are responsible for traffic violation penalties, including seat-belt violations.",
            `Smoking or alcohol consumption inside the car: ₹${BUSINESS_RULES.smokingFine} charge.`,
            `Pets are not allowed; violation attracts ₹${BUSINESS_RULES.petFine} interior cleaning charge.`,
            "Vehicles are for personal/official travel only — not for hire, logistics, sports, adventure off-roading or illegal activity.",
            "Only the named booking customer may drive, unless a co-driver is added before the trip.",
            `Co-driver can be added for ₹${BUSINESS_RULES.coDriverFee} with a valid driving licence submitted before starting.`,
          ],
        },
        {
          heading: "Late return & shortening",
          bullets: [
            `Delay without prior email approval: fine of ₹${BUSINESS_RULES.lateReturnFine} plus hourly rental charges.`,
            "Delay of more than 6 hours is considered one day’s rental.",
            "Early return: we can arrange earlier pickup if informed at least 3 hours before drop-off; no refund on the original base fare.",
          ],
        },
        {
          heading: "Cancellation charges",
          paragraphs: [
            "Cancellation charges apply only on rental amount and delivery charges. Security deposit is fully refundable for all cancellations, including no-shows.",
          ],
          bullets: [
            "15 days or more before pick-up: 10% deduction",
            "14 to 7 days: 20% deduction",
            "6 to 1 day: 30% deduction",
            "Within 24 hours: 50% deduction",
            "No-show / without email cancellation: 100% deduction",
          ],
        },
        {
          heading: "Accidents, damage & liability",
          bullets: [
            "Inform TranzCars Customer Relations / Operations immediately and follow insurer instructions. Spot survey (photos/videos) and GD entry from the nearest police station are required where applicable.",
            `User liability for vehicle damage is limited to a maximum of ₹${BUSINESS_RULES.maxDamageLiability.toLocaleString("en-IN")}, except where limited liability does not apply.`,
            "Limited liability does not apply for DUI, rash driving, wrong driver, Motor Vehicles Act violations, unpaid interstate tax, criminal misuse, or failure to follow claim procedures.",
            "Downtime charges may apply based on repair period. Unused rental days are not refunded after an accident.",
            "Extra km, fuel, damage and traffic fines due at return are not adjusted against the security deposit.",
          ],
        },
        {
          heading: "Security deposit refund",
          paragraphs: [
            `Deposit is refunded only to the customer’s bank account or original payment platform within ${BUSINESS_RULES.refundWorkingDays} working days from return of the vehicle, subject to deductions for dues under these terms.`,
          ],
        },
        {
          heading: "Other terms",
          bullets: [
            "TranzCars is not responsible for personal belongings left after drop-off.",
            "The company may provide a similar, higher or lower category vehicle (with rental regularised) in case of accident, breakdown or natural calamities.",
            "Management reserves the right to refuse a vehicle without stating a reason.",
            "Disputes are subject to the exclusive jurisdiction of the courts at Ernakulam, Kerala.",
            `Operating entity: ${BUSINESS_RULES.legalName}.`,
          ],
        },
      ]}
    />
  );
}
