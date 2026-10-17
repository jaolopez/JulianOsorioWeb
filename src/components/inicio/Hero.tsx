"use client";

import { useRef } from "react";
import { useReproductor, type Pista } from "@/components/audio/Reproductor";
import Ondas from "@/components/audio/Ondas";
import Magnetico from "@/components/movimiento/Magnetico";
import { Pausa, Play } from "@/components/ui/Iconos";
import { gsap, ScrollTrigger, sinMovimiento, SplitText, trasPrecarga, useGSAP } from "@/lib/gsap";
import Humo from "./Humo";

export default function Hero({
  titular,
  bajada,
  ciudad,
  pistas,
  disco,
}: {
  titular: string;
  bajada: string;
  ciudad?: string;
  pistas: Pista[];
  disco?: string;
}) {
  const raiz = useRef<HTMLElement>(null);
  const { reproducir, alternar, sonando, actual } = useReproductor();
  const delDisco = Boolean(actual && pistas.some((p) => p.audio === actual.audio));

  // Primera palabra en redonda, el resto en cursiva y corrida a la derecha.
  const [primera, ...resto] = titular.trim().split(/\s+/);

  useGSAP(
    () => {
      if (sinMovimiento()) return;
      const el = raiz.current!;
      const partes = SplitText.create(el.querySelectorAll("[data-hero-linea]"), { type: "chars", mask: "chars" });
      gsap.set(partes.chars, { yPercent: 110 });
      gsap.set("[data-hero-sube]", { opacity: 0, y: 24 });
      gsap.set("[data-hero-raya]", { scaleX: 0 });

      let vigente = true;
      void trasPrecarga().then(() => {
        if (!vigente) return;
        gsap
          .timeline()
          .to(partes.chars, { yPercent: 0, duration: 1.6, stagger: 0.045 })
          .to("[data-hero-raya]", { scaleX: 1, duration: 1.4, ease: "telon" }, 0.2)
          .to("[data-hero-sube]", { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.5);
      });

      // Al bajar, el titular se aleja y el humo se apaga hacia la siguiente sección.
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-titular]", { yPercent: -35, scale: 0.92, opacity: 0.2, ease: "none", scrollTrigger: st });
      gsap.to("[data-hero-fondo]", { opacity: 0.25, scale: 1.1, ease: "none", scrollTrigger: st });
      return () => {
        vigente = false;
        ScrollTrigger.refresh();
      };
    },
    { scope: raiz }
  );

  const escuchar = () => (delDisco ? alternar() : reproducir(pistas, 0));

  return (
    <section ref={raiz} className="relative isolate flex h-svh min-h-[36rem] flex-col overflow-hidden" aria-label="Portada">
      <div data-hero-fondo className="absolute inset-0 -z-10 origin-top">
        <Humo />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-noche to-transparent" />
      </div>

      <div className="contenedor flex items-start justify-between pt-[calc(var(--barra)+1.5rem)] text-ceniza">
        <p data-hero-sube className="kicker">
          {ciudad ?? "Universo creativo"}
        </p>
        <p data-hero-sube className="kicker hidden text-right leading-[1.8] sm:block">
          Música · Escritura
          <br />
          Fotografía · Gastronomía
        </p>
      </div>

      <div className="contenedor mt-auto pb-[calc(env(safe-area-inset-bottom)+6.5rem)] md:pb-10">
        <h1 data-hero-titular className="display origin-bottom-left text-[clamp(4.25rem,17.5vw,19rem)] text-hueso">
          <span data-hero-linea className="block">
            {primera}
          </span>
          {resto.length > 0 && (
            <span data-hero-linea className="block pl-[12vw] italic text-brasa md:pl-[22vw]">
              {resto.join(" ")}
            </span>
          )}
        </h1>

        <div data-hero-raya className="mt-8 h-px origin-left bg-linea md:mt-10" />

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p data-hero-sube className="max-w-sm text-balance text-[0.9375rem] leading-relaxed text-ceniza">
            {bajada}
          </p>

          {pistas.length > 0 && (
            <div data-hero-sube>
              <Magnetico fuerza={0.25}>
                <button
                  type="button"
                  onClick={escuchar}
                  data-cursor={delDisco && sonando ? "Pausa" : "Play"}
                  className="group flex items-center gap-4 rounded-full border border-linea bg-noche/40 py-2 pl-2 pr-6 backdrop-blur-md transition-colors hover:border-brasa"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-brasa text-noche transition-transform duration-500 group-hover:scale-110">
                    {delDisco && sonando ? <Pausa className="size-5" /> : <Play className="size-5 translate-x-px" />}
                  </span>
                  <span className="text-left">
                    <span className="kicker block text-ceniza">{delDisco && sonando ? "Sonando" : "Escuchar"}</span>
                    <span className="mt-1 block font-display text-xl italic leading-none text-hueso">{disco}</span>
                  </span>
                  <Ondas barras={7} className="ml-2 h-6 w-9" color="#ff5a1f" activo={delDisco} />
                </button>
              </Magnetico>
            </div>
          )}
        </div>
      </div>

      <div data-hero-sube className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden>
        <span className="kicker text-[0.5625rem] text-humo">Bajar</span>
        <span className="relative block h-12 w-px overflow-hidden bg-linea">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[caer_1.8s_var(--ease-suave)_infinite] bg-hueso" />
        </span>
      </div>
    </section>
  );
}
