"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, isValid, parse } from "date-fns";
import { Mic, MicOff, Send, Sparkles, Volume2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BRANCHES, BUSINESS_RULES } from "@/content/site";
import {
  buildCarsSearchParams,
  useBookingStore,
} from "@/store/useBookingStore";
import { useAiAssistantUi } from "@/components/ai/ai-assistant-ui";
import { AiFloatingButton } from "@/components/ai/ai-launcher";
import { cn } from "@/utils";

type Role = "assistant" | "user";
type Message = { id: string; role: Role; text: string };

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: {
        results: {
          [i: number]: { [j: number]: { transcript: string } };
          length: number;
        };
      }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

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

export function AiAssistant() {
  const router = useRouter();
  const setSearch = useBookingStore((s) => s.setSearch);
  const search = useBookingStore((s) => s.search);
  const { open, setOpen } = useAiAssistantUi();

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hi — I'm your TranzCars concierge. Tell me where you're picking up, and when. Chat or hold the mic. Try “Airport tomorrow for 2 days”.`,
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechSupported = useMemo(() => !!getSpeechRecognition(), []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const speak = useCallback(
    (text: string) => {
      if (!voiceOn || typeof window === "undefined" || !window.speechSynthesis)
        return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02;
      u.pitch = 1;
      u.lang = "en-IN";
      window.speechSynthesis.speak(u);
    },
    [voiceOn]
  );

  const reply = useCallback(
    (text: string) => {
      setMessages((m) => [
        ...m,
        { id: `${Date.now()}-a`, role: "assistant", text },
      ]);
      speak(text);
    },
    [speak]
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
        const wantsSearch =
          /search|find|show|book|cars?|available|go/.test(lower) ||
          lower.includes("yes");

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

        const latest = useBookingStore.getState().search;

        if (
          (wantsSearch || (branch && date)) &&
          latest.pickupBranchId &&
          latest.pickupDate
        ) {
          reply(
            `Perfect — ${latest.pickupLabel} from ${latest.pickupDate}. Opening matching cars for you.`
          );
          setBusy(false);
          setOpen(false);
          router.push(`/cars?${buildCarsSearchParams(latest)}`);
          return;
        }

        if (branch && !latest.pickupDate) {
          reply(
            `Got it — pickup at ${branch.name}. When do you need the car? Say “tomorrow for 3 days” or a date like 15/08/2026.`
          );
        } else if (date && !latest.pickupBranchId) {
          reply(
            `Dates set for ${date}. Where should we deliver — Airport, Kalamassery, railway, or home delivery?`
          );
        } else if (/hello|hi|hey|help/.test(lower)) {
          reply(
            `I can book self-drive cars & bikes in Kochi & Kerala — free km/day, airport delivery. Where are you starting from?`
          );
        } else if (/price|cost|rate|km/.test(lower)) {
          reply(
            `Every trip includes ${BUSINESS_RULES.kmPerDay} km free per day. Browse without login — OTP only at checkout. Want me to find cars from the airport?`
          );
        } else {
          reply(
            `Share pickup (e.g. Cochin Airport) and dates (e.g. tomorrow for 2 days), or tap a quick suggestion below.`
          );
        }
        setBusy(false);
      }, 420);
    },
    [
      reply,
      router,
      search.dropoffBranchId,
      search.dropoffLabel,
      setOpen,
      setSearch,
    ]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      reply("Voice isn’t supported in this browser — type your request instead.");
      return;
    }
    const rec = new Ctor();
    recognitionRef.current = rec;
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) handleUserText(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }, [handleUserText, reply]);

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

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[calc(env(safe-area-inset-bottom)+8.5rem)] right-4 z-[70] flex w-[min(100vw-2rem,392px)] flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface shadow-e4 sm:bottom-[6.5rem] sm:right-6"
          >
            <header className="flex items-center justify-between gap-3 bg-ink-900 px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand-500">
                  <Sparkles className="size-[18px]" />
                </span>
                <div>
                  <p className="text-sm font-bold">AI booking concierge</p>
                  <p className="text-[11px] text-white/60">
                    Chat or speak your trip
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setVoiceOn((v) => !v)}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full transition",
                    voiceOn ? "bg-white/15 text-white" : "text-white/45"
                  )}
                  aria-label={voiceOn ? "Mute replies" : "Unmute replies"}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopListening();
                    setOpen(false);
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                  aria-label="Close assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div
              ref={listRef}
              className="max-h-[min(48vh,380px)] space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                    "max-w-[88%] rounded-[var(--radius-lg)] px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-sm bg-brand-500 text-white"
                      : "rounded-bl-sm bg-ink-100 text-ink-800"
                  )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && (
                <p className="text-xs font-medium text-ink-400">Thinking…</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-hairline px-4 py-3">
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
              className="flex items-center gap-2 border-t border-hairline px-3 py-3"
            >
              <button
                type="button"
                onClick={() =>
                  listening ? stopListening() : startListening()
                }
                disabled={!speechSupported}
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-full transition",
                  listening
                    ? "bg-brand-500 text-white ring-4 ring-brand-500/20"
                    : "bg-ink-100 text-ink-700 hover:bg-ink-200",
                  !speechSupported && "opacity-40"
                )}
                aria-label={listening ? "Stop listening" : "Start voice"}
              >
                {listening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>
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
