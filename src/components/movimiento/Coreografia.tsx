"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, sinMovimiento } from "@/lib/gsap";

/**
 * Coreografía del sitio.
 *
 * Las páginas son componentes de servidor y sólo marcan sus elementos con
 * atributos; este componente los encuentra y les da movimiento:
 *
 * - `data-titular`          el texto sube línea por línea desde una máscara.
 *                           Con `="ya"` arranca al cargar, sin esperar al scroll.
 * - `data-letras`           igual, pero letra por letra (titulares gigantes).
 *                           Con `data-letras-centro` las letras salen desde el medio.
 * - `data-aparecer`         sube y aparece al entrar en pantalla, en tandas.
 * - `data-parallax="0.15"`  se desplaza más lento que el scroll.
 * - `data-palabras`         cada palabra se enciende a medida que se baja.
 * - `data-revelar`          una imagen se descubre como un telón.
 *
 * Arranca cuando la página termina de hidratarse (ver `Escena`). Observa
 * el contenido que llega después (lo que carga por partes) y lo
 * anima también. Al cambiar de página deshace todo y vuelve a empezar.
 */
export default function Coreografia() {
  const ruta = usePathname();

  useEffect(() => {
    const raiz = document.getElementById("contenido");
    if (!raiz) return;

    if (sinMovimiento()) {
      raiz.querySelectorAll<HTMLElement>("[data-aparecer]").forEach((el) => (el.style.opacity = "1"));
      return;
    }

    const ctx = gsap.context(() => {}, raiz);
    let vivo = true;

    /** Anima lo nuevo; devuelve si encontró algo, para no recalcular en vano. */
    const animar = () => {
      if (!vivo) return false;
      let hubo = false;
      const buscar = (selector: string) => {
        const lista = nuevos(raiz, selector);
        if (lista.length) hubo = true;
        return lista;
      };
      ctx.add(() => {
        buscar("[data-titular]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "linea",
            autoSplit: true,
            onSplit: (s) =>
              gsap.from(s.lines, {
                yPercent: 115,
                rotate: 2,
                duration: 1.4,
                stagger: 0.09,
                delay: Number(el.dataset.retraso ?? 0),
                scrollTrigger: el.dataset.titular === "ya" ? undefined : { trigger: el, start: "top 88%", once: true },
              }),
          });
        });

        buscar("[data-letras]").forEach((el) => {
          SplitText.create(el, {
            type: "chars,lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (s) =>
              gsap.from(s.chars, {
                yPercent: 120,
                duration: 1.6,
                stagger: { each: 0.035, from: el.hasAttribute("data-letras-centro") ? "center" : "start" },
                delay: Number(el.dataset.retraso ?? 0),
                scrollTrigger: el.dataset.letras === "ya" ? undefined : { trigger: el, start: "top 90%", once: true },
              }),
          });
        });

        const aparecen = buscar("[data-aparecer]");
        if (aparecen.length) {
          gsap.set(aparecen, { opacity: 0, y: 48 });
          ScrollTrigger.batch(aparecen, {
            start: "top 92%",
            once: true,
            onEnter: (lote) => gsap.to(lote, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, overwrite: true }),
          });
        }

        buscar("[data-parallax]").forEach((el) => {
          const f = Number(el.dataset.parallax) || 0.15;
          gsap.fromTo(
            el,
            { yPercent: -f * 100 },
            {
              yPercent: f * 100,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });

        buscar("[data-revelar]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "telon",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }
          );
          const img = el.querySelector("img");
          if (img) gsap.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2.2, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });

        buscar("[data-palabras]").forEach((el) => {
          const s = SplitText.create(el, { type: "words" });
          gsap.fromTo(
            s.words,
            { opacity: 0.12 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
            }
          );
        });
      });
      return hubo;
    };

    let pendiente = 0;
    const mo = new MutationObserver(() => {
      clearTimeout(pendiente);
      pendiente = window.setTimeout(() => {
        if (animar()) ScrollTrigger.refresh();
      }, 120);
    });

    /* Se arranca cuando la página avisa que terminó de hidratarse (<Escena />)
       y las fuentes están listas: cambian el largo de las líneas. */
    const arrancar = () => {
      void document.fonts.ready.then(() => {
        if (!vivo) return;
        animar();
        ScrollTrigger.refresh();
        mo.observe(raiz, { childList: true, subtree: true });
      });
    };
    if (window.__escena === window.location.pathname) arrancar();
    else window.addEventListener("escena-lista", arrancar, { once: true });

    return () => {
      vivo = false;
      window.removeEventListener("escena-lista", arrancar);
      clearTimeout(pendiente);
      mo.disconnect();
      ctx.revert();
      raiz.querySelectorAll<HTMLElement>("[data-coreo]").forEach((el) => delete el.dataset.coreo);
    };
  }, [ruta]);

  return null;
}

/** Elementos que coinciden y todavía no tienen animación. */
function nuevos(raiz: HTMLElement, selector: string) {
  return Array.from(raiz.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    const marca = `${el.dataset.coreo ?? ""}|${selector}`;
    if (el.dataset.coreo?.includes(selector)) return false;
    el.dataset.coreo = marca;
    return true;
  });
}
