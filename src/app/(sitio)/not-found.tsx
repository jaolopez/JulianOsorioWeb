import Link from "next/link";
import Escena from "@/components/movimiento/Escena";
import { Flecha } from "@/components/ui/Iconos";

export default function NoEncontrada() {
  return (
    <main className="contenedor flex min-h-svh flex-col justify-center pt-[var(--barra)] pb-24">
      <p className="kicker text-brasa">Error 404</p>
      <h1 className="display mt-8 text-[clamp(4rem,14vw,14rem)]">
        <span data-letras="ya" className="block">
          Silencio
        </span>
        <span data-letras="ya" data-retraso="0.2" className="block pl-[10vw] italic text-ceniza">
          entre canciones
        </span>
      </h1>
      <p className="mt-10 max-w-md text-ceniza">Esta página no existe o cambió de lugar. El resto del universo sigue sonando.</p>
      <Link href="/" className="group mt-10 inline-flex items-center gap-3 self-start">
        <span className="enlace-linea">Volver al inicio</span>
        <Flecha className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
      <Escena />
    </main>
  );
}
