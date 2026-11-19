import type { Branch, Car, Faq, FaqCategory, Testimonial } from "@/content/site";
import {
  BRANCHES,
  CARS,
  FAQ_CATEGORY_LABELS,
  FAQS,
  TESTIMONIALS,
  BUSINESS_RULES,
} from "@/content/site";
import {
  isPortalLive,
  portalAuthConfig,
  portalBindMobileSend,
  portalBindMobileVerify,
  portalBranches,
  portalCancelBooking,
  portalCreateBooking,
  portalGetBooking,
  portalGoogleLogin,
  portalListBookings,
  portalMe,
  portalPatchMe,
  portalPasswordLogin,
  portalSendEmailOtp,
  portalSendMobileOtp,
  portalSetPassword,
  portalSettings,
  portalVariants,
  portalVerifyEmailOtp,
  portalVerifyMobileOtp,
  type CarFilters,
  type PortalAuthConfig,
  type PortalAuthResult,
  type PortalTrip,
} from "@/lib/api/portal";

const isMockMode = () => !isPortalLive();

export async function getBranches(): Promise<Branch[]> {
  if (isMockMode()) return BRANCHES;
  const data = await portalBranches();
  return data.length ? data : BRANCHES;
}

export async function getCars(filters?: CarFilters): Promise<Car[]> {
  if (!isMockMode()) {
    const data = await portalVariants(filters || {});
    if (data.length || filters?.slug || filters?.q) return data;
  }
  let cars = CARS;
  return cars.filter((car) => {
    if (filters?.category && filters.category !== "All" && (car.category ?? "car") !== filters.category)
      return false;
    if (
      filters?.transmission &&
      filters.transmission !== "All" &&
      car.transmission !== filters.transmission
    )
      return false;
    if (filters?.type && filters.type !== "All" && car.type !== filters.type) return false;
    if (filters?.slug && car.slug !== filters.slug) return false;
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
  if (!isMockMode()) {
    const data = await portalVariants({ slug });
    if (data[0]) return data[0];
  }
  const cars = await getCars();
  return cars.find((c) => c.slug === slug);
}

export async function getPopularCars(): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter((c) => c.popular);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return TESTIMONIALS;
}

function normalizeFaq(item: Partial<Faq>, index: number): Faq {
  const fallback = FAQS.find((f) => f.id === item.id) ?? FAQS[index];
  const category =
    item.category && item.category in FAQ_CATEGORY_LABELS
      ? (item.category as FaqCategory)
      : (fallback?.category ?? "booking");

  return {
    id: String(item.id ?? fallback?.id ?? index + 1),
    question: item.question ?? fallback?.question ?? "",
    answer: item.answer ?? fallback?.answer ?? "",
    category,
  };
}

export async function getFaqs(): Promise<Faq[]> {
  return FAQS.map((item, index) => normalizeFaq(item, index));
}

export async function getSettings() {
  if (!isMockMode()) {
    const live = await portalSettings();
    if (live) {
      return {
        delivery_charge: Number(live.delivery_charge) || BUSINESS_RULES.deliveryCharge,
        km_per_day: live.km_per_day || BUSINESS_RULES.kmPerDay,
        min_rental_hours: live.min_rental_hours || 24,
        senior_discount_percent: Number(live.senior_discount_percent) || 15,
        lady_discount_percent: Number(live.lady_discount_percent) || 10,
      };
    }
  }
  return {
    delivery_charge: BUSINESS_RULES.deliveryCharge,
    km_per_day: BUSINESS_RULES.kmPerDay,
    min_rental_hours: 24,
    senior_discount_percent: BUSINESS_RULES.seniorDiscountPercent,
    lady_discount_percent: BUSINESS_RULES.ladyDiscountPercent,
  };
}

export type OtpSendResult = { ok: boolean; message: string };
export type OtpVerifyResult = {
  ok: boolean;
  message: string;
  token?: string;
  refresh?: string;
  name?: string;
  email?: string;
  mobile?: string | null;
  mobile_bound?: boolean;
  account?: PortalAuthResult["account"];
};

function toVerifyResult(res: PortalAuthResult): OtpVerifyResult {
  if (!res.ok || !res.access) {
    return { ok: false, message: res.message };
  }
  return {
    ok: true,
    message: res.message,
    token: res.access,
    refresh: res.refresh,
    name: res.account?.name,
    email: res.account?.email,
    mobile: res.account?.mobile,
    mobile_bound: Boolean(res.account?.mobile),
    account: res.account,
  };
}

export async function getAuthConfig(): Promise<PortalAuthConfig> {
  if (isMockMode()) {
    return {
      email_password_login_enabled: true,
      email_otp_login_enabled: true,
      phone_otp_login_enabled: true,
      google_login_enabled: true,
      apple_login_enabled: false,
      google_client_id: "",
      enabled_methods: ["Email", "Email OTP", "Phone OTP", "Google"],
    };
  }
  return (
    (await portalAuthConfig()) || {
      email_password_login_enabled: false,
      email_otp_login_enabled: false,
      phone_otp_login_enabled: true,
      google_login_enabled: false,
      apple_login_enabled: false,
      google_client_id: "",
      enabled_methods: ["Phone OTP"],
    }
  );
}

export async function sendOtp(mobile: string): Promise<OtpSendResult> {
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { ok: false, message: "Enter a valid 10-digit Indian mobile number." };
  }
  if (isMockMode()) {
    return { ok: true, message: "OTP sent (use 1234 in demo mode)." };
  }
  return portalSendMobileOtp(mobile);
}

