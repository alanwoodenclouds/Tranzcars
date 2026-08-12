import * as React from "react";
import { cn } from "@/lib/utils";

/** Banded hero used at the top of static/marketing routes. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "hairline-b relative isolate overflow-hidden bg-surface-sunken",
        className
      )}
    >
      <div aria-hidden className="bg-aurora absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden
        className="bg-grid mask-fade-b absolute inset-0 -z-10 opacity-[0.5]"
      />
      <div className="container-page py-14 sm:py-20">
        <div className="max-w-2xl">
          {eyebrow ? <p className="text-eyebrow mb-3">{eyebrow}</p> : null}
          <h1 className="text-display-lg">{title}</h1>
          {description ? <p className="text-lead mt-4">{description}</p> : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
