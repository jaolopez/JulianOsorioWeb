"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { punteroFino, sinMovimiento } from "@/lib/gsap";

/**
 * Burbuja que acompaña al puntero sobre lo que se puede abrir o tocar
 * (`data-cursor="Ver"`, «Play», «Leer»…), con la luz del mundo que se señala.
 *
 * El puntero del sistema no se esconde: es el único que nunca llega tarde.
 * La burbuja se mueve sólo con `transform` en su propia capa, en un bucle
 * que duerme cuando no hay nada que mostrar. Sólo con mouse.
 */
export default function Cursor() {
  const burbuja = useRef<HTMLDivElement>(null);
  const etiqueta = useRef<HTMLSpanElement>(null);
  const ruta = usePathname();
  const apagar = useRef<() => void>(() => {});

  useEffect(() => {
    if (!punteroFino() || sinMovimiento()) return;
    const b = burbuja.current!;
    const pos = { x: -200, y: -200, tx: -200, ty: -200, s: 0, ts: 0 };
    let id = 0;
    let previo = 0;

    const pintar = () => {
      b.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${pos.s})`;
    };

    const cuadro = (ahora: number) => {
      // Suavizado independiente de los cuadros por segundo (60 o 120 Hz se sienten igual).
      const dt = Math.min(64, ahora - (previo || ahora - 16.7));
      previo = ahora;
      const k = 1 - Math.pow(1 - 0.28, dt / 16.7);
      const ks = 1 - Math.pow(1 - 0.2, dt / 16.7);
      pos.x += (pos.tx - pos.x) * k;
      pos.y += (pos.ty - pos.y) * k;
      pos.s += (pos.ts - pos.s) * ks;
      pintar();
      const quieto = Math.abs(pos.tx - pos.x) < 0.1 && Math.abs(pos.ty - pos.y) < 0.1 && Math.abs(pos.ts - pos.s) < 0.002;
      if (quieto) {
        pos.s = pos.ts;
        pintar();
        id = 0;
        previo = 0;
        return;
      }
      id = requestAnimationFrame(cuadro);
    };
    const despertar = () => {
      if (!id) id = requestAnimationFrame(cuadro);
    };

    const mover = (e: PointerEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      // Si la burbuja estaba apagada, aparece donde está el puntero, no viaja desde lejos.
      if (pos.s < 0.02) {
        pos.x = pos.tx;
        pos.y = pos.ty;
      }
      if (pos.ts > 0 || pos.s > 0) despertar();
    };

    const sobre = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const texto = el?.dataset.cursor ?? "";
      if (texto) {
        etiqueta.current!.textContent = texto;
        b.style.backgroundColor = getComputedStyle(el!).getPropertyValue("--tono").trim() || "#ff5a1f";
      }
      pos.ts = texto ? 1 : 0;
      despertar();
    };

    const fuera = () => {
      pos.ts = 0;
      despertar();
    };
    apagar.current = fuera;

    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerover", sobre, { passive: true });
    document.documentElement.addEventListener("pointerleave", fuera);
    window.addEventListener("blur", fuera);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerover", sobre);
      document.documentElement.removeEventListener("pointerleave", fuera);
      window.removeEventListener("blur", fuera);
    };
  }, []);

  // Al navegar, el enlace que se clickeó desaparece: la burbuja se va con él.
  useEffect(() => apagar.current(), [ruta]);

  return (
    <div
      ref={burbuja}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden size-[5.5rem] place-items-center rounded-full bg-brasa will-change-transform [@media(pointer:fine)]:grid"
      style={{ transform: "translate3d(-200px, -200px, 0) scale(0)" }}
    >
      <span ref={etiqueta} className="kicker text-[10px] text-noche" />
    </div>
  );
}