export async function verifyOtp(mobile: string, otp: string): Promise<OtpVerifyResult> {
  if (isMockMode()) {
    if (otp === "1234" || /^\d{4}$/.test(otp)) {
      return {
        ok: true,
        message: "Verified",
        token: `mock-token-${mobile}`,
        name: "Guest Driver",
        mobile,
        mobile_bound: true,
      };
    }
    return { ok: false, message: "Invalid OTP." };
  }
  return toVerifyResult(await portalVerifyMobileOtp(mobile, otp));
}

export async function sendEmailOtp(email: string): Promise<OtpSendResult> {
  if (!email.includes("@")) {
    return { ok: false, message: "Enter a valid email address." };
  }
  if (isMockMode()) {
    return { ok: true, message: "OTP sent (use 1234 in demo mode)." };
  }
  return portalSendEmailOtp(email);
}

export async function verifyEmailOtp(
  email: string,
  otp: string
): Promise<OtpVerifyResult> {
  if (isMockMode()) {
    if (otp === "1234" || /^\d{4}$/.test(otp)) {
      return {
        ok: true,
        message: "Verified",
        token: `mock-token-${email}`,
        name: "Guest Driver",
        email,
        mobile_bound: false,
      };
    }
    return { ok: false, message: "Invalid OTP." };
  }
  return toVerifyResult(await portalVerifyEmailOtp(email, otp));
}

export async function passwordLogin(
  email: string,
  password: string
): Promise<OtpVerifyResult> {
  if (isMockMode()) {
    if (password.length >= 4) {
      return {
        ok: true,
        message: "Signed in",
        token: `mock-token-${email}`,
        email,
        name: "Guest Driver",
        mobile_bound: false,
      };
    }
    return { ok: false, message: "Invalid email or password." };
  }
  return toVerifyResult(await portalPasswordLogin(email, password));
}

export async function googleLogin(idToken: string): Promise<OtpVerifyResult> {
  if (isMockMode()) {
    return {
      ok: true,
      message: "Signed in",
      token: "mock-token-google",
      email: "driver@example.com",
      name: "Google Driver",
      mobile_bound: false,
    };
  }
  return toVerifyResult(await portalGoogleLogin(idToken));
}

export async function bindMobileSend(
  token: string,
  mobile: string
): Promise<OtpSendResult> {
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { ok: false, message: "Enter a valid 10-digit Indian mobile number." };
  }
  if (isMockMode()) {
    return { ok: true, message: "OTP sent (use 1234 in demo mode)." };
  }
  return portalBindMobileSend(token, mobile);
}

export async function bindMobileVerify(
  token: string,
  mobile: string,
  otp: string
): Promise<OtpVerifyResult> {
  if (isMockMode()) {
    if (otp === "1234" || /^\d{4}$/.test(otp)) {
      return { ok: true, message: "Mobile linked.", mobile, mobile_bound: true };
    }
    return { ok: false, message: "Invalid OTP." };
  }
  return toVerifyResult(await portalBindMobileVerify(token, mobile, otp));
}

export async function fetchPortalMe(token: string) {
  if (isMockMode()) return null;
  return portalMe(token);
}

export async function updatePortalMe(
  token: string,
  body: { name?: string; email?: string }
) {
  if (isMockMode()) {
    return { id: 0, mobile: null, email: body.email || "", name: body.name || "", status: "active" };
  }
  return portalPatchMe(token, body);
}

export async function setPortalPassword(token: string, password: string) {
  if (isMockMode()) return { ok: true, message: "Password saved." };
  return portalSetPassword(token, password);
}

export async function fetchPortalBookings(
  token: string,
  status?: string
): Promise<PortalTrip[]> {
  if (isMockMode()) return [];
  return portalListBookings(token, status);
}

export async function fetchPortalBooking(
  token: string,
  id: string
): Promise<PortalTrip | null> {
  if (isMockMode()) return null;
  return portalGetBooking(token, id);
}

export async function cancelPortalBooking(token: string, id: string) {
  if (isMockMode()) {
    return { ok: true as const, status: 200, message: "Cancelled", booking: null };
  }
  return portalCancelBooking(token, id);
}

export async function createPortalBooking(
  token: string,
  body: Record<string, unknown>
) {
  if (isMockMode()) {
    return {
      ok: true,
      status: 201,
      data: { id: Date.now(), ...body } as Record<string, unknown>,
    };
  }
  return portalCreateBooking(token, body);
}
