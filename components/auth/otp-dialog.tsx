"use client";

import { useState } from "react";
import { ArrowLeft, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiPost } from "@/lib/api/client";
import { useAuthStore } from "@/lib/booking/auth-store";
import { useBookingsStore } from "@/lib/booking/bookings-store";
import { inputBase } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
};

export function OtpDialog({ open, onOpenChange, onVerified }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const seedForMobile = useBookingsStore((s) => s.seedForMobile);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await apiPost<{ ok: boolean; message: string }>("/api/auth", {
        action: "send",
        mobile,
      });
      if (res.ok) {
        setStep("otp");
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await apiPost<{
        ok: boolean;
        message: string;
        token?: string;
        name?: string;
      }>("/api/auth", { action: "verify", mobile, otp });
      if (res.ok && res.token) {
        setUser({ token: res.token, mobile, name: res.name });
        seedForMobile(mobile);
        onOpenChange(false);
        setStep("mobile");
        setOtp("");
        onVerified?.();
      } else {
        setError(res.message);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    step === "mobile" ? mobile.length === 10 : otp.length === 4;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="p-6 sm:p-7">
          <span className="grid size-11 place-items-center rounded-full bg-brand-50 text-brand-600">
            {step === "mobile" ? (
              <Smartphone className="size-5" />
            ) : (
              <ShieldCheck className="size-5" />
            )}
          </span>

          <DialogHeader className="mt-4">
            <DialogTitle>
              {step === "mobile" ? "Sign in to continue" : "Enter your code"}
            </DialogTitle>
            <p className="text-sm leading-relaxed text-ink-500">
              {step === "mobile"
                ? "We’ll text a one-time code. No password, no account setup."
                : `Sent to +91 ${mobile}. It expires in 10 minutes.`}
            </p>
          </DialogHeader>

          <div className="mt-6">
            {step === "mobile" ? (
              <Field label="Mobile number" htmlFor="otp-mobile" error={error}>
                <div className="flex items-stretch gap-2">
                  <span className="grid h-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-surface-sunken px-3.5 text-sm font-bold text-ink-600">
                    +91
                  </span>
                  <input
                    id="otp-mobile"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="98950 41111"
                    value={mobile}
                    aria-invalid={Boolean(error)}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canSubmit) send();
                    }}
                    className={cn(inputBase, "h-11 text-numeric tracking-wide")}
                  />
                </div>
              </Field>
            ) : (
              <Field label="4-digit code" htmlFor="otp-code" error={error}>
                <input
                  id="otp-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={4}
                  placeholder="1234"
                  value={otp}
                  aria-invalid={Boolean(error)}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canSubmit) verify();
                  }}
                  className={cn(
                    inputBase,
                    "h-14 text-center font-display text-2xl font-extrabold tracking-[0.4em]"
                  )}
                />
              </Field>
            )}
          </div>

          {message && !error ? (
            <p className="mt-3 text-[13px] text-ink-500" role="status">
              {message}
            </p>
          ) : null}

          <Badge tone="info" size="sm" className="mt-4">
            Demo mode · any 4 digits work (try 1234)
          </Badge>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              block
              size="lg"
              loading={loading}
              disabled={!canSubmit || loading}
              onClick={step === "mobile" ? send : verify}
            >
              {step === "mobile" ? "Send code" : "Verify & continue"}
            </Button>
            {step === "otp" ? (
              <Button
                variant="ghost"
                block
                disabled={loading}
                onClick={() => {
                  setStep("mobile");
                  setError("");
                  setMessage("");
                }}
              >
                <ArrowLeft />
                Change number
              </Button>
            ) : null}
          </div>

          <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-400">
            By continuing you agree to our terms and privacy policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
