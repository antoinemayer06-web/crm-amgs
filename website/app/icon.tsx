import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Favicon généré par défaut (fond indigo, accent vert). À remplacer par le
// logo définitif une fois déposé dans /public/brand/logo.png.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e2a5e",
          borderRadius: 6,
          color: "#34c087",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
