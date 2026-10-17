import { cacheLife, cacheTag } from "next/cache";
import { client } from "./client";
import { sanityConectado } from "./env";
import * as respaldo from "@/lib/contenido";
import type {
  Acerca,
  Ajustes,
  Album,
  Evento,
  Experiencia,
  Foto,
  Galeria,
  Portada,
  Publicacion,
  Texto,
  Video,
} from "@/lib/tipos";

/**
 * Lecturas del contenido.
 *
 * Cada función se cachea con `"use cache"` y lleva la etiqueta del tipo de
 * documento que lee. Al publicar en el Studio, el webhook de Sanity llama a
 * /api/revalidate con ese tipo y sólo se regenera lo que cambió. Sin webhook
 * el contenido se refresca solo cada hora.
 *
 * Sin proyecto conectado (o si Sanity no responde) se devuelve el contenido
 * de respaldo: el sitio nunca queda en blanco.
 */

async function consultar<T>(tag: string, groq: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!sanityConectado) return null;
  try {
    return await client.fetch<T>(groq, params);
  } catch (err) {
    console.error(`[sanity] No se pudo leer «${tag}»:`, (err as Error).message);
    return null;
  }
}

/* --- Proyecciones GROQ --- */

/** Una imagen cuya foto se borró queda como `{_type: "image"}` sin archivo: sólo se devuelven las que tienen. */
const foto = (campo: string, alias = campo) => `"${alias}": select(defined(${campo}.asset) => {
  "src": ${campo}.asset->url,
  "ancho": ${campo}.asset->metadata.dimensions.width,
  "alto": ${campo}.asset->metadata.dimensions.height,
  "lqip": ${campo}.asset->metadata.lqip,
  "alt": coalesce(${campo}.alt, ""),
  "foco": ${campo}.hotspot{x, y},
  "pie": ${campo}.pie
})`;

const fotos = (campo = "fotos") => `"${campo}": ${campo}[defined(asset)]{
  "src": asset->url,
  "ancho": asset->metadata.dimensions.width,
  "alto": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  "alt": coalesce(alt, ""),
  "foco": hotspot{x, y},
  pie
}`;

const ALBUM = `{
  "slug": slug.current, titulo, "tipo": coalesce(tipo, "album"), anio, genero, descripcion,
  ${foto("portada")},
  "canciones": coalesce(canciones[]{ titulo, "audio": audio.asset->url, duracion, letra }, []),
  "enlaces": coalesce(enlaces, {})
}`;

const TEXTO = `{
  "slug": slug.current, titulo, "tipo": coalesce(tipo, "poema"), fecha, cuerpo, extracto, ${foto("imagen")}
}`;

const GALERIA = `{
  "slug": slug.current, titulo, fecha, lugar, descripcion, ${foto("portada")}, ${fotos()}
}`;

const PUBLICACION = `{
  "slug": slug.current, titulo, fecha, "mundo": coalesce(mundo, "general"), extracto, ${foto("portada")}
}`;

/** Quita nulos para que no pisen los valores de respaldo al combinar. */
function limpio<T extends object>(o: T | null | undefined): Partial<T> {
  if (!o) return {};
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== "")) as Partial<T>;
}

/** Primer renglón con texto: sirve de extracto cuando no se escribió uno. */
const primerRenglon = (cuerpo = "") => cuerpo.split("\n").find((l) => l.trim())?.trim() ?? "";

/* --- Piezas fijas --- */

export async function getAjustes(): Promise<Ajustes> {
  "use cache";
  cacheLife("hours");
  cacheTag("ajustes");
  const doc = await consultar<Partial<Ajustes>>("ajustes", `*[_id == "ajustes"][0]{ correo, whatsapp, ciudad, redes, descripcion }`);
  const d = limpio(doc);
  return { ...respaldo.AJUSTES, ...d, redes: limpio(d.redes) };
}

export async function getPortada(): Promise<Portada> {
  "use cache";
  cacheLife("hours");
  cacheTag("portada");
  const doc = await consultar<Partial<Portada>>(
    "portada",
    `*[_id == "portada"][0]{
      titular, bajada, manifiesto,
      "albumSlug": albumDestacado->slug.current,
      "textoSlug": textoDestacado->slug.current,
      "mundos": mundos[]{ clave, frase, ${foto("foto")} }
    }`
  );
  const d = limpio(doc);
  // Cada mundo toma lo que se haya cargado en el Studio y completa el resto con el respaldo.
  const mundos = respaldo.PORTADA.mundos.map((m) => {
    const delStudio = d.mundos?.find((x) => x.clave === m.clave);
    return { ...m, ...limpio(delStudio) };
  });
  return { ...respaldo.PORTADA, ...d, mundos };
}

export async function getAcerca(): Promise<Acerca> {
  "use cache";
  cacheLife("hours");
  cacheTag("acerca");
  const doc = await consultar<Partial<Acerca>>("acerca", `*[_id == "acerca"][0]{ ${foto("retrato")}, intro, bio, hitos[]{anio, texto} }`);
  const d = limpio(doc);
  return {
    ...respaldo.ACERCA,
    ...d,
    bio: d.bio?.length ? d.bio : respaldo.ACERCA.bio,
    hitos: d.hitos?.length ? d.hitos : respaldo.ACERCA.hitos,
  };
}

