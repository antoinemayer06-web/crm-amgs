import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

// Généré dynamiquement via next/og (même mécanisme que opengraph-image.tsx,
// confirmé fonctionnel en production) plutôt qu'un fichier statique
// app/icon.png — celui-ci renvoyait un 404 sur ce déploiement Vercel
// (monorepo, Root Directory = website) malgré un build local correct.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  const logoBuffer = readFileSync(
    join(process.cwd(), "public", "favicon-512.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img src={logoSrc} width={512} height={512} />
    ),
    { ...size }
  );
}
