"use client";

import { useRef } from "react";
import { gsap, punteroFino, sinMovimiento, useGSAP } from "@/lib/gsap";

/**
 * Envoltorio magnético: el contenido se inclina hacia el mouse cuando éste
 * se acerca y vuelve con un rebote elástico al salir.
 */
export default function Magnetico({
  children,
  fuerza = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  fuerza?: number;
  className?: string;
}) {
  const caja = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = caja.current;
      if (!el || !punteroFino() || sinMovimiento()) return;
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const mover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * fuerza);
        y((e.clientY - (r.top + r.height / 2)) * fuerza);
      };
      const salir = () => gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.35)" });
      el.addEventListener("pointermove", mover);
      el.addEventListener("pointerleave", salir);
      return () => {
        el.removeEventListener("pointermove", mover);
        el.removeEventListener("pointerleave", salir);
      };
    },
    { scope: caja }
  );

  return (
    <span ref={caja} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
