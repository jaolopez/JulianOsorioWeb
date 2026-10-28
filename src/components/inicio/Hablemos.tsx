import Link from "next/link";
import Magnetico from "@/components/movimiento/Magnetico";
import Marquesina from "@/components/movimiento/Marquesina";
import { Correo, WhatsApp } from "@/components/ui/Iconos";
import type { Ajustes } from "@/lib/tipos";

/** Cierre de la portada: una cinta gigante y los dos caminos para escribir. */
export default function Hablemos({ ajustes }: { ajustes: Ajustes }) {
  const { correo, whatsapp } = ajustes;
  return (
    <section id="contacto" className="relative scroll-mt-[var(--barra)] overflow-hidden py-24 md:py-36" aria-label="Contacto">
      <Marquesina velocidad={28} className="text-hueso">
        <span className="display px-[0.2em] text-[clamp(5rem,16vw,16rem)] italic">Hablemos</span>
        <span className="display px-[0.2em] text-[clamp(5rem,16vw,16rem)] text-brasa">✺</span>
        <span className="display texto-hueco px-[0.2em] text-[clamp(5rem,16vw,16rem)]">Escribime</span>
        <span className="display px-[0.2em] text-[clamp(5rem,16vw,16rem)] text-brasa">✺</span>
      </Marquesina>
      <div className="contenedor mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {correo && (
          <Magnetico>
            <a
              href={`mailto:${correo}`}
              className="flex items-center gap-3 rounded-full bg-hueso px-7 py-4 text-noche transition-colors hover:bg-brasa"
            >
              <Correo className="size-5" />
              {correo}
            </a>
          </Magnetico>
        )}
        {!correo && !whatsapp && (
          <Magnetico>
            <Link href="/#acerca" className="flex items-center gap-3 rounded-full bg-hueso px-7 py-4 text-noche transition-colors hover:bg-brasa">
              Conocer a Julián
            </Link>
          </Magnetico>
        )}
        {whatsapp && (
          <Magnetico>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-linea px-7 py-4 text-hueso transition-colors hover:border-hueso"
            >
              <WhatsApp className="size-5" />
              WhatsApp
            </a>
          </Magnetico>
        )}
      </div>
    </section>
  );
}
