import type { Pista } from "@/components/audio/Reproductor";
import type { Album } from "./tipos";

/** Las canciones con audio de un álbum, listas para la cola del reproductor. */
export function pistasDe(album: Album): Pista[] {
  return album.canciones.flatMap((c) =>
    c.audio ? [{ titulo: c.titulo, audio: c.audio, album: album.titulo, albumSlug: album.slug, portada: album.portada }] : []
  );
}
