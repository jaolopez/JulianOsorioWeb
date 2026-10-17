"use client";

import { useReproductor } from "@/components/audio/Reproductor";
import Foto from "@/components/ui/Foto";
import type { Album, Foto as TFoto } from "@/lib/tipos";

/**
 * Funda y vinilo. El disco asoma de la funda y, mientras suena una canción
 * de este álbum, sale un poco más y gira. Los surcos son un degradado radial
 * repetido; la etiqueta del centro es la carátula.
 */
export default function Disco({ album, funda, className = "" }: { album: Album; funda?: TFoto; className?: string }) {
  const { actual, sonando } = useReproductor();
  const esteDisco = Boolean(actual && album.canciones.some((c) => c.audio === actual.audio));
  const girando = esteDisco && sonando;
  const portada = funda ?? album.portada;

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      {/* Vinilo */}
      <div
        className={`absolute inset-[4%] rounded-full transition-transform duration-[1.4s] ease-[var(--ease-expo)] ${
          girando ? "translate-x-[38%]" : "translate-x-[22%]"
        }`}
        aria-hidden
      >
        <div
          className="size-full rounded-full shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9),inset_0_0_0_1px_rgb(239_232_220/0.08)]"
          style={{
            animation: "girar 3.2s linear infinite",
            animationPlayState: girando ? "running" : "paused",
            background:
              "conic-gradient(from 30deg, transparent, rgb(255 200 160/0.16) 10%, transparent 22%, transparent 50%, rgb(255 200 160/0.12) 60%, transparent 72%), repeating-radial-gradient(circle, #1b1815 0 1px, #0e0d0c 1.5px 3px)",
          }}
        >
          <div className="absolute inset-[33%] overflow-hidden rounded-full border-4 border-noche">
            {album.portada && <Foto foto={album.portada} fill sizes="160px" className="object-cover" />}
            <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-noche" />
          </div>
        </div>
      </div>

      {/* Funda */}
      <div className="relative z-10 size-full overflow-hidden rounded-sm bg-noche-3 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.95)]">
        {portada && <Foto foto={portada} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-tr from-noche/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgb(255_90_31/0.25),transparent_55%)] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 p-5 md:p-7">
          <p className="kicker text-hueso/70">Julián Osorio</p>
          <p className="display mt-2 text-[clamp(1.75rem,3.2vw,3rem)] italic text-hueso">{album.titulo}</p>
        </div>
      </div>
    </div>
  );
}
