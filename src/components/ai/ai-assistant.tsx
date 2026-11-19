"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addDays, format, isValid, parse } from "date-fns";
import { CalendarDays, MapPin, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BRANCHES, BUSINESS_RULES, CARS, type Car } from "@/content/site";
import { useBookingStore } from "@/store/useBookingStore";
import { useAiAssistantUi } from "@/components/ai/ai-assistant-ui";
import { AiFloatingButton } from "@/components/ai/ai-launcher";
import { cn, formatINR } from "@/utils";

type Role = "assistant" | "user";

type Message = {
  id: string;
  role: Role;
  text: string;
  cars?: Car[];
  tripSummary?: string;
};

function matchBranch(text: string) {
  const q = text.toLowerCase();
  const aliases: Record<string, string[]> = {
    "cok-airport": ["airport", "cochin airport", "cok", "kochi airport"],
    "home-delivery-kochi": ["home", "delivery", "door"],
    "ernakulam-jn": ["railway", "station", "ernakulam", "junction"],
    kalamassery: ["kalamassery", "office"],
    vyttila: ["vyttila"],
    "trv-airport": ["trivandrum", "trv"],
    "calicut-airport": ["calicut", "kozhikode"],
  };

  for (const b of BRANCHES) {
    const keys = [
      b.name.toLowerCase(),
      b.city.toLowerCase(),
      ...(aliases[b.id] ?? []),
    ];
    if (keys.some((k) => q.includes(k))) return b;
  }
  return null;
}

function parseDateFromText(text: string): string | null {
  const lower = text.toLowerCase();
  const today = new Date();
  if (lower.includes("tomorrow")) {
    return format(addDays(today, 1), "yyyy-MM-dd");
  }
  if (lower.includes("today")) {
    return format(today, "yyyy-MM-dd");
  }
  if (lower.includes("weekend")) {
    const day = today.getDay();
    const toSat = (6 - day + 7) % 7 || 7;
    return format(addDays(today, toSat), "yyyy-MM-dd");
  }
  const iso = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso) return iso[1];
  const dmy = text.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](20\d{2})\b/);
  if (dmy) {
    const parsed = parse(
      `${dmy[1].padStart(2, "0")}/${dmy[2].padStart(2, "0")}/${dmy[3]}`,
      "dd/MM/yyyy",
      new Date()
    );
    if (isValid(parsed)) return format(parsed, "yyyy-MM-dd");
  }
  return null;
}

function matchCategory(text: string): "car" | "bike" | "suv" | null {
  const lower = text.toLowerCase();
  if (/\bbikes?\b|\bscooters?\b/.test(lower)) return "bike";
  if (/\bsuvs?\b/.test(lower)) return "suv";
  if (/\bcars?\b|\bhatch\b|\bsedan\b|\bmuv\b/.test(lower)) return "car";
  return null;
}

function filterCars(text: string, categoryHint?: "car" | "bike" | "suv" | null) {
  const lower = text.toLowerCase();
  const hint = categoryHint ?? matchCategory(text);
  let pool = CARS.filter((c) => c.category !== "bike");

  if (hint === "bike") {
    pool = CARS.filter((c) => c.category === "bike");
  } else if (hint === "suv") {
    pool = CARS.filter((c) => /suv/i.test(c.type) || /suv/i.test(c.name));
  } else if (hint === "car") {
    pool = CARS.filter((c) => c.category === "car");
  }

  if (/automatic|at\b/.test(lower)) {
    const auto = pool.filter((c) => c.transmission === "Automatic");
    if (auto.length) pool = auto;
  }

  return [...pool]
    .sort((a, b) => Number(!!b.popular) - Number(!!a.popular) || a.pricePerDay - b.pricePerDay)
    .slice(0, 4);
}

function formatTripLabel(pickupLabel: string, pickupDate: string, dropoffDate: string) {
  const from = format(parse(pickupDate, "yyyy-MM-dd", new Date()), "d MMM");
  const to = format(parse(dropoffDate, "yyyy-MM-dd", new Date()), "d MMM");
  return `${pickupLabel} · ${from} → ${to}`;
}

