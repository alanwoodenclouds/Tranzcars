import * as React from "react";
import { cn } from "@/lib/utils";

/** Eyebrow + title + description block used by every marketing section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        centered && "sm:flex-col sm:items-center",
        className
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          centered && "mx-auto flex flex-col items-center text-center"
        )}
      >
        {eyebrow ? (
          <p className="text-eyebrow mb-3 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-px w-6 bg-brand-400"
            />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-display-md">{title}</h2>
        {description ? (
          <p className="text-lead mt-4">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** Page-level heading for app routes (fleet, trips, account…). */
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-eyebrow mb-2.5">{eyebrow}</p> : null}
        <h1 className="text-display-lg">{title}</h1>
        {description ? (
          <p className="text-lead mt-3">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
