import Link from "next/link";
import { ViewTransition } from "react";
import Foto from "@/components/ui/Foto";
import { fechaCorta } from "@/lib/fechas";
import { MUNDOS } from "@/lib/mundos";
import type { Publicacion } from "@/lib/tipos";

/** Publicación en un listado. La portada viaja hasta la página del artículo. */
export default function Tarjeta({ p, grande = false }: { p: Publicacion; grande?: boolean }) {
  const mundo = p.mundo === "general" ? null : MUNDOS[p.mundo];
  return (
    <Link
      href={`/bitacora/${p.slug}`}
      data-aparecer
      data-cursor="Leer"
      className="group block"
      style={{ "--tono": mundo?.tono ?? "var(--color-brasa)" } as React.CSSProperties}
    >
      <div className={`relative overflow-hidden rounded-sm bg-noche-3 ${grande ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {p.portada && (
          <ViewTransition name={`publicacion-${p.slug}`} share="foto-viaje" default="none">
            <Foto
              foto={p.portada}
              fill
              sizes={grande ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
              className="object-cover transition-[scale,filter] duration-1000 ease-[var(--ease-expo)] group-hover:scale-105 group-hover:brightness-110"
            />
          </ViewTransition>
        )}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="kicker text-[var(--tono)]">{mundo?.nombre ?? "Bitácora"}</span>
        <span className="h-px w-6 bg-linea" />
        <time dateTime={p.fecha} className="kicker tabular-nums text-humo">
          {fechaCorta(p.fecha)}
        </time>
      </div>
      <h3 className={`display mt-4 text-balance transition-colors duration-500 group-hover:text-[var(--tono)] ${grande ? "text-[clamp(2.25rem,4vw,4rem)]" : "text-[clamp(1.75rem,2.4vw,2.5rem)]"}`}>
        {p.titulo}
      </h3>
      {p.extracto && <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ceniza">{p.extracto}</p>}
    </Link>
  );
}
