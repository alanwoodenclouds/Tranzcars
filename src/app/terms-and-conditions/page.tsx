import type { Metadata } from "next";
import { BUSINESS_RULES } from "@/content/site";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "Self-drive eligibility, kilometre allowance, fuel and permit rules for TranzCars rentals.",
};

export default function TermsPage() {
  return (
    <LegalPage
      currentHref="/terms-and-conditions"
      title="Terms and conditions"
      summary="What you agree to when you book a self-drive car or bike with TranzCars."
      sections={[
        {
          heading: "Who can drive",
          bullets: [
            `Minimum age ${BUSINESS_RULES.eligibilityAge} years.`,
            `A valid LMV driving licence held for at least ${BUSINESS_RULES.licenceYears} year (a valid motorcycle licence for two-wheelers).`,
            "Original licence and one government photo ID must be presented at hand-over — digital copies alone are not accepted.",
            "Only the named renter may drive. Additional drivers must be added on the agreement before the trip starts.",
          ],
        },
        {
          heading: "Kilometres and extra usage",
          paragraphs: [
            `Car rentals include ${BUSINESS_RULES.kmPerDay} km free per day, calculated across the whole booking rather than per calendar day. Bikes and scooters carry model-specific free kilometres shown on each listing.`,
            "Distance beyond the included allowance is billed at the published excess-km rate for that vehicle and settled at return.",
          ],
        },
        {
          heading: "Fuel, tolls and fines",
          bullets: [
            "Vehicles are handed over and must be returned at the same fuel level, unless a different arrangement is written on the agreement.",
            "Tolls, parking, congestion charges and traffic fines during your rental period are payable by you.",
            "Challans that arrive after return are recovered from the security deposit or billed separately with the notice attached.",
          ],
        },
        {
          heading: "Duration and extensions",
          paragraphs: [
            `The minimum rental period is ${BUSINESS_RULES.minRentalHours} hours. Extensions are subject to availability — call us before your drop-off time so we can hold the vehicle.`,
            "Late returns without an approved extension are charged at the daily rate plus a late fee.",
          ],
        },
        {
          heading: "Permitted use",
          bullets: [
            "Vehicles carry an All India Tourist Permit; interstate travel is allowed but must be declared so state permits can be arranged.",
            "No commercial passenger service, racing, off-roading, towing, driving under the influence, or overloading beyond the seating capacity.",
            "Sub-letting or handing the vehicle to an unregistered driver voids insurance cover.",
          ],
        },
        {
          heading: "Damage and insurance",
          paragraphs: [
            "All vehicles carry comprehensive insurance. In the event of damage you are responsible for the applicable deductible, plus the full loss where insurance is void because of a breach of these terms.",
            "Report any accident to us and to the police immediately; insurance claims require an FIR or written report.",
          ],
        },
      ]}
    />
  );
}
