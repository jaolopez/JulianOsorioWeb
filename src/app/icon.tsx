import { ImageResponse } from "next/og";
import { datos, svgIsotipo } from "@/components/brand/svg";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Ícono de la pestaña: la «J» del isotipo en hueso sobre la noche. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0a09", borderRadius: 14 }}>
        <img src={datos(svgIsotipo("#ff5a1f"))} width={44} height={33} alt="" />
      </div>
    ),
    size
  );
}
