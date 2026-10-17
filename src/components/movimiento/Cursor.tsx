"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, punteroFino, sinMovimiento } from "@/lib/gsap";

/**
 * Cursor propio: un punto que sigue al mouse con exactitud y un aro que llega
 * con un poco de retraso. Sobre un enlace marcado con `data-cursor="Ver"` el
 * aro crece y muestra la palabra. Sólo con mouse; en pantallas táctiles no
 * existe.
 */
export default function Cursor() {
  const punto = useRef<HTMLDivElement>(null);
  const aro = useRef<HTMLDivElement>(null);
  const etiqueta = useRef<HTMLSpanElement>(null);
  const ruta = usePathname();

  useEffect(() => {
    if (!punteroFino() || sinMovimiento()) return;
    const p = punto.current!;
    const a = aro.current!;
    document.documentElement.classList.add("cursor-propio");

    gsap.set([p, a], { xPercent: -50, yPercent: -50, opacity: 0 });
    const px = gsap.quickTo(p, "x", { duration: 0.08, ease: "power3" });
    const py = gsap.quickTo(p, "y", { duration: 0.08, ease: "power3" });
    const ax = gsap.quickTo(a, "x", { duration: 0.55, ease: "power3" });
    const ay = gsap.quickTo(a, "y", { duration: 0.55, ease: "power3" });

    const mover = (e: PointerEvent) => {
      px(e.clientX);
      py(e.clientY);
      ax(e.clientX);
      ay(e.clientY);
      gsap.to([p, a], { opacity: 1, duration: 0.3, overwrite: "auto" });
    };
    const salir = () => gsap.to([p, a], { opacity: 0, duration: 0.3 });

    const sobre = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      const texto = el?.dataset.cursor ?? "";
      if (etiqueta.current) etiqueta.current.textContent = texto;
      // Toma la luz del mundo que se está señalando (tinta, plata, ámbar…).
      const tono = (el && getComputedStyle(el).getPropertyValue("--tono").trim()) || "#ff5a1f";
      gsap.to(a, {
        width: texto ? 96 : el ? 56 : 36,
        height: texto ? 96 : el ? 56 : 36,
        backgroundColor: texto ? tono : "rgba(255,90,31,0)",
        borderColor: texto ? "rgba(255,90,31,0)" : el ? "rgba(239,232,220,0.9)" : "rgba(239,232,220,0.4)",
        duration: 0.5,
        ease: "casa",
      });
      gsap.to(p, { scale: el ? 0 : 1, duration: 0.3 });
      gsap.to(etiqueta.current, { opacity: texto ? 1 : 0, scale: texto ? 1 : 0.6, duration: 0.4 });
    };

    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerover", sobre, { passive: true });
    document.addEventListener("pointerleave", salir);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerover", sobre);
      document.removeEventListener("pointerleave", salir);
      document.documentElement.classList.remove("cursor-propio");
    };
  }, []);

  // Al navegar, el enlace que se clickeó desaparece: el aro vuelve a su tamaño.
  useEffect(() => {
    if (!aro.current) return;
    gsap.to(aro.current, { width: 36, height: 36, backgroundColor: "rgba(255,90,31,0)", duration: 0.4 });
    gsap.to(etiqueta.current, { opacity: 0, duration: 0.2 });
  }, [ruta]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div ref={aro} className="fixed left-0 top-0 grid size-9 place-items-center rounded-full border border-hueso/40 mix-blend-difference">
        <span ref={etiqueta} className="kicker text-[10px] text-noche opacity-0" />
      </div>
      <div ref={punto} className="fixed left-0 top-0 size-1.5 rounded-full bg-hueso mix-blend-difference" />
    </div>
  );
}
