/**
 * Server-side helpers for WoQuick CRM portal + rental APIs.
 * Desk UI host (*.crm.woquick.com) is not the API — use API_BASE_URL.
 */

import type { Branch, Car } from "@/content/site";
import { BUSINESS_RULES } from "@/constants/businessRules";

export type PortalAuthConfig = {
  email_password_login_enabled: boolean;
  email_otp_login_enabled: boolean;
  phone_otp_login_enabled: boolean;
  google_login_enabled: boolean;
  apple_login_enabled: boolean;
  google_client_id: string;
  enabled_methods: string[];
};

export type PortalAccount = {
  id: number;
  mobile: string | null;
  email: string;
  name: string;
  status: string;
  has_password?: boolean;
  google_linked?: boolean;
  mobile_bound?: boolean;
};

export type PortalAuthResult = {
  ok: boolean;
  message: string;
  access?: string;
  refresh?: string;
  account?: PortalAccount;
};

type PortalVariant = {
  id: number;
  slug: string;
  display_name?: string;
  brand_name?: string;
  model_name?: string;
  category?: string;
  body_type?: string;
  fuel?: string;
  transmission?: string;
  seats?: number;
  image?: string;
  features?: string[];
  popular?: boolean;
  daily_rate?: string | number | null;
  rates?: { period: string; base_rate: string; included_km?: number }[];
};

type PortalBranch = {
  id: number;
  name: string;
  city?: string;
  branch_type?: string;
  lat?: number | string | null;
  lng?: number | string | null;
};

function apiBase() {
  return (process.env.API_BASE_URL ?? "").replace(/\/$/, "");
}

function tenantHost() {
  return (
    process.env.API_TENANT_HOST ||
    process.env.CRM_TENANT_HOST ||
    "tranz-cars.crm.woquick.com"
  );
}

export function isPortalLive() {
  return process.env.USE_MOCK_API === "false" && Boolean(apiBase());
}

