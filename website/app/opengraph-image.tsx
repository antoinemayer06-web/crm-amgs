import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const alt = "AM Growth Solutions — Automatisation pour les PME";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoBuffer = readFileSync(
    join(process.cwd(), "public", "brand", "logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={logoSrc}
          alt=""
          width={120}
          height={120}
          style={{ marginBottom: 40 }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            color: "#17122b",
            textAlign: "center",
            lineHeight: 1.25,
            maxWidth: 860,
          }}
        >
          Automatisation pour les PME
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 24,
            fontWeight: 600,
            color: "#5b6270",
            letterSpacing: 1,
          }}
        >
          Antoine MAYER
        </div>
      </div>
    ),
    { ...size }
  );
}
