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
  portalCreateBooking,
  portalGoogleLogin,
  portalListBookings,
  portalMe,
  portalPasswordLogin,
  portalSendEmailOtp,
  portalSendMobileOtp,
  portalVariants,
  portalVerifyEmailOtp,
  portalVerifyMobileOtp,
  type PortalAuthConfig,
  type PortalAuthResult,
} from "@/lib/api/portal";

const isMockMode = () => !isPortalLive();

export async function getBranches(): Promise<Branch[]> {
  if (isMockMode()) return BRANCHES;
  const data = await portalBranches();
  return data.length ? data : BRANCHES;
}

export async function getCars(filters?: {
  transmission?: string;
  type?: string;
  category?: string;
  q?: string;
}): Promise<Car[]> {
  let cars = CARS;
  if (!isMockMode()) {
    const data = await portalVariants();
    if (data.length) cars = data;
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
  if (isMockMode()) return FAQS;
  return FAQS.map((item, index) => normalizeFaq(item, index));
}

export async function getSettings() {
  return {
    delivery_charge: BUSINESS_RULES.deliveryCharge,
    km_per_day: BUSINESS_RULES.kmPerDay,
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

export async function fetchPortalBookings(token: string) {
  if (isMockMode()) return [];
  return portalListBookings(token);
}

export async function createPortalBooking(
  token: string,
  body: Record<string, unknown>
) {
  if (isMockMode()) {
    return { ok: true, status: 201, data: { id: Date.now(), ...body } };
  }
  return portalCreateBooking(token, body);
}
