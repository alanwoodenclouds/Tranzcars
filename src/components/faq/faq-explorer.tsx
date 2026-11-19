"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import type { Faq, FaqCategory } from "@/content/site";
import { FAQ_CATEGORY_LABELS } from "@/content/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useToggleAiAssistant } from "@/hooks/useAiAssistantUi";
import { cn } from "@/utils";

type Filter = "all" | FaqCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All questions" },
  ...(Object.keys(FAQ_CATEGORY_LABELS) as FaqCategory[]).map((id) => ({
    id,
    label: FAQ_CATEGORY_LABELS[id],
  })),
];

export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const openAi = useToggleAiAssistant();

  const counts = useMemo(() => {
    const map: Record<Filter, number> = {
      all: faqs.length,
      eligibility: 0,
      pricing: 0,
      pickup: 0,
      trip: 0,
      booking: 0,
    };
    for (const faq of faqs) map[faq.category] += 1;
    return map;
  }, [faqs]);

  const visible = useMemo(() => {
    return faqs.filter((faq) => {
      if (filter !== "all" && faq.category !== filter) return false;
      if (!deferredQuery) return true;
      return (
        faq.question.toLowerCase().includes(deferredQuery) ||
        faq.answer.toLowerCase().includes(deferredQuery)
      );
    });
  }, [faqs, filter, deferredQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5">
        <label className="relative block max-w-xl">
          <span className="sr-only">Search FAQs</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deposits, airport, licence…"
            className="h-12 pl-10"
            autoComplete="off"
          />
        </label>

        <div
          role="tablist"
          aria-label="FAQ categories"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-200",
                  active
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-hairline bg-surface text-ink-600 hover:border-ink-300 hover:text-ink-900"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "text-numeric text-[11px] font-bold tabular-nums",
                    active ? "text-white/70" : "text-ink-400"
                  )}
                >
                  {counts[item.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-ink-200 bg-surface-sunken px-6 py-12 text-center">
          <p className="text-title text-ink-900">No matching answers</p>
          <p className="text-body-sm mt-2 text-ink-500">
            Try another keyword, or ask our AI for a direct reply.
          </p>
          <button
            type="button"
            onClick={openAi}
            className="interactive mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            <Sparkles className="size-4" />
            Ask AI
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface">
          <Accordion type="single" collapsible defaultValue={visible[0]?.id}>
            {visible.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="items-start px-5 sm:px-6 [&_span[aria-hidden]]:mt-1">
                  <span className="flex min-w-0 flex-col items-start gap-1.5 pr-2 sm:flex-row sm:items-center sm:gap-3">
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                      {FAQ_CATEGORY_LABELS[faq.category]}
                    </span>
                    <span className="text-left leading-snug">{faq.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      <p className="text-caption text-ink-400">
        Showing {visible.length} of {faqs.length} answers
      </p>
    </div>
  );
}
