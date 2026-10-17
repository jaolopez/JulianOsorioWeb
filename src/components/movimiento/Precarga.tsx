"use client";

import { useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, sinMovimiento, useGSAP } from "@/lib/gsap";

/**
 * Entrada al sitio: un contador de 0 a 100, el logo que se enciende y un
 * telón que sube. Sólo la primera vez en la sesión; si se vuelve a entrar,
 * un script en <head> ya marcó `ya-visto` y la capa ni se pinta.
 */
export default function Precarga() {
  const capa = useRef<HTMLDivElement>(null);
  const numero = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = capa.current;
      if (!el || document.documentElement.classList.contains("ya-visto")) return;
      try {
        sessionStorage.setItem("jo-visto", "1");
      } catch {}

      const terminar = () => {
        el.style.display = "none";
        window.__lenis?.start();
        window.dispatchEvent(new Event("precarga-lista"));
      };
      if (sinMovimiento()) return terminar();

      window.__lenis?.stop();
      const cuenta = { v: 0 };
      gsap
        .timeline({ onComplete: terminar })
        .to(cuenta, {
          v: 100,
          duration: 1.8,
          ease: "power2.inOut",
          onUpdate: () => {
            if (numero.current) numero.current.textContent = String(Math.round(cuenta.v)).padStart(3, "0");
          },
        })
        .fromTo("[data-precarga-logo]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.6, ease: "telon" }, 0.1)
        .to("[data-precarga-logo]", { yPercent: -40, opacity: 0, duration: 0.6, ease: "power2.in" }, ">-0.05")
        .to(numero.current, { opacity: 0, duration: 0.3 }, "<")
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "telon" }, "<0.15");
    },
    { scope: capa }
  );

  return (
    <div
      ref={capa}
      aria-hidden
      className="precarga fixed inset-0 z-[110] grid place-items-center bg-noche"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <Logo data-precarga-logo className="w-[min(70vw,28rem)] text-hueso" style={{ clipPath: "inset(0 100% 0 0)" }} />
      <span ref={numero} className="kicker absolute bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] right-[var(--gutter)] text-sm tabular-nums text-ceniza">
        000
      </span>
      <span className="kicker absolute bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] left-[var(--gutter)] text-ceniza">Universo creativo</span>
    </div>
  );
}
