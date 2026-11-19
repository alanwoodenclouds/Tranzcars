import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, Phone } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const SUGGESTIONS = [
  { href: "/cars", label: "Browse cars & bikes" },
  { href: "/faq", label: "Rental FAQ" },
  { href: "/contact", label: "Contact the Kochi desk" },
];

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Compass className="size-7" />
      </span>
      <p className="text-numeric mt-8 font-display text-[64px] font-extrabold leading-none tracking-tight text-ink-200">
        404
      </p>
      <h1 className="mt-4 text-display-md">This road doesn’t exist.</h1>
      <p className="text-lead mt-4 max-w-md">
        The page you were looking for has moved or was never here. Let’s get you
        back on route.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">
            <Home />
            Back home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={`tel:${BUSINESS_RULES.phoneE164}`}>
            <Phone />
            {BUSINESS_RULES.phoneDisplay}
          </a>
        </Button>
      </div>

      <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] font-semibold text-ink-500">
        {SUGGESTIONS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-brand-600">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
