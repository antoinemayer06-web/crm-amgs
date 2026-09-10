import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

// Voir app/icon.tsx : même raison d'être générée via next/og plutôt
// qu'un fichier statique app/apple-icon.png.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const logoBuffer = readFileSync(
    join(process.cwd(), "public", "apple-touch-icon.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img src={logoSrc} width={180} height={180} />
    ),
    { ...size }
  );
}
