"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, KeyRound, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiGet, apiPost } from "@/lib/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookingsStore } from "@/store/useBookingsStore";
import { inputBase } from "@/components/ui/input";
import { cn } from "@/utils";

type AuthConfig = {
  email_password_login_enabled: boolean;
  email_otp_login_enabled: boolean;
  phone_otp_login_enabled: boolean;
  google_login_enabled: boolean;
  google_client_id: string;
};

type Method = "phone" | "email" | "password" | "google";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
};

type AuthOk = {
  ok: boolean;
  message: string;
  token?: string;
  refresh?: string;
  name?: string;
  email?: string;
  mobile?: string | null;
  mobile_bound?: boolean;
};

export function OtpDialog({ open, onOpenChange, onVerified }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const seedForMobile = useBookingsStore((s) => s.seedForMobile);
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const [method, setMethod] = useState<Method>("phone");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"identity" | "otp">("identity");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    void apiGet<AuthConfig>("/api/auth")
      .then((cfg) => {
        setConfig(cfg);
        if (cfg.phone_otp_login_enabled) setMethod("phone");
        else if (cfg.email_otp_login_enabled) setMethod("email");
        else if (cfg.email_password_login_enabled) setMethod("password");
        else if (cfg.google_login_enabled) setMethod("google");
      })
      .catch(() => {
        setConfig({
          phone_otp_login_enabled: true,
          email_otp_login_enabled: true,
          email_password_login_enabled: true,
          google_login_enabled: false,
          google_client_id: "",
        });
      });
  }, [open]);

  function finish(res: AuthOk, fallbackMobile?: string) {
    if (!res.ok || !res.token) {
      setError(res.message || "Sign-in failed");
      return;
    }
    const nextMobile = res.mobile ?? fallbackMobile ?? null;
    setUser({
      token: res.token,
      refresh: res.refresh,
      mobile: nextMobile,
      name: res.name,
      email: res.email ?? email,
      mobileBound: res.mobile_bound ?? Boolean(nextMobile),
    });
    if (nextMobile) seedForMobile(nextMobile);
    onOpenChange(false);
    setStep("identity");
    setOtp("");
    setPassword("");
    onVerified?.();
  }

  async function sendPhone() {
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
      } else setError(res.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyPhone() {
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<AuthOk>("/api/auth", {
        action: "verify",
        mobile,
        otp,
      });
      finish(res, mobile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail() {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await apiPost<{ ok: boolean; message: string }>("/api/auth", {
        action: "email_send",
        email,
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

  async function verifyEmail() {
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<AuthOk>("/api/auth", {
        action: "email_verify",
        email,
        otp,
      });
      finish(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function doPassword() {
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<AuthOk>("/api/auth", {
        action: "password_login",
        email,
        password,
      });
      finish(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function doGoogleMock() {
    setLoading(true);
    setError("");
    try {
      const res = await apiPost<AuthOk>("/api/auth", {
        action: "google",
        id_token: `mock-google:${email || "driver@example.com"}|Google Driver`,
      });
      finish(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  const methods: { id: Method; label: string; show: boolean }[] = [
    { id: "phone", label: "Phone OTP", show: Boolean(config?.phone_otp_login_enabled) },
    { id: "email", label: "Email OTP", show: Boolean(config?.email_otp_login_enabled) },
    {
      id: "password",
      label: "Password",
      show: Boolean(config?.email_password_login_enabled),
    },
    { id: "google", label: "Google", show: Boolean(config?.google_login_enabled) },
  ];

  const visibleMethods = methods.filter((m) => m.show);
  const canSubmit =
    method === "phone"
      ? step === "identity"
        ? mobile.length === 10
        : otp.length === 4
      : method === "email"
        ? step === "identity"
          ? email.includes("@")
          : otp.length === 4
        : method === "password"
          ? email.includes("@") && password.length >= 4
          : true;

  async function primaryAction() {
    if (method === "phone") return step === "identity" ? sendPhone() : verifyPhone();
    if (method === "email") return step === "identity" ? sendEmail() : verifyEmail();
    if (method === "password") return doPassword();
    return doGoogleMock();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="p-6 sm:p-7">
          <span className="grid size-11 place-items-center rounded-full bg-brand-50 text-brand-600">
            {step === "otp" ? (
              <ShieldCheck className="size-5" />
            ) : method === "email" || method === "password" ? (
              <Mail className="size-5" />
            ) : method === "google" ? (
              <KeyRound className="size-5" />
            ) : (
              <Smartphone className="size-5" />
            )}
          </span>

          <DialogHeader className="mt-4">
            <DialogTitle>
              {step === "otp" ? "Enter your code" : "Sign in to continue"}
            </DialogTitle>
            <p className="text-sm leading-relaxed text-ink-500">
              {step === "otp"
                ? method === "phone"
                  ? `Sent to +91 ${mobile}. It expires in a few minutes.`
                  : `Sent to ${email}. It expires in a few minutes.`
                : "Use a method enabled for this storefront."}
            </p>
          </DialogHeader>

          {step === "identity" && visibleMethods.length > 1 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {visibleMethods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMethod(m.id);
                    setError("");
                    setMessage("");
                    setStep("identity");
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    method === m.id
                      ? "bg-brand-600 text-white"
                      : "bg-surface-sunken text-ink-600 hover:bg-brand-50"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            {method === "phone" && step === "identity" ? (
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
                    className={cn(inputBase, "h-11 text-numeric tracking-wide")}
                  />
                </div>
              </Field>
            ) : null}

            {(method === "email" || method === "password" || method === "google") &&
            step === "identity" ? (
              <Field label="Email" htmlFor="auth-email" error={error}>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className={cn(inputBase, "h-11")}
                />
              </Field>
            ) : null}

            {method === "password" && step === "identity" ? (
              <Field label="Password" htmlFor="auth-password">
                <input
                  id="auth-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(inputBase, "h-11")}
                />
              </Field>
            ) : null}

            {step === "otp" ? (
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
                  className={cn(
                    inputBase,
                    "h-14 text-center font-display text-2xl font-extrabold tracking-[0.4em]"
                  )}
                />
              </Field>
            ) : null}
          </div>

          {message && !error ? (
            <p className="mt-3 text-[13px] text-ink-500" role="status">
              {message}
            </p>
          ) : null}

          <Badge tone="info" size="sm" className="mt-4">
            Demo OTP · 1234 when mock / portal mock is on
          </Badge>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              block
              size="lg"
              loading={loading}
              disabled={!canSubmit || loading}
              onClick={() => void primaryAction()}
            >
              {method === "google"
                ? "Continue with Google"
                : method === "password"
                  ? "Sign in"
                  : step === "identity"
                    ? "Send code"
                    : "Verify & continue"}
            </Button>
            {step === "otp" ? (
              <Button
                variant="ghost"
                block
                disabled={loading}
                onClick={() => {
                  setStep("identity");
                  setError("");
                  setMessage("");
                }}
              >
                <ArrowLeft />
                Back
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
