"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __escena?: string;
  }
}

/**
 * Va al final de cada página. Su efecto corre cuando la página terminó de
 * hidratarse: recién entonces la coreografía puede partir textos y mover
 * cosas sin chocar con React.
 */
export default function Escena() {
  useEffect(() => {
    window.__escena = window.location.pathname;
    window.dispatchEvent(new Event("escena-lista"));
  }, []);
  return null;
}
