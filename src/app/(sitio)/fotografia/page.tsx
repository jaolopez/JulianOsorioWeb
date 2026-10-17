import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import Escena from "@/components/movimiento/Escena";
import Encabezado from "@/components/ui/Encabezado";
import Foto from "@/components/ui/Foto";
import { fechaCorta } from "@/lib/fechas";
import { MUNDOS } from "@/lib/mundos";
import { getGalerias, getPortada } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Fotografía",
  description: "Galerías de Julián Osorio. Una imagen que compromete la visual, un momento que se queda en la memoria.",
};

export default async function FotografiaPagina() {
  const [galerias, portada] = await Promise.all([getGalerias(), getPortada()]);
  const m = MUNDOS.fotografia;
  const frase = portada.mundos.find((x) => x.clave === "fotografia")?.frase;

  return (
    <main style={{ "--tono": m.tono } as React.CSSProperties}>
      <Encabezado rotulo={`${m.numero} · ${m.lema}`} titulo="Fotografía" cursiva="la luz detenida" bajada={frase} tono={m.tono} />

      <div className="contenedor grid gap-x-8 gap-y-20 pb-28 md:grid-cols-12 md:pb-40">
        {galerias.map((g, i) => {
          // Ritmo editorial: una grande, dos medianas desfasadas.
          const forma = ["md:col-span-8", "md:col-span-4 md:mt-[30vh]", "md:col-span-5 md:col-start-2", "md:col-span-5 md:col-start-8 md:mt-[16vh]"][i % 4];
          return (
            <Link key={g.slug} href={`/fotografia/${g.slug}`} data-cursor="Ver" className={`group block ${forma}`}>
              <div data-revelar className="relative aspect-[4/5] overflow-hidden rounded-sm bg-noche-3 md:aspect-auto md:h-[min(80vh,52rem)]">
                <ViewTransition name={`galeria-${g.slug}`} share="foto-viaje" default="none">
                  <Foto foto={g.portada} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105" />
                </ViewTransition>
                <span className="kicker absolute left-4 top-4 rounded-full bg-noche/60 px-3 py-2 text-hueso backdrop-blur-md">
                  {g.fotos.length} fotos
                </span>
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-6">
                <h2 className="display text-[clamp(2.25rem,4vw,4rem)] transition-colors group-hover:italic group-hover:text-plata">{g.titulo}</h2>
                <span className="kicker shrink-0 text-humo">{g.lugar ?? fechaCorta(g.fecha)}</span>
              </div>
              {g.descripcion && <p className="mt-3 max-w-md text-ceniza">{g.descripcion}</p>}
            </Link>
          );
        })}
      </div>
      <Escena />
    </main>
  );
}
