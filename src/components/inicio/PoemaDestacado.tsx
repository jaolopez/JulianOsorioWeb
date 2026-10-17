import Link from "next/link";
import Poema from "@/components/escritura/Poema";
import Foto from "@/components/ui/Foto";
import { Flecha } from "@/components/ui/Iconos";
import type { Texto } from "@/lib/tipos";

/** Un poema a página completa: las estrofas suben línea por línea al leerlas. */
export default function PoemaDestacado({ texto }: { texto: Texto }) {
  // En la portada se muestran como mucho tres estrofas; el resto, al entrar.
  const corto = texto.cuerpo.split(/\n\s*\n/).slice(0, 3).join("\n\n");
  return (
    <section
      className="relative border-y border-linea bg-noche-2 py-24 md:py-40"
      aria-labelledby="poema-titulo"
      style={{ "--tono": "var(--color-tinta)" } as React.CSSProperties}
    >
      <div className="contenedor grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p data-aparecer className="kicker flex items-center gap-3 text-ceniza">
            <span className="block h-px w-8 bg-tinta" />
            02 · Escritura
          </p>
          {texto.imagen && (
            <div data-revelar className="relative mt-10 aspect-[3/4] w-full max-w-sm overflow-hidden rounded-sm">
              <Foto foto={texto.imagen} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover grayscale" />
              <div className="absolute inset-0 bg-tinta/20 mix-blend-color" />
            </div>
          )}
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <h2 id="poema-titulo" data-titular className="display text-[clamp(2.75rem,5vw,5rem)] italic text-tinta">
            {texto.titulo}
          </h2>
          <Poema cuerpo={corto} prosa={texto.tipo !== "poema"} className="mt-12" />
          <div data-aparecer className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
            <Link href={`/escritura/${texto.slug}`} className="group inline-flex items-center gap-3">
              <span className="enlace-linea">Leer completo</span>
              <Flecha className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/escritura" className="group inline-flex items-center gap-3 text-ceniza hover:text-hueso">
              <span className="enlace-linea">Todos los textos</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