function ChatCarCard({
  car,
  onBook,
}: {
  car: Car;
  onBook: (car: Car) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-white shadow-e1">
      <div className="relative aspect-[16/9] bg-ink-100">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-cover"
          sizes="320px"
        />
        <span className="absolute left-2 top-2 rounded-full bg-ink-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
          {car.type}
        </span>
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">{car.name}</p>
            <p className="text-[11px] text-ink-500">
              {car.transmission} · {car.seats} seats · {car.kmPerDay} km/day
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold text-brand-600">
            {formatINR(car.pricePerDay)}
            <span className="block text-[10px] font-medium text-ink-400">/day</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => onBook(car)}
          className="flex h-9 w-full items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white transition-colors hover:bg-brand-600"
        >
          Book this car
        </button>
      </div>
    </div>
  );
}

export function AiAssistant() {
  const router = useRouter();
  const setSearch = useBookingStore((s) => s.setSearch);
  const search = useBookingStore((s) => s.search);
  const { open, setOpen } = useAiAssistantUi();

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hi — I'm your TranzCars concierge. Tell me where you're picking up and when, then book a car right here. Try “Airport tomorrow for 2 days”.`,
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, busy]);

  const reply = useCallback(
    (text: string, extra?: Pick<Message, "cars" | "tripSummary">) => {
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-a`,
          role: "assistant",
          text,
          cars: extra?.cars,
          tripSummary: extra?.tripSummary,
        },
      ]);
    },
    []
  );

  const bookCar = useCallback(
    (car: Car) => {
      const latest = useBookingStore.getState().search;
      setSearch({
        selectedCarId: car.id,
        selectedCarSlug: car.slug,
        category: car.category,
      });
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-u`,
          role: "user",
          text: `Book ${car.name}`,
        },
      ]);
      reply(
        `Great choice — ${car.name} at ${formatINR(car.pricePerDay)}/day. Taking you to checkout to confirm ${latest.pickupLabel || "your trip"}.`
      );
      window.setTimeout(() => {
        setOpen(false);
        router.push(`/checkout?car=${car.slug}`);
      }, 650);
    },
    [reply, router, setOpen, setSearch]
  );

  const handleUserText = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;

      setMessages((m) => [
        ...m,
        { id: `${Date.now()}-u`, role: "user", text },
      ]);
      setBusy(true);

      window.setTimeout(() => {
        const lower = text.toLowerCase();
        const branch = matchBranch(text);
        const date = parseDateFromText(text);
        const categoryHint = matchCategory(text);
        const wantsCars =
          /search|find|show|book|cars?|suvs?|bikes?|available|options|go/.test(
            lower
          ) || lower.includes("yes");

        if (branch) {
          setSearch({
            pickupBranchId: branch.id,
            pickupLabel: `${branch.name}, ${branch.city}`,
            dropoffBranchId: search.dropoffBranchId || branch.id,
            dropoffLabel:
              search.dropoffLabel || `${branch.name}, ${branch.city}`,
          });
        }

        if (date) {
          const daysMatch = lower.match(/(\d+)\s*days?/);
          const days = daysMatch ? Number(daysMatch[1]) : 2;
          setSearch({
            pickupDate: date,
            dropoffDate: format(
              addDays(parse(date, "yyyy-MM-dd", new Date()), Math.max(1, days)),
              "yyyy-MM-dd"
            ),
          });
        }

        if (categoryHint === "bike") {
          setSearch({ category: "bike" });
        } else if (categoryHint === "car" || categoryHint === "suv") {
          setSearch({ category: "car" });
        }

        const latest = useBookingStore.getState().search;
        const tripReady = Boolean(latest.pickupBranchId && latest.pickupDate);

        if (tripReady && (wantsCars || (branch && date) || categoryHint)) {
          const cars = filterCars(text, categoryHint);
          const summary = formatTripLabel(
            latest.pickupLabel,
            latest.pickupDate,
            latest.dropoffDate
          );
          reply(
            cars.length
              ? `Here are ${cars.length} options for ${summary}. Tap Book on any car to continue.`
              : `No matches for that filter — try SUVs, hatchbacks, or bikes.`,
            { cars, tripSummary: summary }
          );
          setBusy(false);
          return;
        }

        if (branch && !latest.pickupDate) {
          reply(
            `Got it — pickup at ${branch.name}. When do you need the car? Try “tomorrow for 3 days” or a date like 15/08/2026.`
          );
        } else if (date && !latest.pickupBranchId) {
          reply(
            `Dates set for ${date}. Where should we deliver — Airport, Kalamassery, railway, or home delivery?`
          );
        } else if (/hello|hi|hey|help/.test(lower)) {
          reply(
            `I can find and book self-drive cars & bikes in Kochi & Kerala — ${BUSINESS_RULES.kmPerDay} km free/day, airport delivery. Where are you starting from?`
          );
        } else if (/price|cost|rate|km/.test(lower)) {
          reply(
            `Every trip includes ${BUSINESS_RULES.kmPerDay} km free per day. Browse without login — OTP only at checkout. Share pickup + dates and I’ll show cars you can book here.`
          );
        } else {
          reply(
            `Share pickup (e.g. Cochin Airport) and dates (e.g. tomorrow for 2 days), or tap a quick suggestion below.`
          );
        }
        setBusy(false);
      }, 380);
    },
    [reply, search.dropoffBranchId, search.dropoffLabel, setSearch]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = input;
    setInput("");
    handleUserText(value);
  }

  const suggestions = [
    "Airport tomorrow for 2 days",
    "Home delivery this weekend",
    "Show SUVs from Kalamassery",
  ];

  const tripReady = Boolean(search.pickupBranchId && search.pickupDate);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] top-[max(0.75rem,env(safe-area-inset-top))] z-[70] flex flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface shadow-e4 sm:inset-auto sm:bottom-[6.5rem] sm:right-6 sm:top-auto sm:h-[min(82vh,720px)] sm:w-[min(100vw-3rem,460px)]"
          >
            <header className="flex shrink-0 items-center justify-between gap-3 bg-ink-900 px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand-500">
                  <Sparkles className="size-[18px]" />
                </span>
                <div>
                  <p className="text-sm font-bold">AI booking concierge</p>
                  <p className="text-[11px] text-white/60">
                    Chat to find & book a car
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {tripReady ? (
              <div className="flex shrink-0 items-center gap-2 border-b border-hairline bg-brand-50 px-4 py-2.5 text-[11px] font-semibold text-ink-700">
                <MapPin className="size-3.5 shrink-0 text-brand-600" />
                <span className="truncate">{search.pickupLabel}</span>
                <span className="text-ink-300">·</span>
                <CalendarDays className="size-3.5 shrink-0 text-brand-600" />
                <span className="truncate">
                  {search.pickupDate}
                  {search.dropoffDate ? ` → ${search.dropoffDate}` : ""}
                </span>
              </div>
            ) : null}

            <div
              ref={listRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col gap-2",
                    m.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[92%] rounded-[var(--radius-lg)] px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm bg-brand-500 text-white"
                        : "rounded-bl-sm bg-ink-100 text-ink-800"
                    )}
                  >
                    {m.text}
                  </div>

                  {m.cars && m.cars.length > 0 ? (
                    <div className="grid w-full max-w-[92%] gap-2.5 sm:grid-cols-2">
                      {m.cars.map((car) => (
                        <ChatCarCard key={car.id} car={car} onBook={bookCar} />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {busy && (
                <p className="text-xs font-medium text-ink-400">Finding cars…</p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 border-t border-hairline px-4 py-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleUserText(s)}
                  className="rounded-full bg-ink-100 px-3 py-1.5 text-[11px] font-semibold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={onSubmit}
              className="flex shrink-0 items-center gap-2 border-t border-hairline px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Airport tomorrow for 2 days…"
                className="h-11 flex-1 rounded-full bg-ink-100 px-4 text-sm font-medium text-ink-900 outline-none placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500/30"
                aria-label="Message AI concierge"
              />
              <button
                type="submit"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AiFloatingButton />
    </>
  );
}
