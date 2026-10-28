import type { MetadataRoute } from "next";

const SITIO = process.env.NEXT_PUBLIC_SITE_URL || "https://www.julianosoriomusic.com";

/** El inicio y las cuatro páginas: todo lo demás vive dentro de ellas. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/musica", "/escritura", "/fotografia", "/gastronomia"].map((r) => ({
    url: `${SITIO}${r}`,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.8,
  }));
}
