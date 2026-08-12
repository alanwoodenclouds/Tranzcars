import Link from "next/link";
import { Compass, Home, Phone } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Button } from "@/components/ui/button";

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

      <ul className="mt-10 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="interactive inline-flex rounded-full border border-hairline bg-surface px-3.5 py-2 text-[13px] font-semibold text-ink-600 hover:border-ink-300 hover:text-ink-900"
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
