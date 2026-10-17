import type { MetadataRoute } from "next";
import { getAlbumes, getGalerias, getPublicaciones, getTextos } from "@/sanity/queries";

const SITIO = process.env.NEXT_PUBLIC_SITE_URL || "https://www.julianosoriomusic.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [albumes, textos, galerias, publicaciones] = await Promise.all([getAlbumes(), getTextos(), getGalerias(), getPublicaciones()]);
  const fijas = ["", "/musica", "/escritura", "/fotografia", "/gastronomia", "/bitacora", "/acerca"].map((r) => ({
    url: `${SITIO}${r}`,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.8,
  }));
  return [
    ...fijas,
    ...albumes.map((a) => ({ url: `${SITIO}/musica/${a.slug}`, priority: 0.7 })),
    ...textos.map((t) => ({ url: `${SITIO}/escritura/${t.slug}`, lastModified: t.fecha, priority: 0.6 })),
    ...galerias.map((g) => ({ url: `${SITIO}/fotografia/${g.slug}`, lastModified: g.fecha, priority: 0.6 })),
    ...publicaciones.map((p) => ({ url: `${SITIO}/bitacora/${p.slug}`, lastModified: p.fecha, priority: 0.6 })),
  ];
}
