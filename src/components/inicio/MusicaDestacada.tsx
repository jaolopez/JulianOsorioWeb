import Link from "next/link";
import Disco from "@/components/musica/Disco";
import ListaCanciones from "@/components/musica/ListaCanciones";
import Enlaces from "@/components/musica/Enlaces";
import { Flecha } from "@/components/ui/Iconos";
import type { Album, Foto } from "@/lib/tipos";

export default function MusicaDestacada({ album, funda }: { album: Album; funda?: Foto }) {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-40" aria-labelledby="disco-titulo" style={{ "--tono": "var(--color-brasa)" } as React.CSSProperties}>
      <div className="pointer-events-none absolute -left-1/4 top-1/4 -z-10 size-[70vw] rounded-full bg-brasa/10 blur-[140px]" aria-hidden />

      <div className="contenedor grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--barra)+3rem)]">
            <p data-aparecer className="kicker mb-8 flex items-center gap-3 text-ceniza">
              <span className="block h-px w-8 bg-brasa" />
              01 · Música
            </p>
            <div data-aparecer className="pr-[18%]">
              <Disco album={album} funda={funda} />
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-20">
          <p data-aparecer className="kicker text-ceniza">
            {album.tipo === "ep" ? "EP" : album.tipo === "sencillo" ? "Sencillo" : "Álbum"} · {album.anio}
            {album.genero ? ` · ${album.genero}` : ""}
          </p>
          <h2 id="disco-titulo" data-titular className="display mt-5 text-[clamp(3.25rem,7vw,7.5rem)]">
            {album.titulo}
          </h2>
          {album.descripcion && (
            <p data-aparecer className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ceniza">
              {album.descripcion}
            </p>
          )}

          <div className="mt-14">
            <ListaCanciones album={album} />
          </div>

          <div data-aparecer className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link href={`/musica/${album.slug}`} className="group inline-flex items-center gap-3 text-hueso">
              <span className="enlace-linea">Ver el disco completo</span>
              <Flecha className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Enlaces enlaces={album.enlaces} />
          </div>
        </div>
      </div>
    </section>
  );
}