/* --- Música --- */

export async function getAlbumes(): Promise<Album[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("album");
  const docs = await consultar<Album[]>("album", `*[_type == "album" && defined(slug.current)] | order(coalesce(orden, 999) asc, anio desc) ${ALBUM}`);
  return docs ?? respaldo.ALBUMES;
}

export async function getAlbum(slug: string): Promise<Album | null> {
  const albumes = await getAlbumes();
  return albumes.find((a) => a.slug === slug) ?? null;
}

/** "https://youtu.be/abc" o "https://www.youtube.com/watch?v=abc" → "abc". */
export function idYoutube(url = "") {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

export async function getVideos(): Promise<Video[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("video");
  const docs = await consultar<(Omit<Video, "id"> & { url: string })[]>(
    "video",
    `*[_type == "video"] | order(fecha desc){ titulo, url, fecha, descripcion }`
  );
  if (!docs) return respaldo.VIDEOS;
  return docs.flatMap(({ url, ...v }) => {
    const id = idYoutube(url);
    return id ? [{ ...v, id }] : [];
  });
}

export async function getEventos(): Promise<Evento[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("evento");
  const docs = await consultar<Evento[]>(
    "evento",
    `*[_type == "evento"] | order(fecha asc){ "id": _id, titulo, fecha, lugar, ciudad, enlace }`
  );
  return docs ?? respaldo.EVENTOS;
}

/** Fechas que todavía no pasaron. El corte se recalcula cada hora junto con la caché. */
export async function getProximosEventos(): Promise<Evento[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("evento");
  const ahora = Date.now() - 6 * 3600 * 1000; // el evento de hoy sigue visible unas horas después de empezar
  return (await getEventos()).filter((e) => new Date(e.fecha).getTime() >= ahora);
}

/* --- Escritura --- */

export async function getTextos(): Promise<Texto[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("texto");
  const docs = await consultar<Texto[]>("texto", `*[_type == "texto" && defined(slug.current)] | order(fecha desc) ${TEXTO}`);
  const lista = docs ?? respaldo.TEXTOS;
  return lista.map((t) => ({ ...t, extracto: t.extracto || primerRenglon(t.cuerpo) }));
}

export async function getTexto(slug: string): Promise<Texto | null> {
  return (await getTextos()).find((t) => t.slug === slug) ?? null;
}

/* --- Fotografía --- */

export async function getGalerias(): Promise<Galeria[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("galeria");
  const docs = await consultar<(Omit<Galeria, "portada"> & { portada: Foto | null })[]>(
    "galeria",
    `*[_type == "galeria" && defined(slug.current)] | order(fecha desc) ${GALERIA}`
  );
  if (!docs) return respaldo.GALERIAS;
  // Sin portada se usa la primera foto; una galería sin ninguna foto no se muestra.
  return docs.flatMap((g) => {
    const lista = g.fotos ?? [];
    const portada = g.portada ?? lista[0];
    return portada ? [{ ...g, fotos: lista, portada }] : [];
  });
}

export async function getGaleria(slug: string): Promise<Galeria | null> {
  return (await getGalerias()).find((g) => g.slug === slug) ?? null;
}

/* --- Gastronomía --- */

export async function getExperiencias(): Promise<Experiencia[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("experiencia");
  const docs = await consultar<Experiencia[]>(
    "experiencia",
    `*[_type == "experiencia" && defined(slug.current)] | order(fecha desc){
      "slug": slug.current, titulo, fecha, lugar, descripcion, "menu": coalesce(menu, []), ${foto("portada")}, ${fotos()}
    }`
  );
  if (!docs) return respaldo.EXPERIENCIAS;
  return docs.map((e) => ({ ...e, fotos: e.fotos ?? [], portada: e.portada ?? e.fotos?.[0] }));
}

/* --- Bitácora --- */

export async function getPublicaciones(): Promise<Publicacion[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("publicacion");
  const docs = await consultar<Publicacion[]>(
    "publicacion",
    `*[_type == "publicacion" && defined(slug.current)] | order(fecha desc) ${PUBLICACION}`
  );
  return docs ?? respaldo.PUBLICACIONES;
}

export async function getPublicacion(slug: string): Promise<Publicacion | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("publicacion");
  const doc = await consultar<Publicacion | null>(
    "publicacion",
    `*[_type == "publicacion" && slug.current == $slug][0]{
      "slug": slug.current, titulo, fecha, "mundo": coalesce(mundo, "general"), extracto, ${foto("portada")},
      "contenido": contenido[]{
        ...,
        _type == "image" => {
          _type, _key, alt, pie,
          "src": asset->url,
          "ancho": asset->metadata.dimensions.width,
          "alto": asset->metadata.dimensions.height,
          "lqip": asset->metadata.lqip
        }
      }
    }`,
    { slug }
  );
  if (sanityConectado) return doc;
  return respaldo.PUBLICACIONES.find((p) => p.slug === slug) ?? null;
}
