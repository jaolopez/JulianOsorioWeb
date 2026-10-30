import type { Metadata } from "next";
import Visor from "@/components/fotografia/Visor";
import Escena from "@/components/movimiento/Escena";
import Marquesina from "@/components/movimiento/Marquesina";
import Encabezado from "@/components/ui/Encabezado";
import Foto from "@/components/ui/Foto";
import { fechaLarga } from "@/lib/fechas";
import { MUNDOS } from "@/lib/mundos";
import type { Experiencia } from "@/lib/tipos";
import { getExperiencias, getPortada } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Gastronomía",
  description: "#experienciasoneto: espacios para compartir entre amigos, algunos tragos y buena música.",
};

/** Las fotos de la experiencia sin repetir la de portada. */
const resto = (e: Experiencia) => e.fotos.filter((f) => f.src !== e.portada?.src);

export default async function GastronomiaPagina() {
  const [experiencias, portada] = await Promise.all([getExperiencias(), getPortada()]);
  const m = MUNDOS.gastronomia;
  const frase = portada.mundos.find((x) => x.clave === "gastronomia")?.frase;

  return (
    <main style={{ "--tono": m.tono } as React.CSSProperties}>
      <Encabezado rotulo={`${m.numero} · ${m.lema}`} titulo="Gastronomía" cursiva="la mesa compartida" bajada={frase} tono={m.tono} />

      <Marquesina className="border-y border-linea py-6 text-ambar" velocidad={35}>
        <span className="display texto-hueco px-[0.3em] text-[clamp(3rem,8vw,8rem)] italic">#experienciasoneto</span>
        <span className="display px-[0.3em] text-[clamp(3rem,8vw,8rem)]">✺</span>
      </Marquesina>

      {experiencias.length === 0 && (
        <p data-aparecer className="contenedor display py-24 text-4xl italic text-ceniza">
          La próxima mesa está por servirse.
        </p>
      )}
      {experiencias.map((e, i) => (
        <article key={e.slug} id={e.slug} className="contenedor grid gap-12 py-20 md:grid-cols-12 md:py-32">
          {e.portada && (
            <div className={`relative aspect-[4/5] overflow-hidden rounded-sm md:col-span-6 ${i % 2 ? "md:order-2 md:col-start-7" : ""}`}>
              <div data-parallax="0.1" className="absolute -inset-y-[10%] inset-x-0">
                <Foto foto={e.portada} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>
          )}
          <div className={`flex flex-col justify-center md:col-span-5 ${i % 2 ? "md:col-start-1" : "md:col-start-8"}`}>
            <p data-aparecer className="kicker text-ambar">
              {[e.lugar, fechaLarga(e.fecha)].filter(Boolean).join(" · ")}
            </p>
            <h2 data-titular className="display mt-6 text-[clamp(2.75rem,5vw,5rem)]">
              {e.titulo}
            </h2>
            {e.descripcion && (
              <p data-aparecer className="mt-6 text-[1.0625rem] leading-relaxed text-ceniza">
                {e.descripcion}
              </p>
            )}
            {e.menu.length > 0 && (
              <ul data-aparecer className="mt-10 border-t border-linea">
                {e.menu.map((plato, k) => (
                  <li key={k} className="flex items-baseline gap-4 border-b border-linea py-4">
                    <span className="kicker text-ambar">{String(k + 1).padStart(2, "0")}</span>
                    <span className="font-display text-2xl">{plato}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {resto(e).length > 0 && (
            <div className="md:col-span-12">
              <Visor fotos={resto(e)} titulo={e.titulo} />
            </div>
          )}
        </article>
      ))}
      <Escena />
    </main>
  );
}
