"use client";

import { useEffect, useRef } from "react";
import { bus } from "./bus";

/**
 * Ecualizador en vivo: barras que siguen las frecuencias de lo que suena.
 * Dibuja en <canvas> fuera de React; quieto, las barras respiran apenas
 * (a 30 cuadros: tan lento no se nota y libera al navegador mientras se
 * baja por la página). Sólo dibuja mientras está a la vista.
 */
export default function Ondas({
  barras = 24,
  className = "",
  color = "#efe8dc",
  activo = true,
}: {
  barras?: number;
  className?: string;
  color?: string;
  activo?: boolean;
}) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = lienzo.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alturas = new Float32Array(barras);
    let id = 0;
    let ultimo = 0;

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(c);

    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(id);
      if (visible) id = requestAnimationFrame(dibujar);
    });
    io.observe(c);

    const dibujar = (ahora: number) => {
      if (!visible) return;
      id = requestAnimationFrame(dibujar);
      const enVivo = activo && bus.sonando && bus.frecuencias;
      if (!enVivo && ahora - ultimo < 30) return;
      ultimo = ahora;
      const t = ahora * 0.0024;
      const { width: w, height: h } = c;
      ctx.clearRect(0, 0, w, h);
      const hueco = w / barras;
      const ancho = Math.max(1, hueco * 0.45);
      const f = bus.frecuencias;
      for (let i = 0; i < barras; i++) {
        let objetivo: number;
        if (activo && bus.sonando && f) {
          // Escala logarítmica: más barras para graves y medios, que es donde vive la música.
          const idx = Math.floor(Math.pow(i / barras, 1.6) * (f.length * 0.7));
          objetivo = f[idx] / 255;
        } else {
          objetivo = quieto ? 0.15 : 0.08 + 0.06 * (1 + Math.sin(t + i * 0.55));
        }
        alturas[i] += (objetivo - alturas[i]) * 0.25;
        const bh = Math.max(ancho, alturas[i] * h);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.35 + alturas[i] * 0.65;
        ctx.beginPath();
        ctx.roundRect(i * hueco + (hueco - ancho) / 2, (h - bh) / 2, ancho, bh, ancho / 2);
        ctx.fill();
      }
    };
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      io.disconnect();
    };
  }, [barras, color, activo]);

  return <canvas ref={lienzo} className={className} aria-hidden />;
}
