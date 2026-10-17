"use client";

import { useReproductor } from "@/components/audio/Reproductor";
import Ondas from "@/components/audio/Ondas";
import { Pausa, Play } from "@/components/ui/Iconos";
import { pistasDe } from "@/lib/pistas";
import type { Album } from "@/lib/tipos";

/**
 * Lista de canciones. Tocar una fila la reproduce (y deja el resto del disco
 * en cola); la que suena se marca con el ecualizador en vivo.
 */
export default function ListaCanciones({ album, conLetra = false }: { album: Album; conLetra?: boolean }) {
  const { reproducir, actual, sonando } = useReproductor();
  const cola = pistasDe(album);

  return (
    <ol className="border-t border-linea">
      {album.canciones.map((c, i) => {
        const suena = actual?.audio === c.audio && Boolean(c.audio);
        const indiceCola = cola.findIndex((p) => p.audio === c.audio);
        return (
          <li key={`${c.titulo}-${i}`} data-aparecer className="border-b border-linea">
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
              <span
                className={`font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-none transition-[color,translate] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2 group-enabled:group-hover:italic ${
                  suena ? "italic text-brasa" : "text-hueso"
                }`}
              >
                {c.titulo}
              </span>
              <span className="kicker tabular-nums text-humo">{c.duracion}</span>
              <span className="hidden justify-self-end text-ceniza md:block">
                {c.audio && (suena && sonando ? <Pausa className="size-4" /> : <Play className="size-4 opacity-40 group-hover:opacity-100" />)}
              </span>
            </button>
            {conLetra && c.letra && (
              <details className="group/letra -mt-2 pb-6 pl-[3.5rem] md:pl-[4.5rem]">
                <summary className="kicker cursor-pointer list-none text-humo hover:text-hueso">Ver letra</summary>
                <p className="mt-4 whitespace-pre-line font-display text-xl leading-snug text-ceniza">{c.letra}</p>
              </details>
            )}
          </li>
        );
      })}
    </ol>
  );
}
