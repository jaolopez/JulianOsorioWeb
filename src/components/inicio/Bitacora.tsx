import Link from "next/link";
import Tarjeta from "@/components/bitacora/Tarjeta";
import { Flecha } from "@/components/ui/Iconos";
import type { Publicacion } from "@/lib/tipos";

export default function Bitacora({ publicaciones }: { publicaciones: Publicacion[] }) {
  const [primera, ...resto] = publicaciones.slice(0, 3);
  if (!primera) return null;
  return (
    <section className="contenedor py-24 md:py-36" aria-labelledby="bitacora-titulo">
      <div className="mb-14 flex items-end justify-between gap-6">
        <h2 id="bitacora-titulo" data-titular className="display text-[clamp(2.75rem,6vw,6rem)]">
          Bitácora
        </h2>
        <Link href="/bitacora" className="group mb-3 inline-flex items-center gap-3 text-ceniza hover:text-hueso">
          <span className="enlace-linea">Todo</span>
          <Flecha className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <Tarjeta p={primera} grande />
        </div>
        <div className="grid gap-14 md:col-span-4 md:col-start-9">
          {resto.map((p) => (
            <Tarjeta key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
