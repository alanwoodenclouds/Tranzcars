import type { Branch, Car, Faq, Testimonial } from "@/content/site";
import { BRANCHES, CARS, FAQS, TESTIMONIALS, BUSINESS_RULES } from "@/content/site";

const isMockMode = () => process.env.USE_MOCK_API !== "false";

async function upstream<T>(path: string, init?: RequestInit): Promise<T | null> {
  const base = process.env.API_BASE_URL ?? "https://api.tranzcars.com";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getBranches(): Promise<Branch[]> {
  if (isMockMode()) return BRANCHES;
  const data = await upstream<Branch[]>("branches");
  return data?.length ? data : BRANCHES;
}

export async function getCars(filters?: {
  transmission?: string;
  type?: string;
  category?: string;
  q?: string;
}): Promise<Car[]> {
  let cars = CARS;
  if (!isMockMode()) {
    const data = await upstream<Car[]>("bookings/get-cars");
    if (data?.length) cars = data;
  }
  return cars.filter((car) => {
    if (filters?.category && (car.category ?? "car") !== filters.category)
      return false;
    if (filters?.transmission && car.transmission !== filters.transmission)
      return false;
    if (filters?.type && car.type !== filters.type) return false;
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      if (
        !car.name.toLowerCase().includes(q) &&
        !car.type.toLowerCase().includes(q) &&
        !(car.category ?? "car").toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });
}

export async function getCarBySlug(slug: string): Promise<Car | undefined> {
  const cars = await getCars();
  return cars.find((c) => c.slug === slug);
}

export async function getPopularCars(): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter((c) => c.popular);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (isMockMode()) return TESTIMONIALS;
  const data = await upstream<Testimonial[]>("testimonials");
  return data?.length ? data : TESTIMONIALS;
}

export async function getFaqs(): Promise<Faq[]> {
  if (isMockMode()) return FAQS;
  const data = await upstream<Faq[]>("faqs");
  return data?.length ? data : FAQS;
}

export async function getSettings() {
  if (isMockMode()) {
    return {
      delivery_charge: BUSINESS_RULES.deliveryCharge,
      km_per_day: BUSINESS_RULES.kmPerDay,
    };
  }
  const data = await upstream<Record<string, number>>("settings");
  return (
    data ?? {
      delivery_charge: BUSINESS_RULES.deliveryCharge,
      km_per_day: BUSINESS_RULES.kmPerDay,
    }
  );
}

export type OtpSendResult = { ok: boolean; message: string };
export type OtpVerifyResult = {
  ok: boolean;
  message: string;
  token?: string;
  name?: string;
};

/** Mock OTP: any 4-digit code works in mock mode; live mode proxies upstream */
export async function sendOtp(mobile: string): Promise<OtpSendResult> {
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { ok: false, message: "Enter a valid 10-digit Indian mobile number." };
  }
  if (isMockMode()) {
    return { ok: true, message: "OTP sent (use 1234 in demo mode)." };
  }
  const data = await upstream<{ message?: string }>("auths", {
    method: "POST",
    body: JSON.stringify({ mobile }),
  });
  return data
    ? { ok: true, message: data.message ?? "OTP sent." }
    : { ok: false, message: "Could not send OTP. Try again." };
}

export async function verifyOtp(
  mobile: string,
  otp: string
): Promise<OtpVerifyResult> {
  if (isMockMode()) {
    if (otp === "1234" || /^\d{4}$/.test(otp)) {
      return {
        ok: true,
        message: "Verified",
        token: `mock-token-${mobile}`,
        name: "Guest Driver",
      };
    }
    return { ok: false, message: "Invalid OTP." };
  }
  const data = await upstream<{ token?: string; name?: string; message?: string }>(
    "auths/validate-otp",
    {
      method: "POST",
      body: JSON.stringify({ mobile, otp }),
    }
  );
  if (data?.token) {
    return {
      ok: true,
      message: "Verified",
      token: data.token,
      name: data.name,
    };
  }
  return { ok: false, message: data?.message ?? "Invalid OTP." };
}
