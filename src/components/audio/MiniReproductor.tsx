"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Foto from "@/components/ui/Foto";
import { Anterior, Pausa, Play, Siguiente } from "@/components/ui/Iconos";
import Ondas from "./Ondas";
import { useReproductor } from "./Reproductor";

/**
 * Reproductor flotante. Aparece al dar play por primera vez y se queda
 * abajo mientras se recorre el sitio. En el celular ocupa el ancho de la
 * pantalla y respeta la zona segura del borde inferior.
 */
export default function MiniReproductor() {
  const { actual, sonando, alternar, siguiente, anterior, buscar, audio, cola } = useReproductor();
  const barra = useRef<HTMLDivElement>(null);
  const tiempo = useRef<HTMLSpanElement>(null);

  // Progreso leído del <audio> en cada cuadro mientras suena: fluido y sin re-renderizar.
  useEffect(() => {
    let id = 0;
    const paso = () => {
      const el = audio.current;
      if (el && barra.current && Number.isFinite(el.duration)) {
        barra.current.style.transform = `scaleX(${el.currentTime / el.duration})`;
        if (tiempo.current) tiempo.current.textContent = minutos(el.currentTime);
      }
      if (sonando) id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [audio, sonando, actual]);

  const visible = Boolean(actual);

  return (
    <div
      role="region"
      aria-label="Reproductor"
      inert={!visible}
      className={`fixed z-[80] inset-x-[var(--gutter)] bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] md:inset-x-auto md:left-[var(--gutter)] md:bottom-[var(--gutter)] md:w-[24rem] transition-[translate,opacity] duration-700 ease-[var(--ease-expo)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-[140%] opacity-0"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-linea bg-noche-2/95 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.9)]">
        {/* Barra de progreso: tocarla salta a ese punto. */}
        <button
          type="button"
          aria-label="Saltar a un punto de la canción"
          className="group absolute inset-x-0 top-0 h-3 -translate-y-1"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            buscar((e.clientX - r.left) / r.width);
          }}
        >
          <span className="absolute inset-x-0 top-1 h-px bg-linea" />
          <span ref={barra} className="absolute inset-x-0 top-1 h-px origin-left scale-x-0 bg-brasa group-hover:h-[3px]" />
        </button>

        <div className="flex items-center gap-3 p-2.5 pr-3">
          {actual?.albumSlug ? (
            <Link href={`/musica#${actual.albumSlug}`} aria-label={`Ir a «${actual.album}»`} className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-noche-3">
              {actual.portada && <Foto foto={actual.portada} fill sizes="44px" className={`object-cover transition-transform duration-[2s] ${sonando ? "scale-110" : ""}`} />}
            </Link>
          ) : (
            <span className="size-11 shrink-0 rounded-lg bg-noche-3" />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm leading-tight text-hueso">{actual?.titulo ?? "—"}</p>
            <p className="kicker mt-1.5 flex gap-2 truncate text-ceniza">
              <span ref={tiempo} className="tabular-nums">0:00</span>
              <span className="truncate">{actual?.album}</span>
            </p>
          </div>

          <Ondas barras={10} className="hidden h-7 w-12 xs:block" color="#ff5a1f" />

          <div className="flex items-center">
            {cola.length > 1 && (
              <button type="button" onClick={anterior} aria-label="Anterior" className="grid size-9 place-items-center text-ceniza transition-colors hover:text-hueso">
                <Anterior className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={alternar}
              aria-label={sonando ? "Pausar" : "Reproducir"}
              className="grid size-10 place-items-center rounded-full bg-hueso text-noche transition-transform active:scale-90"
            >
              {sonando ? <Pausa className="size-4" /> : <Play className="size-4 translate-x-px" />}
            </button>
            {cola.length > 1 && (
              <button type="button" onClick={siguiente} aria-label="Siguiente" className="grid size-9 place-items-center text-ceniza transition-colors hover:text-hueso">
                <Siguiente className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function minutos(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}
