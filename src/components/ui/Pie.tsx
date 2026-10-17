import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { NAVEGACION } from "@/lib/mundos";
import type { Ajustes } from "@/lib/tipos";
import Redes from "./Redes";
import { FlechaDiagonal } from "./Iconos";
import ArribaBoton from "./ArribaBoton";

export default function Pie({ ajustes, anio }: { ajustes: Ajustes; anio: number }) {
  return (
    <footer className="relative overflow-hidden border-t border-linea pt-20 pb-[calc(env(safe-area-inset-bottom)+7rem)] md:pb-10">
      <div className="contenedor grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="kicker text-ceniza">Escribime</p>
          {ajustes.correo ? (
            <a href={`mailto:${ajustes.correo}`} className="display mt-5 inline-flex items-center gap-3 text-[clamp(2rem,4vw,3.5rem)] italic hover:text-brasa">
              {ajustes.correo}
              <FlechaDiagonal className="size-7" />
            </a>
          ) : (
            <Link href="/acerca" className="display mt-5 inline-flex items-center gap-3 text-[clamp(2rem,4vw,3.5rem)] italic hover:text-brasa">
              Hablemos
              <FlechaDiagonal className="size-7" />
            </Link>
          )}
          <Redes redes={ajustes.redes} className="mt-8" />
        </div>

        <nav aria-label="Pie" className="grid grid-cols-2 gap-x-6 gap-y-3 md:col-span-4 md:col-start-7">
          {NAVEGACION.map((n) => (
            <Link key={n.href} href={n.href} className="group flex items-baseline gap-2 py-1 text-ceniza transition-colors hover:text-hueso">
              <span className="kicker text-[0.5625rem] text-humo">{n.numero}</span>
              <span className="enlace-linea">{n.nombre}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-start md:col-span-2 md:justify-end">
          <ArribaBoton />
        </div>
      </div>

      <div className="contenedor mt-20 md:mt-28">
        <Logo className="h-auto w-full text-hueso/[0.07]" aria-hidden />
      </div>

      <div className="contenedor mt-8 flex flex-col gap-2 text-xs text-humo sm:flex-row sm:justify-between">
        <p>© {anio} Julián Osorio. Todos los derechos reservados.</p>
        <p>{ajustes.ciudad}</p>
      </div>
    </footer>
  );
}
