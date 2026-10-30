import type { Metadata } from "next";
import Visor from "@/components/fotografia/Visor";
import Escena from "@/components/movimiento/Escena";
import Encabezado from "@/components/ui/Encabezado";
import Foto from "@/components/ui/Foto";
import { fechaLarga } from "@/lib/fechas";
import { MUNDOS } from "@/lib/mundos";
import { getGalerias, getPortada } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Fotografía",
  description: "Galerías de Julián Osorio. Una imagen que compromete la visual, un momento que se queda en la memoria.",
};

/**
 * Todas las galerías en una página: cada una abre con su foto de portada a
 * lo ancho y sigue con el mosaico, que se amplía al tocar. El índice de
 * arriba lleva directo a cada una.
 */
export default async function FotografiaPagina() {
  const [galerias, portada] = await Promise.all([getGalerias(), getPortada()]);
  const m = MUNDOS.fotografia;
  const frase = portada.mundos.find((x) => x.clave === "fotografia")?.frase;

  return (
    <main style={{ "--tono": m.tono } as React.CSSProperties}>
      <Encabezado rotulo={`${m.numero} · ${m.lema}`} titulo="Fotografía" cursiva="la luz detenida" bajada={frase} tono={m.tono}>
        {galerias.length > 1 && (
          <nav aria-label="Galerías" className="md:col-span-12">
            <ul data-aparecer className="flex flex-wrap gap-2">
              {galerias.map((g) => (
                <li key={g.slug}>
                  <a
                    href={`#${g.slug}`}
                    className="kicker flex items-center gap-2 rounded-full border border-linea px-4 py-2.5 text-ceniza transition-colors hover:border-plata hover:text-hueso"
                  >
                    {g.titulo}
                    <span className="text-humo">{g.fotos.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Encabezado>

      {galerias.length === 0 && (
        <p data-aparecer className="contenedor display pb-32 text-4xl italic text-ceniza">
          Las primeras galerías están por llegar.
        </p>
      )}
      {galerias.map((g, i) => (
        <section key={g.slug} id={g.slug} className="scroll-mt-[var(--barra)] pb-24 md:pb-36" aria-labelledby={`galeria-${g.slug}`}>
          <div className="relative h-[70svh] min-h-[26rem] overflow-hidden">
            <div data-parallax="0.12" className="absolute -inset-y-[12%] inset-x-0">
              <Foto foto={g.portada} fill priority={i === 0} sizes="100vw" quality={90} className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-noche via-noche/20 to-noche/30" />
            <div className="contenedor absolute inset-x-0 bottom-0 pb-10 md:pb-14">
              <p className="kicker text-plata">{String(i + 1).padStart(2, "0")} · Galería</p>
              <h2 id={`galeria-${g.slug}`} data-letras className="display mt-5 text-[clamp(3.25rem,10vw,10rem)]">
                {g.titulo}
              </h2>
              <p className="kicker mt-5 text-ceniza">{[g.lugar, fechaLarga(g.fecha), `${g.fotos.length} fotos`].filter(Boolean).join(" · ")}</p>
            </div>
          </div>

          <div className="contenedor pt-12 md:pt-16">
            {g.descripcion && (
              <p data-aparecer className="mb-12 max-w-2xl font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight text-hueso/90 md:mb-16">
                {g.descripcion}
              </p>
            )}
            <Visor fotos={g.fotos} titulo={g.titulo} />
          </div>
        </section>
      ))}
      <Escena />
    </main>
  );
}
