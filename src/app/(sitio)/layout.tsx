import { ViewTransition } from "react";
import { cacheLife } from "next/cache";
import { ReproductorProvider } from "@/components/audio/Reproductor";
import MiniReproductor from "@/components/audio/MiniReproductor";
import Coreografia from "@/components/movimiento/Coreografia";
import Cursor from "@/components/movimiento/Cursor";
import Precarga from "@/components/movimiento/Precarga";
import ScrollSuave from "@/components/movimiento/ScrollSuave";
import Navegacion from "@/components/ui/Navegacion";
import Pie from "@/components/ui/Pie";
import { getAjustes } from "@/sanity/queries";

/** Año para el pie. Se recalcula a diario, no en cada visita. */
async function anioActual() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/**
 * Envoltorio del sitio público. El Studio (/studio) queda fuera: no hereda el
 * menú, el scroll suave ni el reproductor.
 *
 * El reproductor vive aquí y no en cada página, por eso la música sigue
 * sonando al navegar. El contenido va dentro de una View Transition: al
 * cambiar de página la anterior se disuelve y la nueva sube como un telón.
 */
export default async function SitioLayout({ children }: LayoutProps<"/">) {
  const [ajustes, anio] = await Promise.all([getAjustes(), anioActual()]);

  return (
    <ReproductorProvider>
      <a
        href="#contenido"
        className="kicker fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-hueso px-4 py-3 text-noche transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Precarga />
      <ScrollSuave />
      <Coreografia />
      <Cursor />
      <Navegacion ajustes={ajustes} />
      <ViewTransition update="pagina" default="none">
        <div id="contenido">
          {children}
          <Pie ajustes={ajustes} anio={anio} />
        </div>
      </ViewTransition>
      <MiniReproductor />
      <div className="grano" aria-hidden />
    </ReproductorProvider>
  );
}
