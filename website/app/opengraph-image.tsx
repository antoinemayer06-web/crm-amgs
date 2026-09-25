import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const alt =
  "AM Growth Solutions — Automatisations pour les PME à La Réunion.";
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
          background: "linear-gradient(135deg, #2b2064 0%, #4c3aa1 100%)",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={logoSrc}
          alt=""
          width={100}
          height={100}
          style={{ marginBottom: 44 }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.25,
            maxWidth: 900,
          }}
        >
          Automatisations pour les PME
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            fontWeight: 600,
            color: "#c9c3ec",
            textAlign: "center",
            maxWidth: 760,
          }}
        >
          On automatise vos process internes pour que vous ne perdiez plus de
          temps sur des tâches répétitives.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 24,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 1,
          }}
        >
          AM GROWTH SOLUTIONS
        </div>
      </div>
    ),
    { ...size }
  );
}
