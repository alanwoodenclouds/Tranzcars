import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What data TranzCars collects for self-drive rentals, why we need it, and how to have it removed.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      currentHref="/privacy-policy"
      title="Privacy policy"
      summary="We collect the minimum needed to rent you a vehicle legally — and we never sell it."
      sections={[
        {
          heading: "What we collect",
          bullets: [
            "Your mobile number, used as your account identity and verified by OTP.",
            "Name and email, printed on the rental agreement and receipts.",
            "Identity and licence documents, to confirm you are eligible to drive.",
            "Booking details — pick-up point, dates and vehicle — and payment status.",
          ],
        },
        {
          heading: "Why we need it",
          paragraphs: [
            "Rental eligibility and vehicle hand-over are regulated. We use your documents to verify eligibility, to complete the rental agreement, to process payments and refunds, and to reach you during a trip.",
            "We may contact you about an active or recent booking. Marketing messages are opt-in and every one carries an unsubscribe option.",
          ],
        },
        {
          heading: "Who sees it",
          bullets: [
            "Our own staff, limited to the team handling your booking.",
            "Payment providers, for the transaction itself.",
            "Insurers or authorities, only where a claim, challan or legal request requires it.",
            "We do not sell or rent personal data to advertisers or data brokers.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "Completed trips, invoices and tax records are retained as long as Indian accounting and motor-vehicle rules require. Documents attached to abandoned or cancelled bookings are deleted once they are no longer needed.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "Write to us to see, correct or delete your data. Deletion is honoured except where a completed trip must be retained for legal or tax reasons. You can sign out of any device from the account page; signing out does not delete your booking history.",
          ],
        },
      ]}
    />
  );
}
