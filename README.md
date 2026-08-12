# TranzCars

Search-first self-drive car & bike rental website for Kochi & Kerala.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + CSS design tokens
- shadcn-style Radix UI primitives
- Zustand (booking + auth + bookings)
- TanStack Query provider
- BFF Route Handlers → `api.tranzcars.com` (mocks enabled by default)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Keep `USE_MOCK_API=true` for the client demo (default).

### Demo OTP

Use any valid 10-digit Indian mobile (e.g. `9895041111`) and OTP `1234` (mock mode).

### Live API

Set in `.env.local`:

```
USE_MOCK_API=false
API_BASE_URL=https://api.tranzcars.com
```

## Booking flow (strict search-first)

Browsing is free. **Select / Book / Quick book / Pay** require a complete trip:

1. Pickup location  
2. Drop-off location (same-as-pickup allowed)  
3. Pickup date + time  
4. Drop-off date + time  
5. Drop at least **24 hours** after pickup  

```text
Browse fleet → Enter trip details → Search complete?
  → No: trip console / schedule dialog
  → Yes: Select vehicle → Checkout (OTP) → Demo pay → My Trips
```

From `/cars` with an incomplete search, cards show **Set trip first** and open the schedule dialog. Checkout shows a banner until trip details are complete.

## Client demo script (mock funnel)

1. **Home** → set pickup, drop-off, dates & times → Search cars/bikes  
   **or** open fleet first → tap **Set trip first** → fill schedule (+ map pickup).  
2. **Checkout** → Sign in with OTP (`98xxxxxxxx` + `1234`).  
3. **Pay (demo)** → booking saved → trip detail.  
4. **My Trips** → Upcoming / Past / Cancelled → **Cancel** an upcoming booking.  
5. **Sign out / Sign in** → history persists in `localStorage`.

Also try: nav **Cars** / **Bikes**, contact form toast, footer newsletter Join, app store “Coming soon”.
