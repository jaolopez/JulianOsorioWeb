"use client";

import { useEffect, useRef } from "react";

/** Línea fina arriba de la pantalla que avanza a medida que se lee. */
export default function BarraLectura() {
  const barra = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id = 0;
    const paso = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      if (barra.current) barra.current.style.transform = `scaleX(${total > 0 ? el.scrollTop / total : 0})`;
      id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, []);
  return <div ref={barra} aria-hidden className="fixed inset-x-0 top-0 z-[75] h-0.5 origin-left scale-x-0 bg-[var(--tono)]" />;
}
