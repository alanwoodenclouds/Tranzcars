import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cancellation policy",
  description:
    "Cancellation windows and charges for TranzCars self-drive bookings in Kerala.",
  path: "/cancellation-policy",
});

export default function CancellationPage() {
  return (
    <LegalPage
      currentHref="/cancellation-policy"
      title="Cancellation policy"
      summary="Plans change. Here is exactly what a cancellation costs, based on how close it is to your pick-up time."
      sections={[
        {
          heading: "Cancellation charges",
          bullets: [
            "15 days or more before pick-up: free cancellation of rental charges (payment gateway fees may apply).",
            "14 to 7 days before pick-up: 20% of the rental amount.",
            "6 days to 24 hours before pick-up: 30% of the rental amount.",
            "Within 24 hours of pick-up: 50% of the rental amount.",
            "No-show: 100% of the rental amount and any delivery charge. The security deposit is handled separately.",
          ],
        },
        {
          heading: "How to cancel",
          paragraphs: [
            "Open the booking under My trips and cancel there, or call the Kochi desk. The cancellation window is measured from the time we receive your request, so call early if the deadline is close.",
          ],
        },
        {
          heading: "If we cancel",
          paragraphs: [
            "If a vehicle becomes unavailable we first offer an equivalent or higher category at no extra cost. If nothing suitable is available, you receive a full refund of everything paid, including delivery charges.",
          ],
        },
        {
          heading: "Shortening a trip",
          paragraphs: [
            "Returning a vehicle early does not automatically refund unused days. Tell us before pick-up if your dates might shrink so we can quote the shorter period instead.",
          ],
        },
      ]}
    />
  );
}
