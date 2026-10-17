"use client";

import Magnetico from "@/components/movimiento/Magnetico";
import { Flecha } from "./Iconos";

export default function ArribaBoton() {
  return (
    <Magnetico>
      <button
        type="button"
        onClick={() => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
        className="grid size-16 place-items-center rounded-full border border-linea text-ceniza transition-colors hover:border-hueso hover:text-hueso"
        aria-label="Volver arriba"
      >
        <Flecha className="size-5 -rotate-90" />
      </button>
    </Magnetico>
  );
}
