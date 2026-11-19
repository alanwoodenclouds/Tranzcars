"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, LogOut, ShieldCheck, Ticket } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookingsStore } from "@/store/useBookingsStore";
import { toast } from "@/store/useToastStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignInGate } from "@/components/auth/sign-in-gate";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const bookings = useBookingsStore((s) => s.bookings);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  if (!user) {
    return (
      <SignInGate
        title="Your account"
        description="Sign in to manage your profile and trips."
      />
    );
  }

  const tripCount = bookings.filter(
    (b) => (user.mobile && b.mobile === user.mobile) || (!user.mobile && !b.mobile)
  ).length;

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
    });
    setSaved(true);
    toast("Profile saved", "success");
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="container-page pb-20 pt-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ink-900 font-display text-xl font-extrabold text-white sm:size-16">
            {(user.name || "G").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="text-display-sm truncate">
              {user.name || "Guest driver"}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[14px] leading-snug text-ink-500">
              <span className="truncate">
                {user.mobile ? `+91 ${user.mobile}` : user.email || "Signed in"}
              </span>
              <Badge tone="success" size="sm">
                <ShieldCheck />
                Verified
              </Badge>
            </p>
          </div>
        </div>

        <Link
          href="/trips"
          className="interactive mt-8 flex items-center gap-4 rounded-[var(--radius-xl)] border border-hairline bg-surface p-5 hover:border-ink-200"
        >
          <span className="grid size-11 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Ticket className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-bold leading-snug text-ink-900">
              My trips
            </span>
            <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-500">
              {tripCount === 0
                ? "No bookings yet"
                : `${tripCount} booking${tripCount === 1 ? "" : "s"}`}
            </span>
          </span>
          <ChevronRight className="size-4 text-ink-300" />
        </Link>

        <form
          onSubmit={onSave}
          className="mt-4 rounded-[var(--radius-xl)] border border-hairline bg-surface p-5 sm:p-6"
        >
          <h2 className="font-display text-[17px] font-bold leading-snug tracking-tight">
            Profile details
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">
            We use these on your rental agreement and receipts.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="account-name">
              <Input
                id="account-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As printed on your licence"
                autoComplete="name"
              />
            </Field>
            <Field label="Email" htmlFor="account-email" optional>
              <Input
                id="account-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
              />
            </Field>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Button type="submit">Save changes</Button>
            {saved ? (
              <span className="text-[13px] font-semibold text-success">
                Saved
              </span>
            ) : null}
          </div>
        </form>

        <div className="mt-4 rounded-[var(--radius-xl)] border border-hairline bg-surface p-5">
          <h2 className="font-display text-[15px] font-bold leading-snug tracking-tight">
            Session
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">
            Signing out keeps your bookings — sign back in with the same number.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              logout();
              toast("Signed out", "info");
            }}
          >
            <LogOut />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
