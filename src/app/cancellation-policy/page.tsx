import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cancellation policy",
  description:
    "TranzCars cancellation slabs — charges on rental and delivery only; security deposit fully refundable including no-shows.",
  path: "/cancellation-policy",
});

export default function CancellationPage() {
  return (
    <LegalPage
      currentHref="/cancellation-policy"
      title="Cancellation policy"
      summary="Cancellation charges apply only on the rental amount and delivery charges. The security deposit is fully refundable for all cancellations, including no-shows."
      sections={[
        {
          heading: "What is charged",
          paragraphs: [
            "Cancellation charges are applicable only on the rental amount and delivery charges. The security deposit will be fully refundable for all cancellations, including no-shows.",
          ],
        },
        {
          heading: "Cancellation charges by pick-up time",
          bullets: [
            "15 days or more: 10% deduction",
            "14 to 7 days: 20% deduction",
            "6 to 1 day: 30% deduction",
            "Within 24 hours: 50% deduction",
            "No-show / without email cancellation: 100% deduction",
          ],
        },
        {
          heading: "How to cancel",
          paragraphs: [
            "Cancel through the website (My trips) or by calling / emailing the Kochi desk. The slab is measured from the time we receive your cancellation request against the scheduled pick-up time.",
          ],
        },
        {
          heading: "Shortening a trip",
          paragraphs: [
            "If you return early, we can try arranging an earlier pickup when you inform us at least 3 hours before the agreed drop-off. No refund applies on the base fare for the original booking period.",
          ],
        },
        {
          heading: "If we cancel",
          paragraphs: [
            "If verification fails because documents are not submitted, only the security deposit is refunded. If we cannot provide a vehicle, we offer an equivalent alternative where possible or refund amounts paid as applicable.",
          ],
        },
      ]}
    />
  );
}
