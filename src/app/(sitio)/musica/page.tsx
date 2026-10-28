import type { Metadata } from "next";
import Escena from "@/components/movimiento/Escena";
import Agenda from "@/components/musica/Agenda";
import Disco from "@/components/musica/Disco";
import Enlaces from "@/components/musica/Enlaces";
import ListaCanciones from "@/components/musica/ListaCanciones";
import VideoYoutube from "@/components/musica/VideoYoutube";
import Encabezado from "@/components/ui/Encabezado";
import { MUNDOS } from "@/lib/mundos";
import type { Album } from "@/lib/tipos";
import { getAlbumes, getPortada, getProximosEventos, getSencillos, getVideos } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Música",
  description: "Canciones de Julián Osorio para escuchar completas: «Infinito más cercano» y todo lo que viene.",
};

/**
 * Toda la música en una página: canciones sueltas, discos (con sus letras),
 * videos y fechas. Cada disco y cada canción se enlaza con #.
 */
export default async function MusicaPagina() {
  const [albumes, sencillos, videos, eventos, portada] = await Promise.all([
    getAlbumes(),
    getSencillos(),
    getVideos(),
    getProximosEventos(),
    getPortada(),
  ]);
  const m = MUNDOS.musica;
  const frase = portada.mundos.find((x) => x.clave === "musica")?.frase;
  const funda = portada.mundos.find((x) => x.clave === "musica")?.foto;

  // Las canciones sueltas se escuchan como una sola lista, cada una con su carátula.
  const sueltas: Album | null = sencillos.length
    ? { slug: "canciones", titulo: "Canciones", tipo: "sencillo", anio: sencillos[0].anio, canciones: sencillos.flatMap((s) => s.canciones), enlaces: {} }
    : null;

  return (
    <main style={{ "--tono": m.tono } as React.CSSProperties}>
      <Encabezado rotulo={`${m.numero} · ${m.lema}`} titulo="Música" cursiva="en vivo y en disco" bajada={frase} tono={m.tono} />

      {sueltas && (
        <section id="canciones" className="contenedor scroll-mt-[var(--barra)] border-t border-linea py-20 md:py-28" aria-labelledby="canciones-titulo">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p data-aparecer className="kicker text-ceniza">
                Lo más nuevo
              </p>
              <h2 id="canciones-titulo" data-titular className="display mt-5 text-[clamp(2.75rem,6vw,6rem)]">
                Canciones
              </h2>
            </div>
            <div className="md:col-span-8">
              <ListaCanciones album={sueltas} conLetra conPortadas />
            </div>
          </div>
        </section>
      )}

      {albumes.map((album, i) => (
        <section
          key={album.slug}
          id={album.slug}
          className="contenedor grid scroll-mt-[var(--barra)] gap-14 border-t border-linea py-20 md:grid-cols-12 md:gap-10 md:py-32"
          aria-labelledby={`album-${album.slug}`}
        >
          <div className="md:col-span-5">
            <div data-aparecer className="pr-[22%] md:sticky md:top-[calc(var(--barra)+3rem)]">
              <Disco album={album} funda={i === 0 ? funda : undefined} />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p data-aparecer className="kicker text-ceniza">
              {album.tipo === "ep" ? "EP" : "Álbum"} · {album.anio}
              {album.genero ? ` · ${album.genero}` : ""}
            </p>
            <h2 id={`album-${album.slug}`} data-titular className="display mt-5 text-[clamp(3rem,6vw,6.5rem)]">
              {album.titulo}
            </h2>
            {album.descripcion && (
              <p data-aparecer className="mt-8 max-w-md leading-relaxed text-ceniza">
                {album.descripcion}
              </p>
            )}
            <div className="mt-12">
              <ListaCanciones album={album} conLetra />
            </div>
            <div data-aparecer className="mt-10">
              <Enlaces enlaces={album.enlaces} />
            </div>
          </div>
        </section>
      ))}

      {videos.length > 0 && (
        <section id="videos" className="contenedor scroll-mt-[var(--barra)] border-t border-linea py-20 md:py-32" aria-labelledby="videos-titulo">
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
