"use client";

import { useEffect, useRef, useState } from "react";
import Foto from "@/components/ui/Foto";
import { Cerrar, Flecha } from "@/components/ui/Iconos";
import { gsap, sinMovimiento } from "@/lib/gsap";
import type { Foto as TFoto } from "@/lib/tipos";

/**
 * Mosaico de fotos y visor a pantalla completa.
 *
 * Al tocar una foto, ésta crece desde su lugar en el mosaico hasta llenar la
 * pantalla. En el visor: flechas del teclado o deslizar con el dedo para
 * pasar, Escape o el botón para cerrar.
 */
export default function Visor({ fotos, titulo }: { fotos: TFoto[]; titulo: string }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const origen = useRef<HTMLElement | null>(null);
  const capa = useRef<HTMLDivElement>(null);
  const marco = useRef<HTMLDivElement>(null);
  const toque = useRef<number | null>(null);

  const abrir = (i: number, el: HTMLElement) => {
    origen.current = el;
    setAbierta(i);
  };

  const cerrar = () => {
    if (!capa.current || sinMovimiento()) return setAbierta(null);
    gsap.to(capa.current, { opacity: 0, duration: 0.4, ease: "power2.out", onComplete: () => setAbierta(null) });
  };

  const pasar = (d: number) => setAbierta((i) => (i === null ? i : (i + d + fotos.length) % fotos.length));

  // Entrada: la foto sale del lugar exacto que ocupaba en el mosaico.
  // Sólo al abrir; al pasar de una foto a otra no se repite.
  const hayAbierta = abierta !== null;
  useEffect(() => {
    if (!hayAbierta) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const m = marco.current;
    const o = origen.current;
    if (capa.current) gsap.fromTo(capa.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    if (m && o && !sinMovimiento()) {
      const a = o.getBoundingClientRect();
      const b = m.getBoundingClientRect();
      gsap.fromTo(
        m,
        {
          x: a.left + a.width / 2 - (b.left + b.width / 2),
          y: a.top + a.height / 2 - (b.top + b.height / 2),
          scale: Math.min(a.width / b.width, a.height / b.height),
        },
        { x: 0, y: 0, scale: 1, duration: 0.9, ease: "casa" }
      );
    }
    origen.current = null;
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [hayAbierta]);

  useEffect(() => {
    if (abierta === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") pasar(1);
      if (e.key === "ArrowLeft") pasar(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  });

  const actual = abierta === null ? null : fotos[abierta];

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {fotos.map((f, i) => (
          <li key={`${f.src}-${i}`} data-aparecer className="break-inside-avoid">
            <button
              type="button"
              data-cursor="Ampliar"
              onClick={(e) => abrir(i, e.currentTarget)}
              className="group relative block w-full overflow-hidden rounded-sm bg-noche-3"
              style={{ aspectRatio: `${f.ancho} / ${f.alto}` }}
              aria-label={`Ampliar foto ${i + 1} de ${fotos.length}${f.alt ? `: ${f.alt}` : ""}`}
            >
              <Foto foto={f} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-105" />
            </button>
            {f.pie && <p className="kicker mt-3 text-humo">{f.pie}</p>}
          </li>
        ))}
      </ul>

      {actual && (
        <div
          ref={capa}
          role="dialog"
          aria-modal="true"
          aria-label={`${titulo}: foto ${abierta! + 1} de ${fotos.length}`}
          className="fixed inset-0 z-[95] flex flex-col bg-noche/[0.97]"
          onPointerDown={(e) => (toque.current = e.clientX)}
          onPointerUp={(e) => {
            if (toque.current === null) return;
            const dx = e.clientX - toque.current;
            toque.current = null;
            if (Math.abs(dx) > 50) pasar(dx < 0 ? 1 : -1);
          }}
        >
          <div className="contenedor flex h-[var(--barra)] shrink-0 items-center justify-between">
            <p className="kicker tabular-nums text-ceniza">
              {String(abierta! + 1).padStart(2, "0")} / {String(fotos.length).padStart(2, "0")}
            </p>
            <button type="button" onClick={cerrar} className="-mr-2 grid size-11 place-items-center text-hueso" aria-label="Cerrar" autoFocus>
              <Cerrar className="size-6" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-[var(--gutter)]">
            <div ref={marco} className="relative h-full max-h-full w-full" key={actual.src}>
              <Foto foto={actual} fill sizes="100vw" quality={90} className="object-contain" />
            </div>
          </div>

          <div className="contenedor flex min-h-20 shrink-0 items-center justify-between gap-6 pb-[env(safe-area-inset-bottom)]">
            <button type="button" onClick={() => pasar(-1)} className="grid size-12 place-items-center rounded-full border border-linea text-hueso hover:border-hueso" aria-label="Anterior">
              <Flecha className="size-5 rotate-180" />
            </button>
            <p className="line-clamp-2 text-center text-sm text-ceniza">{actual.pie ?? actual.alt}</p>
            <button type="button" onClick={() => pasar(1)} className="grid size-12 place-items-center rounded-full border border-linea text-hueso hover:border-hueso" aria-label="Siguiente">
              <Flecha className="size-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