async function portalFetch<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<{ ok: boolean; status: number; data: T | null; raw?: string }> {
  const base = apiBase();
  if (!base) return { ok: false, status: 0, data: null };
  // Prefer API_BASE_URL that already resolves the tenant (dedicated host or
  // reverse-proxy). X-Forwarded-Host helps when the API trusts it (Django
  // USE_X_FORWARDED_HOST). Node fetch often blocks overriding Host.
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Forwarded-Host": tenantHost(),
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.token) headers.Authorization = `Bearer ${init.token}`;
  try {
    const res = await fetch(`${base}/api/v1/portal/${path.replace(/^\//, "")}`, {
      ...init,
      headers,
      cache: "no-store",
    });
    const text = await res.text();
    let data: T | null = null;
    try {
      data = text ? (JSON.parse(text) as T) : null;
    } catch {
      data = null;
    }
    return { ok: res.ok, status: res.status, data, raw: text };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

function dailyRate(v: PortalVariant): number {
  if (v.daily_rate != null && v.daily_rate !== "") {
    const n = Number(v.daily_rate);
    if (!Number.isNaN(n)) return n;
  }
  const daily = v.rates?.find((r) => r.period === "daily");
  if (daily) return Number(daily.base_rate) || 0;
  return 0;
}

function kmPerDay(v: PortalVariant): number {
  const daily = v.rates?.find((r) => r.period === "daily");
  return daily?.included_km ?? BUSINESS_RULES.kmPerDay;
}

export function mapVariantToCar(v: PortalVariant): Car {
  const name =
    v.display_name ||
    [v.brand_name, v.model_name].filter(Boolean).join(" ") ||
    v.slug;
  const transmission =
    (v.transmission || "").toLowerCase() === "automatic" ? "Automatic" : "Manual";
  const category = v.category === "bike" ? "bike" : "car";
  return {
    id: String(v.id),
    slug: v.slug,
    name,
    category,
    type: v.body_type || (category === "bike" ? "Scooter" : "SUV"),
    transmission,
    seats: v.seats ?? 5,
    fuel: (v.fuel || "petrol").replace(/^\w/, (c) => c.toUpperCase()),
    pricePerDay: dailyRate(v),
    image: v.image || "/images/cars/placeholder.jpg",
    popular: Boolean(v.popular),
    features: Array.isArray(v.features) ? v.features.map(String) : [],
    kmPerDay: kmPerDay(v),
  };
}

export function mapBranch(b: PortalBranch): Branch {
  const typeMap: Record<string, Branch["type"]> = {
    office: "office",
    airport: "airport",
    railway: "railway",
    delivery: "delivery",
  };
  return {
    id: String(b.id),
    name: b.name,
    city: b.city || "",
    type: typeMap[b.branch_type || ""] || "office",
    lat: Number(b.lat) || 0,
    lng: Number(b.lng) || 0,
  };
}

export async function portalAuthConfig(): Promise<PortalAuthConfig | null> {
  const res = await portalFetch<PortalAuthConfig>("auth/config/");
  return res.ok ? res.data : null;
}

export async function portalVariants(): Promise<Car[]> {
  const res = await portalFetch<PortalVariant[]>("rental/variants/");
  if (!res.ok || !Array.isArray(res.data)) return [];
  return res.data.map(mapVariantToCar);
}

export async function portalBranches(): Promise<Branch[]> {
  const res = await portalFetch<PortalBranch[]>("rental/branches/");
  if (!res.ok || !Array.isArray(res.data)) return [];
  return res.data.map(mapBranch);
}

export async function portalSendMobileOtp(mobile: string): Promise<PortalAuthResult> {
  const res = await portalFetch<{ ok: boolean; message: string }>("auth/send/", {
    method: "POST",
    body: JSON.stringify({ mobile }),
  });
  return {
    ok: Boolean(res.data?.ok),
    message: res.data?.message || (res.ok ? "OTP sent." : "Could not send OTP."),
  };
}

export async function portalVerifyMobileOtp(
  mobile: string,
  otp: string
): Promise<PortalAuthResult> {
  const res = await portalFetch<PortalAuthResult>("auth/verify/", {
    method: "POST",
    body: JSON.stringify({ mobile, otp }),
  });
  return normalizeAuth(res);
}

export async function portalSendEmailOtp(email: string): Promise<PortalAuthResult> {
  const res = await portalFetch<{ ok: boolean; message: string }>("auth/email/send/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return {
    ok: Boolean(res.data?.ok),
    message: res.data?.message || (res.ok ? "OTP sent." : "Could not send OTP."),
  };
}

export async function portalVerifyEmailOtp(
  email: string,
  otp: string
): Promise<PortalAuthResult> {
  const res = await portalFetch<PortalAuthResult>("auth/email/verify/", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
  return normalizeAuth(res);
}

export async function portalPasswordLogin(
  email: string,
  password: string
): Promise<PortalAuthResult> {
  const res = await portalFetch<PortalAuthResult>("auth/password/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return normalizeAuth(res);
}

export async function portalGoogleLogin(idToken: string): Promise<PortalAuthResult> {
  const res = await portalFetch<PortalAuthResult>("auth/google/", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });
  return normalizeAuth(res);
}

export async function portalBindMobileSend(
  token: string,
  mobile: string
): Promise<PortalAuthResult> {
  const res = await portalFetch<{ ok: boolean; message: string }>(
    "auth/bind-mobile/send/",
    { method: "POST", body: JSON.stringify({ mobile }), token }
  );
  return {
    ok: Boolean(res.data?.ok),
    message: res.data?.message || (res.ok ? "OTP sent." : "Could not send OTP."),
  };
}

export async function portalBindMobileVerify(
  token: string,
  mobile: string,
  otp: string
): Promise<PortalAuthResult> {
  const res = await portalFetch<PortalAuthResult>("auth/bind-mobile/verify/", {
    method: "POST",
    body: JSON.stringify({ mobile, otp }),
    token,
  });
  return normalizeAuth(res);
}

export async function portalMe(token: string): Promise<PortalAccount | null> {
  const res = await portalFetch<PortalAccount>("me/", { token });
  return res.ok ? res.data : null;
}

export async function portalListBookings(token: string) {
  const res = await portalFetch<unknown[]>("rental/bookings/", { token });
  return res.ok && Array.isArray(res.data) ? res.data : [];
}

export async function portalCreateBooking(
  token: string,
  body: Record<string, unknown>
) {
  const res = await portalFetch<Record<string, unknown> & { detail?: string; code?: string }>(
    "rental/bookings/",
    { method: "POST", body: JSON.stringify(body), token }
  );
  return res;
}

function normalizeAuth(res: {
  ok: boolean;
  data: PortalAuthResult | null;
}): PortalAuthResult {
  if (!res.data) {
    return { ok: false, message: "Authentication failed." };
  }
  return {
    ok: Boolean(res.data.ok && res.data.access),
    message: res.data.message || (res.data.ok ? "Verified" : "Authentication failed."),
    access: res.data.access,
    refresh: res.data.refresh,
    account: res.data.account,
  };
}
