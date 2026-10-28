import type { Pista } from "@/components/audio/Reproductor";
import type { Album } from "./tipos";

/** Las canciones con audio de un álbum, listas para la cola del reproductor. */
export function pistasDe(album: Album): Pista[] {
  return album.canciones.flatMap((c) =>
    c.audio
      ? [{ titulo: c.titulo, audio: c.audio, album: album.titulo, albumSlug: album.slug, portada: c.portada ?? album.portada }]
      : []
  );
}

/**
 * Título a partir del nombre del archivo, para cuando se sube un MP3 sin
 * escribirle título: «03 - Separación seis.mp3» → «Separación seis».
 */
export function tituloDeArchivo(nombre?: string | null) {
  if (!nombre) return "";
  let t = nombre
    .replace(/\.[a-z0-9]{2,4}$/i, "")
    .replace(/^\s*(track\s*)?\d{1,3}\s*[-_.)]+\s*/i, "")
    .replace(/_/g, " ");
  // «separacion-seis» (sin espacios) también se lee como palabras.
  if (!t.includes(" ")) t = t.replace(/-/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}
