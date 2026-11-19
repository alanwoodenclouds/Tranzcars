/**
 * Server-side helpers for WoQuick CRM portal + rental APIs.
 */

import type { Branch, Car } from "@/content/site";
import { BUSINESS_RULES } from "@/constants/businessRules";

export type PortalTripStatus = "upcoming" | "completed" | "cancelled";

export type PortalTrip = {
  id: string;
  carId: string;
  carSlug: string;
  carName: string;
  carImage: string;
  pickupBranchId: string;
  pickupLabel: string;
  dropoffBranchId: string;
  dropoffLabel: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  days: number;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: PortalTripStatus;
  createdAt: string;
  mobile: string;
};

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

export type PortalRentalSettings = {
  min_rental_hours: number;
  km_per_day: number;
  delivery_charge: string;
  senior_discount_percent: string;
  lady_discount_percent: string;
};

export type PortalBooking = {
  id: number;
  variant: number;
  variant_name?: string;
  variant_slug?: string;
  variant_image?: string;
  pickup_branch: number;
  pickup_branch_name?: string;
  dropoff_branch: number;
  dropoff_branch_name?: string;
  pickup_at: string;
  dropoff_at: string;
  days: number;
  subtotal: string | number;
  delivery: string | number;
  discount: string | number;
  total: string | number;
  security_deposit?: string | number;
  status: string;
  status_kind?: string;
  status_label?: string;
  customer_mobile?: string | null;
  created_at?: string;
  detail?: string;
  code?: string;
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

export type CarFilters = {
  transmission?: string;
  type?: string;
  category?: string;
  fuel?: string;
  q?: string;
  slug?: string;
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
    image: v.image || "/images/fleet/maruti-fronx.png",
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

function mapStatusKind(kind?: string, status?: string): PortalTripStatus {
  const k = (kind || status || "").toLowerCase();
  if (k === "cancelled" || k === "canceled") return "cancelled";
  if (k === "completed") return "completed";
  if (k === "on_rent" || k === "upcoming") return "upcoming";
  return "upcoming";
}

function splitDateTime(iso: string): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const [date, rest = ""] = iso.split("T");
    return { date, time: rest.slice(0, 5) };
  }
  const date = d.toISOString().slice(0, 10);
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return { date, time };
}

export function mapPortalBooking(b: PortalBooking): PortalTrip {
  const pickup = splitDateTime(b.pickup_at);
  const dropoff = splitDateTime(b.dropoff_at);
  return {
    id: String(b.id),
    carId: String(b.variant),
    carSlug: b.variant_slug || String(b.variant),
    carName: b.variant_name || "Vehicle",
    carImage: b.variant_image || "/images/fleet/maruti-fronx.png",
    pickupBranchId: String(b.pickup_branch),
    pickupLabel: b.pickup_branch_name || "",
    dropoffBranchId: String(b.dropoff_branch),
    dropoffLabel: b.dropoff_branch_name || "",
    pickupDate: pickup.date,
    pickupTime: pickup.time,
    dropoffDate: dropoff.date,
    dropoffTime: dropoff.time,
    days: Number(b.days) || 1,
    subtotal: Number(b.subtotal) || 0,
    delivery: Number(b.delivery) || 0,
    discount: Number(b.discount) || 0,
    total: Number(b.total) || 0,
    status: mapStatusKind(b.status_kind, b.status),
    createdAt: b.created_at || new Date().toISOString(),
    mobile: b.customer_mobile || "",
  };
}

export async function portalAuthConfig(): Promise<PortalAuthConfig | null> {
  const res = await portalFetch<PortalAuthConfig>("auth/config/");
  return res.ok ? res.data : null;
}

export async function portalVariants(filters: CarFilters = {}): Promise<Car[]> {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "All")
    params.set("category", filters.category.toLowerCase());
  if (filters.transmission && filters.transmission !== "All")
    params.set("transmission", filters.transmission.toLowerCase());
  if (filters.type && filters.type !== "All") params.set("type", filters.type);
  if (filters.fuel) params.set("fuel", filters.fuel.toLowerCase());
  if (filters.q) params.set("q", filters.q);
  if (filters.slug) params.set("slug", filters.slug);
  const qs = params.toString();
  const res = await portalFetch<PortalVariant[]>(
    `rental/variants/${qs ? `?${qs}` : ""}`
  );
  if (!res.ok || !Array.isArray(res.data)) return [];
  return res.data.map(mapVariantToCar);
}

export async function portalBranches(): Promise<Branch[]> {
  const res = await portalFetch<PortalBranch[]>("rental/branches/");
  if (!res.ok || !Array.isArray(res.data)) return [];
  return res.data.map(mapBranch);
}

export async function portalSettings(): Promise<PortalRentalSettings | null> {
  const res = await portalFetch<PortalRentalSettings>("rental/settings/");
  return res.ok ? res.data : null;
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

export async function portalPatchMe(
  token: string,
  body: Partial<Pick<PortalAccount, "name" | "email">>
): Promise<PortalAccount | null> {
  const res = await portalFetch<PortalAccount>("me/", {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
  return res.ok ? res.data : null;
}

export async function portalSetPassword(
  token: string,
  password: string
): Promise<{ ok: boolean; message: string }> {
  const res = await portalFetch<{ ok: boolean; message: string }>(
    "auth/password/set/",
    { method: "POST", body: JSON.stringify({ password }), token }
  );
  return {
    ok: Boolean(res.data?.ok),
    message: res.data?.message || (res.ok ? "Password saved." : "Could not save password."),
  };
}

export async function portalListBookings(token: string, status?: string) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await portalFetch<PortalBooking[]>(`rental/bookings/${qs}`, { token });
  if (!res.ok || !Array.isArray(res.data)) return [];
  return res.data.map(mapPortalBooking);
}

export async function portalGetBooking(token: string, id: string | number) {
  const res = await portalFetch<PortalBooking>(`rental/bookings/${id}/`, { token });
  if (!res.ok || !res.data) return null;
  return mapPortalBooking(res.data);
}

export async function portalCancelBooking(token: string, id: string | number) {
  const res = await portalFetch<PortalBooking>(`rental/bookings/${id}/cancel/`, {
    method: "POST",
    body: JSON.stringify({}),
    token,
  });
  if (!res.ok || !res.data) {
    return {
      ok: false as const,
      status: res.status,
      message:
        (res.data as { detail?: string } | null)?.detail || "Could not cancel booking",
      booking: null,
    };
  }
  return {
    ok: true as const,
    status: res.status,
    message: "Cancelled",
    booking: mapPortalBooking(res.data),
  };
}

export async function portalCreateBooking(
  token: string,
  body: Record<string, unknown>
) {
  const res = await portalFetch<PortalBooking & { detail?: string; code?: string }>(
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
