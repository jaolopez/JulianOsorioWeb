import type { Metadata } from "next";
import Link from "next/link";
import Escena from "@/components/movimiento/Escena";
import Foto from "@/components/ui/Foto";
import { Correo, FlechaDiagonal, WhatsApp } from "@/components/ui/Iconos";
import Redes from "@/components/ui/Redes";
import TextoRico from "@/components/ui/TextoRico";
import { MUNDOS, ORDEN_MUNDOS } from "@/lib/mundos";
import { getAcerca, getAjustes } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Acerca de mí",
  description: "Julián Osorio: músico y compositor. Música, escritura, fotografía y gastronomía.",
};

export default async function AcercaPagina() {
  const [acerca, ajustes] = await Promise.all([getAcerca(), getAjustes()]);

  return (
    <main>
      <section className="contenedor grid gap-14 pt-[calc(var(--barra)+3rem)] pb-20 md:grid-cols-12 md:gap-10 md:pt-[calc(var(--barra)+6rem)] md:pb-32">
        <div className="md:col-span-5">
          {acerca.retrato && (
            <div data-revelar className="relative aspect-[4/5] overflow-hidden rounded-sm md:sticky md:top-[calc(var(--barra)+3rem)]">
              <Foto foto={acerca.retrato} fill priority sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgb(255_90_31/0.25),transparent_60%)] mix-blend-screen" />
            </div>
          )}
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <p data-aparecer className="kicker flex items-center gap-3 text-ceniza">
            <span className="block h-px w-8 bg-brasa" />
            06 · Acerca de mí
          </p>
          <h1 className="display mt-8 text-[clamp(3.75rem,9vw,9rem)]">
            <span data-letras="ya" className="block">
              Julián
            </span>
            <span data-letras="ya" data-retraso="0.2" className="block italic text-brasa">
              Osorio
            </span>
          </h1>
          <p data-titular className="mt-10 font-display text-[clamp(1.75rem,3vw,2.75rem)] italic leading-tight text-hueso/90">
            {acerca.intro}
          </p>
          <TextoRico value={acerca.bio} className="mt-10" />

          <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-linea bg-linea">
            {ORDEN_MUNDOS.map((c) => (
              <li key={c} className="bg-noche">
                <Link href={MUNDOS[c].href} className="group flex h-full flex-col justify-between gap-6 p-5 transition-colors hover:bg-noche-2">
                  <span className="kicker text-humo">{MUNDOS[c].numero}</span>
                  <span className="flex items-end justify-between gap-2">
                    <span className="display text-3xl transition-colors group-hover:italic" style={{ color: MUNDOS[c].tono }}>
                      {MUNDOS[c].nombre}
                    </span>
                    <FlechaDiagonal className="size-4 text-ceniza" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {acerca.hitos.length > 0 && (
            <div className="mt-20">
              <p className="kicker text-ceniza">Momentos</p>
              <ol className="mt-6 border-t border-linea">
                {acerca.hitos.map((h, i) => (
                  <li key={i} data-aparecer className="grid grid-cols-[5rem_1fr] items-baseline gap-4 border-b border-linea py-5">
                    <span className="display text-3xl text-brasa">{h.anio}</span>
                    <span className="text-hueso/85">{h.texto}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-20 flex flex-col gap-6">
            <p className="kicker text-ceniza">Contacto</p>
            <div className="flex flex-wrap gap-3">
              {ajustes.correo && (
                <a href={`mailto:${ajustes.correo}`} className="flex items-center gap-3 rounded-full bg-hueso px-6 py-3.5 text-noche transition-colors hover:bg-brasa">
                  <Correo className="size-5" />
                  {ajustes.correo}
                </a>
              )}
              {ajustes.whatsapp && (
                <a href={`https://wa.me/${ajustes.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full border border-linea px-6 py-3.5 hover:border-hueso">
                  <WhatsApp className="size-5" />
                  WhatsApp
                </a>
              )}
            </div>
            <Redes redes={ajustes.redes} conNombre />
          </div>
        </div>
      </section>
      <Escena />
    </main>
  );
}
