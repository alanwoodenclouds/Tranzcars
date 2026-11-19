import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "TranzCars — Rent A Car. Drive Better.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoBytes = await readFile(
    join(process.cwd(), "public/brand/tranzcars-logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoBytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#F8FAFC",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="TranzCars"
          width={780}
          height={197}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            marginTop: 36,
            fontSize: 26,
            color: "#CBD5E1",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Self-drive cars & bikes · Kochi · Kerala
        </div>
      </div>
    ),
    { ...size }
  );
}
