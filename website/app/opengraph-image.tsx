import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const alt =
  "AM Growth Solutions — On connecte vos outils. Vous arrêtez la double saisie.";
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
            fontSize: 56,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.25,
            maxWidth: 900,
          }}
        >
          On connecte vos outils. Vous arrêtez la double saisie.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
            fontWeight: 600,
            color: "#c9c3ec",
          }}
        >
          AM Growth Solutions
        </div>
      </div>
    ),
    { ...size }
  );
}
