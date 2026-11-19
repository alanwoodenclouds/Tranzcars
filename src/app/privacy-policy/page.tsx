import type { Metadata } from "next";
import { BUSINESS_RULES } from "@/content/site";
import { LegalPage } from "@/components/legal/legal-page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy",
  description:
    "How TranzCars collects, uses and protects personal information under the Information Technology Act, 2000.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      currentHref="/privacy-policy"
      title="Privacy policy"
      summary="This privacy policy is an electronic record under the Information Technology Act, 2000. By using www.tranzcars.com you consent to this policy."
      sections={[
        {
          heading: "About this policy",
          paragraphs: [
            "This Privacy Policy sets out how TranzCars collects, uses, protects and shares information you give us when you use www.tranzcars.com and related apps. It is a legally binding document between you and TranzCars, read together with our membership / rental terms.",
            "It is published in accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.",
          ],
        },
        {
          heading: "Personal information we collect",
          bullets: [
            "Name, age, gender, photograph, contact preferences, telephone number and mailing addresses",
            "Email address, financial / payment information, IP address and booking & payment history",
            "Driving licence and address / identity proofs required for membership and vehicle hand-over",
            "Device identifiers used to access the website",
            "Vehicle use data from in-vehicle hardware (security, theft prevention and trip assistance)",
            "Location tracking of the rental vehicle for security, emergencies and recovery / insurance",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "We use your information to create and maintain your account, verify eligibility, complete rental agreements, process payments and refunds, provide roadside support, prevent fraud/theft, and improve our services.",
            "You authorise us to access driving / vehicle history from applicable authorities where required for membership. Location data may be shared with insurers, police or courts during investigations or emergencies.",
          ],
        },
        {
          heading: "Sharing with third parties",
          bullets: [
            "Processors who handle data on our behalf under confidentiality and security obligations",
            "When required by law, regulation, court order or to detect fraud / enforce our terms",
            "To protect TranzCars assets and defend against third-party claims",
            "In connection with a sale or transfer of business assets",
            "Partners for related services you opt into (e.g. referrals), limited to what is reasonably needed",
            "Vendors who provide infrastructure, analytics, payments, customer support or research",
          ],
        },
        {
          heading: "Cookies & non-personal data",
          paragraphs: [
            "We collect non-personal information such as browser type and usage details, and may use cookies, web beacons and similar technologies. You can control cookies in your browser; some features may not work if cookies are disabled. Aggregated anonymous data may be shared with third parties for analytics.",
          ],
        },
        {
          heading: "Security & retention",
          paragraphs: [
            "We take administrative, technical and physical precautions — including encryption and access controls — to safeguard personal information. Your right to claim damages is limited as provided under the Information Technology Act, 2000.",
            "Personal information is retained for as long as needed for the purpose or as required by applicable law, whichever is later. Non-personal information may be retained indefinitely.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You may request that we discontinue use of your personal information by closing your account. We do not intentionally collect information from children 15 years of age or younger.",
            `For privacy requests contact ${BUSINESS_RULES.phoneDisplay} or write to us at ${BUSINESS_RULES.addressLine}.`,
          ],
        },
        {
          heading: "Refunds & cancellations (summary)",
          bullets: [
            "Refunds are made through the original payment account within 7–10 working days where applicable.",
            "Cancellation charges apply only on rental and delivery; security deposit remains fully refundable including no-shows — see Cancellation and Refund policies for slabs.",
          ],
        },
        {
          heading: "Changes",
          paragraphs: [
            "We may update this policy on the website without prior notice. Continued use of the website means you accept the updated policy.",
          ],
        },
      ]}
    />
  );
}
