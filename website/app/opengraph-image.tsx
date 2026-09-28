import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const alt = "AM Growth Solutions — Automatisation pour les PME";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Charge Inter (même police que le reste du site, voir app/globals.css
// --font-sans / --font-heading) depuis Google Fonts au format TTF — satori
// (moteur de rendu de ImageResponse) n'accepte pas le woff2 que Google sert
// par défaut aux navigateurs récents, d'où le User-Agent d'un navigateur
// ancien pour forcer le format truetype. Best-effort : si le réseau n'est
// pas disponible au moment du build, l'image reste générée avec la police
// système par défaut plutôt que de faire échouer le build.
async function loadInterFont(weight: number): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.1 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.3",
        },
      }
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    // @vercel/og (satori) accepte ttf/otf/woff mais pas woff2 — Google Fonts
    // sert un format ou l'autre selon le User-Agent, d'où le match élargi.
    const fontUrl = css.match(
      /src: url\(([^)]+)\) format\('(?:truetype|opentype|woff)'\)/
    )?.[1];
    if (!fontUrl) return null;
    const fontRes = await fetch(fontUrl);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const logoBuffer = readFileSync(
    join(process.cwd(), "public", "brand", "logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  const [interBold, interSemibold] = await Promise.all([
    loadInterFont(800),
    loadInterFont(600),
  ]);

  const fontsList = [
    ...(interBold
      ? [{ name: "Inter", data: interBold, style: "normal" as const, weight: 800 as const }]
      : []),
    ...(interSemibold
      ? [{ name: "Inter", data: interSemibold, style: "normal" as const, weight: 600 as const }]
      : []),
  ];

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
          position: "relative",
          background: "#ffffff",
          fontFamily: interBold ? "Inter" : undefined,
        }}
      >
        {/* Halos violets très discrets — écho du fond du Hero, sans casser
            le fond blanc demandé. */}
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -220,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(76,58,161,0.08) 0%, rgba(76,58,161,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -240,
            right: -240,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(111,91,201,0.10) 0%, rgba(111,91,201,0) 70%)",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={logoSrc}
          alt=""
          width={112}
          height={112}
          style={{ marginBottom: 36 }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 58,
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
            marginTop: 28,
            width: 64,
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #4c3aa1, #6f5bc9)",
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 22,
            fontWeight: 600,
            color: "#5b6270",
            letterSpacing: 1.5,
          }}
        >
          Antoine MAYER
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 10,
            background: "linear-gradient(90deg, #2b2064, #4c3aa1, #6f5bc9)",
          }}
        />
      </div>
    ),
    {
      ...size,
      // @vercel/og n'accepte pas un tableau `fonts` vide : on n'inclut la
      // clé que si au moins une police a bien été chargée, sinon on la
      // laisse absente (repli sur la police système par défaut).
      ...(fontsList.length ? { fonts: fontsList } : {}),
    }
  );
}
