"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, Phone, RotateCcw } from "lucide-react";
import { BUSINESS_RULES } from "@/content/site";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle className="size-7" />
      </span>
      <h1 className="mt-8 text-display-md">Something went off-road.</h1>
      <p className="text-lead mt-4 max-w-md">
        We hit an unexpected error loading this page. Trying again usually fixes
        it — your booking details are safe.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          <RotateCcw />
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <Home />
            Back home
          </Link>
        </Button>
      </div>

      <a
        href={`tel:${BUSINESS_RULES.phoneE164}`}
        className="mt-8 inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink-500 hover:text-ink-900"
      >
        <Phone className="size-4" />
        Book by phone instead — {BUSINESS_RULES.phoneDisplay}
      </a>

      {error.digest ? (
        <p className="text-numeric mt-6 text-[12px] text-ink-400">
          Reference {error.digest}
        </p>
      ) : null}
    </div>
  );
}
