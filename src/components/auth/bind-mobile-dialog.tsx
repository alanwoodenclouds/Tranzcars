"use client";

import { useState } from "react";
import { ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiPost } from "@/lib/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import { inputBase } from "@/components/ui/input";
import { cn } from "@/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBound?: () => void;
};

export function BindMobileDialog({ open, onOpenChange, onBound }: Props) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!user?.token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<{ ok: boolean; message: string }>("/api/auth", {
        action: "bind_send",
        token: user.token,
        mobile,
      });
      if (res.ok) {
        setStep("otp");
        setMessage(res.message);
      } else setError(res.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    if (!user?.token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<{
        ok: boolean;
        message: string;
        mobile?: string | null;
        mobile_bound?: boolean;
        account?: { mobile?: string | null };
      }>("/api/auth", {
        action: "bind_verify",
        token: user.token,
        mobile,
        otp,
      });
      if (res.ok) {
        updateProfile({
          mobile: res.account?.mobile ?? res.mobile ?? mobile,
          mobileBound: true,
        });
        onOpenChange(false);
        setStep("mobile");
        setOtp("");
        onBound?.();
      } else setError(res.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

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
            <DialogTitle>Link your mobile</DialogTitle>
            <p className="text-sm text-ink-500">
              A phone number is required before you can book a car.
            </p>
          </DialogHeader>
          <div className="mt-6">
            {step === "mobile" ? (
              <Field label="Mobile number" htmlFor="bind-mobile" error={error}>
                <div className="flex gap-2">
                  <span className="grid h-11 place-items-center rounded-[var(--radius-md)] bg-surface-sunken px-3.5 text-sm font-bold">
                    +91
                  </span>
                  <input
                    id="bind-mobile"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className={cn(inputBase, "h-11")}
                  />
                </div>
              </Field>
            ) : (
              <Field label="4-digit code" htmlFor="bind-otp" error={error}>
                <input
                  id="bind-otp"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className={cn(
                    inputBase,
                    "h-14 text-center font-display text-2xl font-extrabold tracking-[0.4em]"
                  )}
                />
              </Field>
            )}
          </div>
          {message && !error ? (
            <p className="mt-3 text-[13px] text-ink-500">{message}</p>
          ) : null}
          <Button
            block
            size="lg"
            className="mt-6"
            loading={loading}
            disabled={
              loading ||
              (step === "mobile" ? mobile.length !== 10 : otp.length !== 4)
            }
            onClick={() => void (step === "mobile" ? send() : verify())}
          >
            {step === "mobile" ? "Send code" : "Verify & continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
