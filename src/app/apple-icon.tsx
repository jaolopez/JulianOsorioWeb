import { ImageResponse } from "next/og";
import { datos, svgIsotipo } from "@/components/brand/svg";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícono para la pantalla de inicio del iPhone. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0a09", borderRadius: 0 }}>
        <img src={datos(svgIsotipo("#ff5a1f"))} width={120} height={91} alt="" />
      </div>
    ),
    size
  );
}
