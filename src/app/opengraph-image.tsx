import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TranzCars — Self Drive Cars & Bikes in Kochi, Kerala";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0F172A 100%)",
          color: "#F8FAFC",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #FA7A4C, #D24310)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            T
          </div>
          TranzCars
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 920,
            }}
          >
            Self-drive cars & bikes across Kerala
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94A3B8",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            MVD-approved · Free km daily · Kochi Airport delivery
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 22,
            color: "#CBD5E1",
            fontWeight: 600,
          }}
        >
          <span>Kochi</span>
          <span>·</span>
          <span>Trivandrum</span>
          <span>·</span>
          <span>Calicut</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
