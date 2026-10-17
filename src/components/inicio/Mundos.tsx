"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Foto from "@/components/ui/Foto";
import { FlechaDiagonal } from "@/components/ui/Iconos";
import { gsap, punteroFino, sinMovimiento, useGSAP } from "@/lib/gsap";
import { MUNDOS } from "@/lib/mundos";
import type { MundoPortada } from "@/lib/tipos";

/**
 * Índice de los cuatro mundos.
 *
 * Con mouse: filas tipográficas gigantes y una ventana flotante que sigue al
 * cursor y muestra la foto del mundo que se está señalando; al pasar de una
 * fila a otra la foto nueva se descubre como un telón.
 * En el celular: cada fila lleva su foto, que se descubre al llegar a ella.
 */
export default function Mundos({ mundos }: { mundos: MundoPortada[] }) {
  const raiz = useRef<HTMLElement>(null);
  const ventana = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState<number | null>(null);

  useGSAP(
    () => {
      const v = ventana.current;
      if (!v || !punteroFino() || sinMovimiento()) return;
      gsap.set(v, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });
      const x = gsap.quickTo(v, "x", { duration: 0.9, ease: "power3" });
      const y = gsap.quickTo(v, "y", { duration: 0.9, ease: "power3" });
      const rot = gsap.quickTo(v, "rotate", { duration: 1.2, ease: "power3" });
      let previoX = 0;
      const mover = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        // Se inclina hacia donde va, como una carta que se arrastra.
        rot(gsap.utils.clamp(-12, 12, (e.clientX - previoX) * 0.6));
        previoX = e.clientX;
      };
      window.addEventListener("pointermove", mover, { passive: true });
      return () => window.removeEventListener("pointermove", mover);
    },
    { scope: raiz }
  );

  useGSAP(
    () => {
      const v = ventana.current;
      if (!v || !punteroFino() || sinMovimiento()) return;
      gsap.to(v, { scale: activo === null ? 0.6 : 1, opacity: activo === null ? 0 : 1, duration: 0.7, ease: "casa" });
      if (activo === null) return;
      const capas = v.querySelectorAll<HTMLElement>("[data-capa]");
      capas.forEach((c, i) => {
        if (i === activo) {
          gsap.set(c, { zIndex: 2 });
          gsap.fromTo(c, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "telon" });
          gsap.fromTo(c.querySelector("img"), { scale: 1.4 }, { scale: 1, duration: 1.2 });
        } else gsap.set(c, { zIndex: 1 });
      });
    },
    { dependencies: [activo], scope: raiz }
  );

  return (
    <section ref={raiz} className="relative py-24 md:py-36" aria-labelledby="mundos-titulo" onPointerLeave={() => setActivo(null)}>
      <div className="contenedor mb-14 flex items-end justify-between gap-6 md:mb-20">
        <h2 id="mundos-titulo" data-titular className="display text-[clamp(2.75rem,6vw,6rem)]">
          Cuatro mundos,
          <br />
          <em className="text-ceniza">un mismo lugar</em>
        </h2>
        <p data-aparecer className="kicker hidden text-right leading-[1.8] text-ceniza md:block">
          Elegí por dónde
          <br />
          empezar
        </p>
      </div>

      <ul className="border-t border-linea">
        {mundos.map((m, i) => {
          const datos = MUNDOS[m.clave];
          return (
            <li key={m.clave} className="border-b border-linea" style={{ "--tono": datos.tono } as React.CSSProperties}>
              <Link
                href={datos.href}
                data-cursor="Entrar"
                onPointerEnter={() => setActivo(i)}
                onFocus={() => setActivo(i)}
                className="group contenedor relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-7 md:grid-cols-12 md:gap-x-6 md:py-10"
              >
                {/* Foto propia de cada fila en pantallas táctiles. */}
                {m.foto && (
                  <div data-revelar className="relative col-span-3 mb-6 aspect-[16/10] overflow-hidden rounded-sm [@media(pointer:fine)]:hidden">
                    <Foto foto={m.foto} fill sizes="100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noche/70 to-transparent" />
                  </div>
                )}

                <span className="kicker self-start pt-3 text-ceniza transition-colors duration-500 group-hover:text-[var(--tono)] md:col-span-1 md:pt-5">
                  {datos.numero}
                </span>

                <span className="md:col-span-6">
                  <span className="display block text-[clamp(3.25rem,10vw,9.5rem)] transition-[translate,color,font-style] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-[2vw] group-hover:italic group-hover:text-[var(--tono)]">
                    {datos.nombre}
                  </span>
                  <span className="kicker mt-3 block text-humo md:hidden">{datos.lema}</span>
                </span>

                <span className="hidden md:col-span-4 md:block">
                  <span className="kicker block text-ceniza">{datos.lema}</span>
                  <span className="mt-3 block max-w-xs text-sm leading-relaxed text-humo transition-colors duration-500 group-hover:text-ceniza">
                    {m.frase}
                  </span>
                </span>

                <span className="grid size-12 place-items-center justify-self-end rounded-full border border-linea transition-all duration-500 group-hover:rotate-45 group-hover:border-[var(--tono)] group-hover:bg-[var(--tono)] group-hover:text-noche md:col-span-1 md:size-14">
                  <FlechaDiagonal className="size-5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Ventana flotante que sigue al cursor (sólo con mouse). */}
      <div
        ref={ventana}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/5] w-[min(24vw,22rem)] overflow-hidden rounded-sm opacity-0 shadow-2xl [@media(pointer:fine)]:block"
      >
        {mundos.map((m) =>
          m.foto ? (
            <div key={m.clave} data-capa className="absolute inset-0 overflow-hidden">
              <Foto foto={m.foto} fill sizes="24vw" className="object-cover" />
            </div>
          ) : (
            <div key={m.clave} data-capa className="absolute inset-0 bg-noche-3" />
          )
        )}
      </div>
    </section>
  );
}
