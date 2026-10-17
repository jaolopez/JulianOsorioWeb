import { ImageResponse } from "next/og";
import { datos, svgLogo } from "@/components/brand/svg";

export const alt = "Julián Osorio — Universo creativo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Vista previa al compartir el sitio en WhatsApp, redes o mensajes. */
export default function OpenGraph() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 0%, #ff5a1f 0%, #5a1d10 28%, #0b0a09 62%)",
          color: "#efe8dc",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#a39a8c" }}>MÚSICA · ESCRITURA · FOTOGRAFÍA · GASTRONOMÍA</div>
        <img src={datos(svgLogo("#efe8dc"))} width={780} height={208} alt="" />
        <div style={{ display: "flex", fontSize: 30, color: "#ff5a1f" }}>Universo creativo</div>
      </div>
    ),
    size
  );
}
