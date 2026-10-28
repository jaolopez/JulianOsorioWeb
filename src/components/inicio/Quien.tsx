import Foto from "@/components/ui/Foto";
import Redes from "@/components/ui/Redes";
import TextoRico from "@/components/ui/TextoRico";
import type { Acerca, Ajustes } from "@/lib/tipos";

/**
 * Quién es Julián: retrato, la frase que lo resume, la biografía y los
 * momentos. Antes era una página aparte; ahora vive en el inicio, que es
 * su casa.
 */
export default function Quien({ acerca, ajustes }: { acerca: Acerca; ajustes: Ajustes }) {
  return (
    <section id="acerca" className="relative scroll-mt-[var(--barra)] py-24 md:py-40" aria-labelledby="acerca-titulo">
      <div className="contenedor grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p data-aparecer className="kicker mb-8 flex items-center gap-3 text-ceniza">
            <span className="block h-px w-8 bg-brasa" />
            Sobre Julián
          </p>
          {acerca.retrato && (
            <div data-revelar className="relative aspect-[4/5] overflow-hidden rounded-sm md:sticky md:top-[calc(var(--barra)+3rem)]">
              <Foto foto={acerca.retrato} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgb(255_90_31/0.22),transparent_60%)]" />
            </div>
          )}
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-16">
          <h2 id="acerca-titulo" data-titular className="display text-balance text-[clamp(2.75rem,5.5vw,5.5rem)] italic text-hueso">
            {acerca.intro}
          </h2>
          <TextoRico value={acerca.bio} className="mt-10" />

          {acerca.hitos.length > 0 && (
            <ol className="mt-14 border-t border-linea">
              {acerca.hitos.map((h, i) => (
                <li key={i} data-aparecer className="grid grid-cols-[5rem_1fr] items-baseline gap-4 border-b border-linea py-5">
                  <span className="display text-3xl text-brasa">{h.anio}</span>
                  <span className="text-hueso/85">{h.texto}</span>
                </li>
              ))}
            </ol>
          )}

          {Object.keys(ajustes.redes).length > 0 && (
            <div data-aparecer className="mt-12">
              <Redes redes={ajustes.redes} conNombre />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
