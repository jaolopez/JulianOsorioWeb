"use client";

import { useEffect, useState } from "react";
import { minutos } from "@/components/audio/MiniReproductor";
import { useReproductor } from "@/components/audio/Reproductor";
import Ondas from "@/components/audio/Ondas";
import Foto from "@/components/ui/Foto";
import { Pausa, Play } from "@/components/ui/Iconos";
import { pistasDe } from "@/lib/pistas";
import type { Album, Cancion } from "@/lib/tipos";

/**
 * Lista de canciones. Tocar una fila la reproduce (y deja el resto en cola);
 * la que suena se marca con el ecualizador en vivo. Con `conLetra`, cada
 * canción que tenga letra la despliega debajo.
 *
 * La duración no hace falta escribirla en el Studio: si falta, se lee del
 * propio archivo.
 */
export default function ListaCanciones({
  album,
  conLetra = false,
  conPortadas = false,
}: {
  album: Album;
  conLetra?: boolean;
  /** Miniatura de cada canción (para las canciones sueltas, que tienen carátula propia). */
  conPortadas?: boolean;
}) {
  const { reproducir, actual, sonando } = useReproductor();
  const cola = pistasDe(album);
  const duraciones = useDuraciones(album.canciones);

  return (
    <ol className="border-t border-linea">
      {album.canciones.map((c, i) => {
        const suena = actual?.audio === c.audio && Boolean(c.audio);
        const indiceCola = cola.findIndex((p) => p.audio === c.audio);
        const duracion = c.duracion ?? (c.audio ? duraciones[c.audio] : undefined);
        return (
          <li key={`${c.titulo}-${i}`} id={c.slug} data-aparecer className="scroll-mt-[calc(var(--barra)+2rem)] border-b border-linea">
            <button
              type="button"
              disabled={!c.audio}
              onClick={() => reproducir(cola, indiceCola)}
              data-cursor={suena && sonando ? "Pausa" : "Play"}
              className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 text-left disabled:cursor-default md:grid-cols-[3.5rem_1fr_auto_3rem] md:py-6"
            >
              <span className="kicker relative grid h-6 place-items-start text-ceniza">
                {suena && sonando ? (
                  <Ondas barras={4} className="h-4 w-6" color="#ff5a1f" />
                ) : (
                  <>
                    <span className="transition-opacity group-hover:opacity-0 group-disabled:group-hover:opacity-100">{String(i + 1).padStart(2, "0")}</span>
                    {c.audio && <Play className="absolute size-4 text-brasa opacity-0 transition-opacity group-hover:opacity-100" />}
                  </>
                )}
              </span>
              <span className="flex min-w-0 items-center gap-4">
                {conPortadas && (
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-noche-3 md:size-14">
                    {c.portada && <Foto foto={c.portada} fill sizes="56px" className="object-cover" />}
                  </span>
                )}
                <span
                  className={`font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-none transition-[color,translate] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2 group-enabled:group-hover:italic ${
                    suena ? "italic text-brasa" : "text-hueso"
                  }`}
                >
                  {c.titulo}
                </span>
              </span>
              <span className="kicker tabular-nums text-humo">{duracion}</span>
              <span className="hidden justify-self-end text-ceniza md:block">
                {c.audio && (suena && sonando ? <Pausa className="size-4" /> : <Play className="size-4 opacity-40 group-hover:opacity-100" />)}
              </span>
            </button>
            {conLetra && c.letra && (
              <details className="-mt-2 pb-6 pl-[3.5rem] md:pl-[4.5rem]">
                <summary className="kicker w-fit cursor-pointer list-none py-1 text-humo transition-colors hover:text-hueso [&::-webkit-details-marker]:hidden">
                  Ver letra
                </summary>
                <p className="mt-4 whitespace-pre-line font-display text-xl leading-snug text-ceniza">{c.letra}</p>
              </details>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Lee la duración de cada archivo (sólo sus primeros bytes) cuando no vino escrita. */
function useDuraciones(canciones: Cancion[]) {
  const [duraciones, setDuraciones] = useState<Record<string, string>>({});
  const faltan = canciones.filter((c) => c.audio && !c.duracion).map((c) => c.audio!);
  const clave = faltan.join("|");

  useEffect(() => {
    if (!clave) return;
    const elementos: HTMLAudioElement[] = [];
    // Después de que la página cargó, para no competir con lo importante.
    const espera = window.setTimeout(() => {
      for (const src of clave.split("|")) {
        const a = new Audio();
        a.preload = "metadata";
        a.onloadedmetadata = () => setDuraciones((d) => ({ ...d, [src]: minutos(a.duration) }));
        a.src = src;
        elementos.push(a);
      }
    }, 1500);
    return () => {
      clearTimeout(espera);
      elementos.forEach((a) => {
        a.onloadedmetadata = null;
        a.removeAttribute("src");
      });
    };
  }, [clave]);

  return duraciones;
}
