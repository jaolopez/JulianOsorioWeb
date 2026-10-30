"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

// Se registran una sola vez, en el navegador.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip, useGSAP);
  // Curva de la casa: arranque decidido, llegada muy lenta.
  CustomEase.create("casa", "0.16, 1, 0.3, 1");
  CustomEase.create("telon", "0.76, 0, 0.24, 1");
  gsap.defaults({ ease: "casa", duration: 1.1 });
  // En el celular la barra de direcciones cambia el alto al bajar: no es motivo para recalcular todo.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const sinMovimiento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const punteroFino = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/**
 * Se resuelve cuando la pantalla de entrada terminó (o enseguida si esta vez
 * no hubo entrada), para que el titular del inicio no se anime por debajo.
 */
export function trasPrecarga(): Promise<void> {
  const precarga = document.querySelector<HTMLElement>(".precarga");
  const visible = precarga && getComputedStyle(precarga).display !== "none";
  if (!visible) return Promise.resolve();
  return new Promise((ok) => window.addEventListener("precarga-lista", () => ok(), { once: true }));
}

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
