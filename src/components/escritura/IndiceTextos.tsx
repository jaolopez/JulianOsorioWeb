"use client";

import Link from "next/link";
import { startTransition, useState, ViewTransition } from "react";
import Foto from "@/components/ui/Foto";
import { fechaCorta } from "@/lib/fechas";
import type { Texto } from "@/lib/tipos";

const NOMBRES = { poema: "Poemas", prosa: "Prosa", relato: "Relatos" } as const;
const SINGULAR = { poema: "Poema", prosa: "Prosa", relato: "Relato" } as const;

/**
 * Índice de textos. Los filtros cambian la lista dentro de una transición:
 * los que salen se disuelven, los que quedan se reacomodan solos (View
 * Transitions de React) sin una sola línea de animación a mano.
 */
export default function IndiceTextos({ textos }: { textos: Texto[] }) {
  const [filtro, setFiltro] = useState<Texto["tipo"] | "todos">("todos");
  const tipos = (Object.keys(NOMBRES) as Texto["tipo"][]).filter((t) => textos.some((x) => x.tipo === t));
  const visibles = filtro === "todos" ? textos : textos.filter((t) => t.tipo === filtro);

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
            <li className="border-b border-linea">
              <Link
                href={`/escritura/${t.slug}`}
                data-cursor="Leer"
                className="group contenedor grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-8 md:grid-cols-12 md:py-12"
              >
                <span className="kicker col-span-2 flex gap-4 text-humo md:col-span-2">
                  <span className="text-tinta">{String(i + 1).padStart(2, "0")}</span>
                  {SINGULAR[t.tipo]}
                </span>
                <span className="md:col-span-6">
                  <span className="display block text-[clamp(2.5rem,5.5vw,5.5rem)] transition-[translate,color] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:italic group-hover:text-tinta">
                    {t.titulo}
                  </span>
                  <span className="mt-3 block font-display text-xl italic text-ceniza">«{t.extracto}»</span>
                </span>
                <time dateTime={t.fecha} className="kicker hidden text-humo md:col-span-2 md:block md:text-right">
                  {fechaCorta(t.fecha)}
                </time>
                <span className="relative aspect-[3/4] w-20 overflow-hidden rounded-sm md:col-span-2 md:w-full md:[clip-path:inset(0_0_100%_0)] md:transition-[clip-path] md:duration-700 md:ease-[var(--ease-expo)] md:group-hover:[clip-path:inset(0_0_0%_0)]">
                  {t.imagen && <Foto foto={t.imagen} fill sizes="(min-width: 768px) 15vw, 80px" className="object-cover grayscale transition-transform duration-1000 group-hover:scale-110" />}
                </span>
              </Link>
            </li>
          </ViewTransition>
        ))}
      </ul>
    </div>
  );
}
