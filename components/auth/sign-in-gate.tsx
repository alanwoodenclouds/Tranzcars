"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpDialog } from "@/components/auth/otp-dialog";

/** Shared empty state for signed-out account surfaces. */
export function SignInGate({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [otpOpen, setOtpOpen] = useState(false);

  return (
    <div className="container-page py-20">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-[var(--radius-2xl)] border border-hairline bg-surface px-6 py-14 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
          <KeyRound className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-ink-500">
          {description}
        </p>
        <Button size="lg" className="mt-6" onClick={() => setOtpOpen(true)}>
          Sign in with OTP
        </Button>
        <p className="mt-3 text-[12px] text-ink-400">
          No password. We text you a code.
        </p>
      </div>
      <OtpDialog open={otpOpen} onOpenChange={setOtpOpen} />
    </div>
  );
}
