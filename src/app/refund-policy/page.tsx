import type { Metadata } from "next";
import { BUSINESS_RULES } from "@/content/site";
import { LegalPage } from "@/components/legal/legal-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund policy",
  description:
    "TranzCars security deposit and booking refunds — timelines, FasTag rules and pay-later cancellations.",
  path: "/refund-policy",
});

export default function RefundPage() {
  return (
    <LegalPage
      currentHref="/refund-policy"
      title="Refund policy"
      summary="How security deposits and cancelled booking amounts come back to you."
      sections={[
        {
          heading: "Security deposit refund",
          bullets: [
            "The security deposit is fully refundable for all cancellations, including no-shows.",
            `After the vehicle is returned, the deposit is refunded without interest to your bank account or original payment platform within ${BUSINESS_RULES.refundWorkingDays} working days, subject to deductions for charges receivable under the terms (tolls, fines, damages, etc.).`,
          ],
        },
        {
          heading: "Cancelled bookings",
          paragraphs: [
            "Approved cancellations refund the eligible rental/delivery portion after applying the cancellation slab. Refunds are made only through the original payment account — typically within 7–10 working days including bank processing.",
          ],
        },
        {
          heading: "FasTag policy",
          bullets: [
            "The company is not responsible for double payments or penalties related to FasTag usage.",
            "Refunds are not provided for any unused balance in the FasTag wallet after recharging.",
          ],
        },
        {
          heading: "Pay later",
          paragraphs: [
            "If the pay-later option is selected and the remaining booking amount (additional 50%) is not paid when requested by the company, the booking will be cancelled as per company process.",
          ],
        },
        {
          heading: "Processing time",
          paragraphs: [
            `We typically complete refund initiation within ${BUSINESS_RULES.refundWorkingDays} working days of trip completion or cancellation approval. Banks may take additional time. Contact +91 98950 41111 with your booking reference if a refund has not appeared after ${BUSINESS_RULES.refundWorkingDays} working days.`,
          ],
        },
      ]}
    />
  );
}
