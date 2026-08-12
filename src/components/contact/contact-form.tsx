"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";

const TOPICS = [
  "Booking a car",
  "Booking a bike",
  "Airport delivery",
  "Long-term / monthly",
  "Something else",
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setError(null);
    setSent(true);
    toast("Message sent — we’ll call you back shortly.", "success");
    setName("");
    setMobile("");
    setMessage("");
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-hairline bg-surface p-8 text-center shadow-e1">
        <span className="grid size-14 place-items-center rounded-full bg-jade-50 text-jade-600">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="mt-5 font-display text-xl font-bold tracking-tight">
          Message received
        </h2>
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-ink-500">
          Our Kochi desk replies within 15 minutes during the day. For anything
          urgent, calling is still fastest.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[var(--radius-2xl)] border border-hairline bg-surface p-6 shadow-e1 sm:p-8"
    >
      <h2 className="font-display text-xl font-bold tracking-tight">
        Send a message
      </h2>
      <p className="mt-1.5 text-[13.5px] text-ink-500">
        Tell us the dates and where you want the vehicle — we will confirm
        availability.
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="contact-name">
            <Input
              id="contact-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </Field>
          <Field
            label="Mobile"
            htmlFor="contact-mobile"
            error={error}
            hint="We call back on this number."
          >
            <Input
              id="contact-mobile"
              required
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10-digit mobile"
              autoComplete="tel-national"
              aria-invalid={error ? true : undefined}
            />
          </Field>
        </div>

        <Field label="What is this about?">
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const active = t === topic;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  aria-pressed={active}
                  className={`interactive rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
                    active
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-hairline bg-surface text-ink-600 hover:border-ink-300 hover:text-ink-900"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Message" htmlFor="contact-message">
          <Textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Dates, pick-up point, and anything else we should know."
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-6" block>
        Send message
      </Button>
      <p className="mt-3 text-center text-[12px] text-ink-400">
        Demo form — no message is actually delivered.
      </p>
    </form>
  );
}
