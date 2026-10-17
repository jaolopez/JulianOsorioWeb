"use client";

import Link from "next/link";
import { useRef } from "react";
import Foto from "@/components/ui/Foto";
import { Flecha } from "@/components/ui/Iconos";
import { gsap, sinMovimiento, useGSAP } from "@/lib/gsap";
import type { Foto as TFoto } from "@/lib/tipos";

type Item = { foto: TFoto; galeria: string; slug: string };

/**
 * Fotografía en la portada.
 *
 * En pantallas anchas la sección se ancla y el scroll vertical desplaza las
 * fotos de lado, cada una a su propio ritmo. En el celular es un carrusel
 * nativo que se desliza con el dedo y se acomoda foto por foto.
 */
export default function LuzDetenida({ items }: { items: Item[] }) {
  const raiz = useRef<HTMLElement>(null);
  const pista = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (sinMovimiento()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const p = pista.current!;
        const distancia = () => p.scrollWidth - window.innerWidth;
        const tween = gsap.to(p, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: raiz.current,
            start: "top top",
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        // Cada foto se mueve un poco dentro de su marco: profundidad.
        p.querySelectorAll<HTMLElement>("[data-dentro]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            { xPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: raiz }
  );

  // Alturas variadas para que la tira tenga ritmo.
  const alturas = ["md:h-[62vh]", "md:h-[44vh] md:self-end", "md:h-[54vh] md:self-start", "md:h-[70vh]", "md:h-[40vh] md:self-center"];

  return (
    <section
      ref={raiz}
      className="relative overflow-hidden py-24 md:flex md:h-svh md:items-center md:py-0"
      aria-labelledby="luz-titulo"
      style={{ "--tono": "var(--color-plata)" } as React.CSSProperties}
    >
      <div
        ref={pista}
        className="sin-barra flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] md:h-[78vh] md:snap-none md:items-center md:gap-[4vw] md:overflow-visible"
      >
        <div className="flex w-[78vw] shrink-0 snap-start flex-col justify-end md:w-[32vw]">
          <p className="kicker flex items-center gap-3 text-ceniza">
            <span className="block h-px w-8 bg-plata" />
            03 · Fotografía
          </p>
          <h2 id="luz-titulo" className="display mt-6 text-[clamp(3.25rem,7vw,8rem)]">
            La luz
            <br />
            <em className="text-plata">detenida</em>
          </h2>
          <p className="mt-6 max-w-xs text-ceniza">Una imagen que compromete la visual, un momento que se queda en la memoria.</p>
          <Link href="/fotografia" className="group mt-8 inline-flex items-center gap-3">
            <span className="enlace-linea">Ver galerías</span>
            <Flecha className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {items.map((it, i) => (
          <Link
            key={`${it.slug}-${it.foto.src}`}
            href={`/fotografia/${it.slug}`}
            data-cursor="Ver"
            className={`group relative h-[60svh] shrink-0 snap-center overflow-hidden rounded-sm ${alturas[i % alturas.length]}`}
            style={{ aspectRatio: `${it.foto.ancho} / ${it.foto.alto}` }}
          >
            <div data-dentro className="absolute inset-y-0 -inset-x-[10%]">
              <Foto foto={it.foto} fill sizes="(min-width: 768px) 50vw, 85vw" className="object-cover transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-105" />
            </div>
            <span className="kicker absolute bottom-4 left-4 rounded-full bg-noche/60 px-3 py-2 text-hueso backdrop-blur-md">
              {String(i + 1).padStart(2, "0")} — {it.galeria}
            </span>
          </Link>
        ))}
        <div className="w-px shrink-0 md:w-[8vw]" aria-hidden />
      </div>
    </section>
  );
}
