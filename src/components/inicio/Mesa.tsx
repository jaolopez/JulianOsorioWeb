import Link from "next/link";
import Foto from "@/components/ui/Foto";
import { Flecha } from "@/components/ui/Iconos";
import type { Experiencia } from "@/lib/tipos";
import Marquesina from "@/components/movimiento/Marquesina";

/** Gastronomía: la mesa compartida, con el hashtag corriendo de lado a lado. */
export default function Mesa({ experiencia, frase }: { experiencia: Experiencia; frase: string }) {
  return (
    <section className="relative py-24 md:py-40" aria-labelledby="mesa-titulo" style={{ "--tono": "var(--color-ambar)" } as React.CSSProperties}>
      <Marquesina className="mb-16 text-ambar md:mb-24" velocidad={40}>
        <span className="display texto-hueco px-[0.25em] text-[clamp(4rem,12vw,12rem)] italic">#experienciasoneto</span>
        <span className="display px-[0.25em] text-[clamp(4rem,12vw,12rem)]">·</span>
      </Marquesina>

      <div className="contenedor grid items-center gap-12 md:grid-cols-12">
        {experiencia.portada && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm md:col-span-6 md:aspect-[5/6]">
            <div data-parallax="0.12" className="absolute -inset-y-[12%] inset-x-0">
              <Foto foto={experiencia.portada} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        )}
        <div className="md:col-span-5 md:col-start-8">
          <p data-aparecer className="kicker flex items-center gap-3 text-ceniza">
            <span className="block h-px w-8 bg-ambar" />
            04 · Gastronomía
          </p>
          <h2 id="mesa-titulo" data-titular className="display mt-6 text-[clamp(3rem,6vw,6.5rem)]">
            Legado
            <br />
            <em className="text-ambar">artesanal</em>
          </h2>
          <p data-aparecer className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ceniza">
            {frase}
          </p>
          <Link data-aparecer href="/gastronomia" className="group mt-10 inline-flex items-center gap-3">
            <span className="enlace-linea">Sentarse a la mesa</span>
            <Flecha className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
