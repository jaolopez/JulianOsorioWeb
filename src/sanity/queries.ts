import { cacheLife, cacheTag } from "next/cache";
import { client } from "./client";
import { sanityConectado } from "./env";
import * as respaldo from "@/lib/contenido";
import { tituloDeArchivo } from "@/lib/pistas";
import { conSlugs, slugificar } from "@/lib/slug";
import type { Acerca, Ajustes, Album, Evento, Experiencia, Foto, Galeria, Portada, Texto, Video } from "@/lib/tipos";
import { idYoutube } from "@/lib/youtube";

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
 *
 * Nada en el Studio pide una «dirección web»: cada disco, texto o galería
 * se enlaza dentro de su página con `#slug`, y el slug sale del título.
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

/** Canciones de un disco: cada una es un archivo; el título, si falta, sale del nombre del archivo. */
const ALBUM = `{
  titulo, "tipo": coalesce(tipo, "album"), anio, genero, descripcion,
  ${foto("portada")},
  "canciones": coalesce(canciones[defined(asset)]{
    titulo, letra, "audio": asset->url, "archivo": asset->originalFilename
  }, []),
  "enlaces": coalesce(enlaces, {})
}`;

const TEXTO = `{
  titulo, "tipo": coalesce(tipo, "poema"), fecha, cuerpo, extracto, ${foto("imagen")}
}`;

const GALERIA = `{
  titulo, fecha, lugar, descripcion, ${foto("portada")}, ${fotos()}
}`;

type CancionCruda = { titulo?: string | null; letra?: string; audio: string; archivo?: string };
const tituloCancion = (c: CancionCruda) => c.titulo || tituloDeArchivo(c.archivo) || "Sin título";

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
      "destacado": albumDestacado->{ "tipo": _type, titulo, "archivo": audio.asset->originalFilename },
      "textoDestacado": textoDestacado->titulo,
      "mundos": mundos[]{ clave, frase, ${foto("foto")} }
    }`
  );
  const { destacado, textoDestacado, ...d } = limpio(
    doc as (Partial<Portada> & { destacado?: { tipo: "album" | "cancion"; titulo?: string; archivo?: string }; textoDestacado?: string }) | null
  );
  // Cada mundo toma lo que se haya cargado en el Studio y completa el resto con el respaldo.
  const mundos = respaldo.PORTADA.mundos.map((m) => {
    const delStudio = d.mundos?.find((x) => x.clave === m.clave);
    return { ...m, ...limpio(delStudio) };
  });
  return {
    ...respaldo.PORTADA,
    ...d,
    mundos,
    ...(destacado
      ? { destacado: { tipo: destacado.tipo, slug: slugificar(destacado.titulo || tituloDeArchivo(destacado.archivo)) } }
      : sanityConectado
        ? { destacado: undefined }
        : {}),
    ...(textoDestacado ? { textoSlug: slugificar(textoDestacado) } : sanityConectado ? { textoSlug: undefined } : {}),
  };
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
  const docs = await consultar<(Omit<Album, "slug" | "canciones"> & { canciones: CancionCruda[] })[]>(
    "album",
    `*[_type == "album" && defined(titulo)] | order(coalesce(orden, 999) asc, anio desc) ${ALBUM}`
  );
  if (!docs) return respaldo.ALBUMES;
  return conSlugs(
    docs.map((a) => ({ ...a, canciones: a.canciones.map((c) => ({ titulo: tituloCancion(c), audio: c.audio, letra: c.letra })) }))
  );
}

/** Canciones sueltas, con forma de disco de una sola canción. */
export async function getSencillos(): Promise<Album[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cancion");
  const docs = await consultar<(CancionCruda & { fecha: string; portada: Foto | null; enlaces: Album["enlaces"] })[]>(
    "cancion",
    `*[_type == "cancion" && defined(audio.asset)] | order(fecha desc){
      titulo, letra, fecha, "audio": audio.asset->url, "archivo": audio.asset->originalFilename,
      ${foto("portada")}, "enlaces": coalesce(enlaces, {})
    }`
  );
  if (!docs) return respaldo.SENCILLOS;
  return conSlugs(
    docs.map((c) => {
      const titulo = tituloCancion(c);
      const portada = c.portada ?? undefined;
      return {
        titulo,
        tipo: "sencillo" as const,
        anio: Number(c.fecha?.slice(0, 4)) || new Date().getFullYear(),
        portada,
        canciones: [{ titulo, audio: c.audio, letra: c.letra, portada }],
        enlaces: c.enlaces,
      };
    })
  ).map((s) => ({ ...s, canciones: [{ ...s.canciones[0], slug: s.slug }] }));
}

export async function getVideos(): Promise<Video[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("video");
  const docs = await consultar<(Omit<Video, "id" | "titulo"> & { url: string; titulo?: string })[]>(
    "video",
    `*[_type == "video"] | order(fecha desc){ titulo, url, fecha, descripcion }`
  );
  if (!docs) return respaldo.VIDEOS;
  const videos = await Promise.all(
    docs.map(async ({ url, titulo, ...v }) => {
      const id = idYoutube(url);
      return id ? { ...v, id, titulo: titulo || (await tituloEnYoutube(id)) || "Video" } : null;
    })
  );
  return videos.filter((v) => v !== null);
}

/** Título que el video tiene en YouTube, para cuando en el Studio sólo se pegó el enlace. */
async function tituloEnYoutube(id: string) {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`);
    if (!r.ok) return null;
    return ((await r.json()) as { title?: string }).title ?? null;
  } catch {
    return null;
  }
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
  const docs = await consultar<Omit<Texto, "slug">[]>("texto", `*[_type == "texto" && defined(titulo) && defined(cuerpo)] | order(fecha desc) ${TEXTO}`);
  const lista = docs ? conSlugs(docs) : respaldo.TEXTOS;
  return lista.map((t) => ({ ...t, extracto: t.extracto || primerRenglon(t.cuerpo) }));
}

/* --- Fotografía --- */

export async function getGalerias(): Promise<Galeria[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("galeria");
  const docs = await consultar<(Omit<Galeria, "portada" | "slug"> & { portada: Foto | null })[]>(
    "galeria",
    `*[_type == "galeria" && defined(titulo)] | order(fecha desc) ${GALERIA}`
  );
  if (!docs) return respaldo.GALERIAS;
  // Sin portada se usa la primera foto; una galería sin ninguna foto no se muestra.
  return conSlugs(
    docs.flatMap((g) => {
      const lista = g.fotos ?? [];
      const portada = g.portada ?? lista[0];
      return portada ? [{ ...g, fotos: lista, portada }] : [];
    })
  );
}

/* --- Gastronomía --- */

export async function getExperiencias(): Promise<Experiencia[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("experiencia");
  const docs = await consultar<Omit<Experiencia, "slug">[]>(
    "experiencia",
    `*[_type == "experiencia" && defined(titulo)] | order(fecha desc){
      titulo, fecha, lugar, descripcion, "menu": coalesce(menu, []), ${foto("portada")}, ${fotos()}
    }`
  );
  if (!docs) return respaldo.EXPERIENCIAS;
  return conSlugs(docs.map((e) => ({ ...e, fotos: e.fotos ?? [], portada: e.portada ?? e.fotos?.[0] })));
}
