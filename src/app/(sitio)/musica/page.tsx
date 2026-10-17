import type { Metadata } from "next";
import Link from "next/link";
import Escena from "@/components/movimiento/Escena";
import Agenda from "@/components/musica/Agenda";
import Disco from "@/components/musica/Disco";
import Enlaces from "@/components/musica/Enlaces";
import ListaCanciones from "@/components/musica/ListaCanciones";
import VideoYoutube from "@/components/musica/VideoYoutube";
import Encabezado from "@/components/ui/Encabezado";
import { Flecha } from "@/components/ui/Iconos";
import { MUNDOS } from "@/lib/mundos";
import { getAlbumes, getPortada, getProximosEventos, getVideos } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Música",
  description: "Canciones de Julián Osorio para escuchar completas: «Infinito más cercano» y todo lo que viene.",
};

export default async function MusicaPagina() {
  const [albumes, videos, eventos, portada] = await Promise.all([getAlbumes(), getVideos(), getProximosEventos(), getPortada()]);
  const m = MUNDOS.musica;
  const frase = portada.mundos.find((x) => x.clave === "musica")?.frase;
  const funda = portada.mundos.find((x) => x.clave === "musica")?.foto;

  return (
    <main style={{ "--tono": m.tono } as React.CSSProperties}>
      <Encabezado rotulo={`${m.numero} · ${m.lema}`} titulo="Música" cursiva="en vivo y en disco" bajada={frase} tono={m.tono} />

      {albumes.map((album, i) => (
        <section key={album.slug} className="contenedor grid gap-14 border-t border-linea py-20 md:grid-cols-12 md:gap-10 md:py-32" aria-labelledby={`album-${album.slug}`}>
          <div className="md:col-span-5">
            <div data-aparecer className="pr-[22%] md:sticky md:top-[calc(var(--barra)+3rem)]">
              <Disco album={album} funda={i === 0 ? funda : undefined} />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p data-aparecer className="kicker text-ceniza">
              {String(i + 1).padStart(2, "0")} · {album.tipo === "ep" ? "EP" : album.tipo === "sencillo" ? "Sencillo" : "Álbum"} · {album.anio}
              {album.genero ? ` · ${album.genero}` : ""}
            </p>
            <h2 id={`album-${album.slug}`} data-titular className="display mt-5 text-[clamp(3rem,6vw,6.5rem)]">
              <Link href={`/musica/${album.slug}`} className="transition-colors hover:text-brasa">
                {album.titulo}
              </Link>
            </h2>
            {album.descripcion && (
              <p data-aparecer className="mt-8 max-w-md leading-relaxed text-ceniza">
                {album.descripcion}
              </p>
            )}
            <div className="mt-12">
              <ListaCanciones album={album} />
            </div>
            <div data-aparecer className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link href={`/musica/${album.slug}`} className="group inline-flex items-center gap-3">
                <span className="enlace-linea">Letras y detalles</span>
                <Flecha className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Enlaces enlaces={album.enlaces} />
            </div>
          </div>
        </section>
      ))}

      {videos.length > 0 && (
        <section className="contenedor border-t border-linea py-20 md:py-32" aria-labelledby="videos-titulo">
          <h2 id="videos-titulo" data-titular className="display mb-12 text-[clamp(2.75rem,6vw,6rem)]">
            Videos
          </h2>
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {videos.map((v) => (
              <article key={v.id} data-aparecer>
                <VideoYoutube id={v.id} titulo={v.titulo} />
                <h3 className="display mt-5 text-3xl">{v.titulo}</h3>
                {v.descripcion && <p className="mt-2 text-ceniza">{v.descripcion}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <Agenda eventos={eventos} titulo="Próximas fechas" />
      <Escena />
    </main>
  );
}
