import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Refund policy",
  description:
    "How TranzCars refunds security deposits and cancelled bookings, and how long it takes.",
};

export default function RefundPage() {
  return (
    <LegalPage
      currentHref="/refund-policy"
      title="Refund policy"
      summary="How money comes back to you — deposits, cancelled bookings and processing times."
      sections={[
        {
          heading: "Security deposits",
          paragraphs: [
            "The refundable security deposit is released after the vehicle is inspected at return and once tolls, fines and damages (if any) are settled.",
          ],
          bullets: [
            "Clean return with no dues: deposit released within 3 working days.",
            "Pending challans or insurance assessment: we hold only the disputed amount and release the rest.",
            "Every deduction is shared with the supporting document — a challan notice, invoice or repair estimate.",
          ],
        },
        {
          heading: "Cancelled bookings",
          paragraphs: [
            "Approved cancellations are refunded to the original payment method according to the cancellation schedule. We do not issue cash refunds for online payments.",
          ],
        },
        {
          heading: "Processing time",
          paragraphs: [
            "We initiate refunds within 3 working days of approval. The time it takes to appear in your account depends on your bank, card issuer or UPI provider — typically 5 to 7 working days.",
          ],
        },
        {
          heading: "Disputes",
          paragraphs: [
            "If a refund seems wrong, call the Kochi desk with your booking reference. We keep hand-over photos, the return checklist and the fuel reading for every trip and will walk you through them.",
          ],
        },
      ]}
    />
  );
}
