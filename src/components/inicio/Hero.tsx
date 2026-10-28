"use client";

import Link from "next/link";
import { useRef } from "react";
import { useReproductor, type Pista } from "@/components/audio/Reproductor";
import Ondas from "@/components/audio/Ondas";
import Magnetico from "@/components/movimiento/Magnetico";
import Foto from "@/components/ui/Foto";
import { FlechaDiagonal, Pausa, Play } from "@/components/ui/Iconos";
import { gsap, ScrollTrigger, sinMovimiento, SplitText, trasPrecarga, useGSAP } from "@/lib/gsap";
import { MUNDOS } from "@/lib/mundos";
import type { MundoPortada } from "@/lib/tipos";
import Humo from "./Humo";

/**
 * Primera pantalla: el nombre de Julián sobre el humo de escenario y, debajo,
 * las cuatro puertas a sus mundos. Todo cabe en la pantalla —también en el
 * celular— para que nadie tenga que buscar dónde está la música o la
 * escritura: están ahí desde el primer segundo.
 */
export default function Hero({
  titular,
  bajada,
  ciudad,
  mundos,
  pistas,
  disco,
}: {
  titular: string;
  bajada: string;
  ciudad?: string;
  mundos: MundoPortada[];
  pistas: Pista[];
  disco?: string;
}) {
  const raiz = useRef<HTMLElement>(null);
  const { reproducir, alternar, sonando, actual } = useReproductor();
  const delDisco = Boolean(actual && pistas.some((p) => p.audio === actual.audio));

  useGSAP(
    () => {
      if (sinMovimiento()) return;
      const el = raiz.current!;
      const partes = SplitText.create(el.querySelectorAll("[data-hero-linea]"), { type: "chars", mask: "chars" });
      const puertas = el.querySelectorAll<HTMLElement>("[data-puerta]");
      gsap.set(partes.chars, { yPercent: 110 });
      gsap.set("[data-hero-sube]", { opacity: 0, y: 24 });
      gsap.set(puertas, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(el.querySelectorAll("[data-puerta-foto]"), { scale: 1.35 });

      let vigente = true;
      void trasPrecarga().then(() => {
        if (!vigente) return;
        gsap
          .timeline()
          .to(partes.chars, { yPercent: 0, duration: 1.5, stagger: 0.04 })
          .to("[data-hero-sube]", { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.4)
          // Las puertas se abren de abajo hacia arriba, una tras otra.
          .to(puertas, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "telon", stagger: 0.09 }, 0.35)
          .to("[data-puerta-foto]", { scale: 1, duration: 1.8, stagger: 0.09 }, 0.35)
          // Después las deja libres para que el hover de CSS mande.
          .set("[data-puerta-foto]", { clearProps: "transform" })
          .set(puertas, { clearProps: "clipPath" });
      });

      // Al bajar, el nombre se aleja y el humo se apaga hacia la siguiente sección.
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-titular]", { yPercent: -30, opacity: 0.25, ease: "none", scrollTrigger: st });
      gsap.to("[data-hero-fondo]", { opacity: 0.3, ease: "none", scrollTrigger: st });
      return () => {
        vigente = false;
        ScrollTrigger.refresh();
      };
    },
    { scope: raiz }
  );

  const escuchar = () => (delDisco ? alternar() : reproducir(pistas, 0));

  return (
    <section ref={raiz} className="relative isolate flex min-h-svh flex-col overflow-hidden lg:h-svh lg:min-h-[44rem]" aria-label="Portada">
      <div data-hero-fondo className="absolute inset-0 -z-10">
        <Humo />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-noche via-noche/70 to-transparent" />
      </div>

      <div className="contenedor flex items-start justify-between pt-[calc(var(--barra)+1rem)] text-ceniza md:pt-[calc(var(--barra)+1.5rem)]">
        <p data-hero-sube className="kicker">
          {titular}
        </p>
        <p data-hero-sube className="kicker hidden text-right sm:block">
          {ciudad}
        </p>
      </div>

      <div className="contenedor mt-5 flex flex-col gap-8 md:mt-auto lg:flex-row lg:items-end lg:justify-between">
        <h1 data-hero-titular className="display text-[clamp(4rem,17.5vw,10rem)] text-hueso lg:text-[clamp(6rem,11.5vw,13.5rem)]">
          <span data-hero-linea className="block">
            Julián
          </span>
          <span data-hero-linea className="block pl-[9vw] italic text-brasa lg:pl-[7vw]">
            Osorio
          </span>
        </h1>

        <div className="hidden max-w-sm flex-col items-start gap-6 pb-3 lg:flex">
          <p data-hero-sube className="text-balance text-[0.9375rem] leading-relaxed text-ceniza">
            {bajada}
          </p>
          {pistas.length > 0 && (
            <div data-hero-sube>
              <BotonEscuchar onClick={escuchar} sonando={delDisco && sonando} activo={delDisco} disco={disco} />
            </div>
          )}
        </div>
      </div>

      {/* Las cuatro puertas. */}
      <nav aria-label="Los cuatro mundos" className="contenedor mt-7 md:mt-10">
        <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {mundos.map((m) => {
            const d = MUNDOS[m.clave];
            return (
              <li key={m.clave} style={{ "--tono": d.tono } as React.CSSProperties}>
                <Link
                  href={d.href}
                  data-puerta
                  data-cursor="Entrar"
                  className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-sm border border-linea bg-noche-2 p-3.5 [@media(max-height:760px)]:aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[min(30svh,19rem)] lg:p-5"
                >
                  {m.foto && (
                    <div data-puerta-foto className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.06]">
                      <Foto
                        foto={m.foto}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover opacity-55 grayscale transition-[opacity,filter] duration-700 group-hover:opacity-90 group-hover:grayscale-0 [@media(pointer:coarse)]:opacity-60 [@media(pointer:coarse)]:grayscale-0"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-noche via-noche/40 to-noche/10" />
                  {/* Raya de luz del tono del mundo: crece al pasar el mouse. */}
                  <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-[0.18] bg-[var(--tono)] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />

                  <span className="relative flex items-start justify-between">
                    <span className="kicker text-[var(--tono)]">{d.numero}</span>
                    <span className="grid size-8 place-items-center rounded-full border border-hueso/25 text-hueso transition-[rotate,background-color,border-color,color] duration-500 group-hover:rotate-45 group-hover:border-[var(--tono)] group-hover:bg-[var(--tono)] group-hover:text-noche lg:size-10">
                      <FlechaDiagonal className="size-3.5 lg:size-4" />
                    </span>
                  </span>

                  <span className="relative">
                    <span className="display block text-[clamp(1.75rem,7.6vw,2.6rem)] text-hueso transition-colors duration-500 group-hover:italic group-hover:text-[var(--tono)] lg:text-[clamp(2rem,2.9vw,3.4rem)]">
                      {d.nombre}
                    </span>
                    <span className="kicker mt-2 block text-[0.5625rem] text-ceniza lg:mt-3 lg:text-[0.625rem]">{d.lema}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* En el celular la presentación y el botón van debajo de las puertas. */}
      <div className="contenedor mt-8 flex flex-col gap-6 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] lg:hidden">
        <p data-hero-sube className="max-w-sm text-balance text-[0.9375rem] leading-relaxed text-ceniza">
          {bajada}
        </p>
        {pistas.length > 0 && (
          <div data-hero-sube>
            <BotonEscuchar onClick={escuchar} sonando={delDisco && sonando} activo={delDisco} disco={disco} />
          </div>
        )}
      </div>
      <div className="hidden h-[var(--gutter)] shrink-0 lg:block" />
    </section>
  );
}

function BotonEscuchar({ onClick, sonando, activo, disco }: { onClick: () => void; sonando: boolean; activo: boolean; disco?: string }) {
  return (
    <Magnetico fuerza={0.25}>
      <button
        type="button"
        onClick={onClick}
        data-cursor={sonando ? "Pausa" : "Play"}
        className="group flex items-center gap-4 rounded-full border border-linea bg-noche/70 py-2 pl-2 pr-6 transition-colors hover:border-brasa"
      >
        <span className="grid size-12 place-items-center rounded-full bg-brasa text-noche transition-transform duration-500 group-hover:scale-110">
          {sonando ? <Pausa className="size-5" /> : <Play className="size-5 translate-x-px" />}
        </span>
        <span className="text-left">
          <span className="kicker block text-ceniza">{sonando ? "Sonando" : "Escuchar"}</span>
          <span className="mt-1 block font-display text-xl italic leading-none text-hueso">{disco}</span>
        </span>
        <Ondas barras={7} className="ml-2 h-6 w-9" color="#ff5a1f" activo={activo} />
      </button>
    </Magnetico>
  );
}
