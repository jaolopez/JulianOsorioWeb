"use client";

import { startTransition, useEffect, useRef, useState, ViewTransition } from "react";
import Foto from "@/components/ui/Foto";
import { fechaCorta } from "@/lib/fechas";
import { gsap, ScrollTrigger, sinMovimiento } from "@/lib/gsap";
import type { Texto } from "@/lib/tipos";
import Poema from "./Poema";

const NOMBRES = { poema: "Poemas", prosa: "Prosa", relato: "Relatos" } as const;
const SINGULAR = { poema: "Poema", prosa: "Prosa", relato: "Relato" } as const;

/**
 * Todos los textos en una página. Cada título se abre ahí mismo y el texto
 * completo se despliega debajo, renglón por renglón; no hay que ir a otra
 * página para leer. Un enlace a /escritura#titulo llega con ese texto abierto.
 *
 * Los filtros cambian la lista dentro de una transición: los que salen se
 * disuelven y los que quedan se reacomodan solos (View Transitions de React).
 */
export default function IndiceTextos({ textos }: { textos: Texto[] }) {
  const [filtro, setFiltro] = useState<Texto["tipo"] | "todos">("todos");
  const [abierto, setAbierto] = useState<string | null>(null);
  const tipos = (Object.keys(NOMBRES) as Texto["tipo"][]).filter((t) => textos.some((x) => x.tipo === t));
  const visibles = filtro === "todos" ? textos : textos.filter((t) => t.tipo === filtro);

  // Llegar con #titulo abre ese texto y lo trae a la vista.
  useEffect(() => {
    const desdeEnlace = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      if (!textos.some((t) => t.slug === slug)) return;
      setAbierto(slug);
      requestAnimationFrame(() => {
        const el = document.getElementById(slug);
        if (!el) return;
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        else el.scrollIntoView();
      });
    };
    desdeEnlace();
    window.addEventListener("hashchange", desdeEnlace);
    return () => window.removeEventListener("hashchange", desdeEnlace);
  }, [textos]);

  const alternar = (slug: string) => {
    const nuevo = abierto === slug ? null : slug;
    setAbierto(nuevo);
    // La dirección queda lista para compartir, sin saltar de lugar.
    history.replaceState(null, "", nuevo ? `#${nuevo}` : window.location.pathname);
  };

  return (
    <div>
      {tipos.length > 1 && (
        <div className="contenedor mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por tipo">
          {(["todos", ...tipos] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={filtro === t}
              onClick={() => startTransition(() => setFiltro(t))}
              className={`kicker rounded-full border px-4 py-2.5 transition-colors ${
                filtro === t ? "border-tinta bg-tinta text-noche" : "border-linea text-ceniza hover:border-hueso hover:text-hueso"
              }`}
            >
              {t === "todos" ? "Todos" : NOMBRES[t]}
            </button>
          ))}
        </div>
      )}

      <ul className="border-t border-linea">
        {visibles.map((t, i) => (
          <ViewTransition key={t.slug}>
            <li id={t.slug} className="scroll-mt-[var(--barra)] border-b border-linea">
              <button
                type="button"
                onClick={() => alternar(t.slug)}
                aria-expanded={abierto === t.slug}
                aria-controls={`texto-${t.slug}`}
                data-cursor={abierto === t.slug ? "Cerrar" : "Leer"}
                className="group contenedor grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-8 text-left md:grid-cols-12 md:py-12"
              >
                <span className="kicker col-span-2 flex gap-4 text-humo md:col-span-2">
                  <span className="text-tinta">{String(i + 1).padStart(2, "0")}</span>
                  {SINGULAR[t.tipo]}
                </span>
                <span className="md:col-span-6">
                  <span
                    className={`display block text-[clamp(2.5rem,5.5vw,5.5rem)] transition-[translate,color] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:italic group-hover:text-tinta ${
                      abierto === t.slug ? "italic text-tinta" : ""
                    }`}
                  >
                    {t.titulo}
                  </span>
                  <span className="mt-3 block font-display text-xl italic text-ceniza">«{t.extracto}»</span>
                </span>
                <time dateTime={t.fecha} className="kicker hidden text-humo md:col-span-2 md:block md:text-right">
                  {fechaCorta(t.fecha)}
                </time>
                <span className="relative grid size-12 place-items-center justify-self-end rounded-full border border-linea text-hueso transition-colors duration-500 group-hover:border-tinta md:col-span-2 md:size-14">
                  <span className="absolute h-px w-4 bg-current" />
                  <span className={`absolute h-4 w-px bg-current transition-transform duration-500 ease-[var(--ease-expo)] ${abierto === t.slug ? "scale-y-0" : ""}`} />
                </span>
              </button>
              <Lectura texto={t} abierto={abierto === t.slug} />
            </li>
          </ViewTransition>
        ))}
      </ul>
    </div>
  );
}

/**
 * El texto completo, que se despliega y se recoge. Está siempre en la página
 * (para Google y para el «buscar» del navegador); cerrado sólo se oculta.
 */
function Lectura({ texto, abierto }: { texto: Texto; abierto: boolean }) {
  const caja = useRef<HTMLDivElement>(null);
  const primera = useRef(true);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    // Al cargar no se anima nada: sólo se deja en su estado.
    if (primera.current) {
      primera.current = false;
      gsap.set(el, { height: abierto ? "auto" : 0 });
      return;
    }
    const listo = () => ScrollTrigger.refresh();
    if (sinMovimiento()) {
      gsap.set(el, { height: abierto ? "auto" : 0 });
      return listo();
    }
    if (abierto) {
      gsap.fromTo(el, { height: 0 }, { height: "auto", duration: 1, ease: "casa", onComplete: listo });
      gsap.fromTo(
        el.querySelectorAll("[data-renglon]"),
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.06, delay: 0.1 }
      );
    } else {
      gsap.to(el, { height: 0, duration: 0.7, ease: "telon", onComplete: listo });
    }
  }, [abierto]);

  return (
    <div ref={caja} id={`texto-${texto.slug}`} inert={!abierto} className="h-0 overflow-hidden">
      <div className="contenedor grid gap-12 pb-20 pt-4 md:grid-cols-12 md:pb-28">
        {texto.imagen && (
          <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-sm md:col-span-3 md:col-start-1 md:w-full">
            <Foto foto={texto.imagen} fill sizes="(min-width: 768px) 22vw, 160px" className="object-cover grayscale" />
            <div className="absolute inset-0 bg-tinta/15" />
          </div>
        )}
        <div className={texto.imagen ? "md:col-span-7 md:col-start-5" : "md:col-span-8 md:col-start-3"}>
          <Poema cuerpo={texto.cuerpo} prosa={texto.tipo !== "poema"} animado={false} renglones />
          <p className="mt-14 font-display text-2xl italic text-tinta">— Julián Osorio</p>
        </div>
      </div>
    </div>
  );
}
