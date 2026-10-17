import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Escena from "@/components/movimiento/Escena";
import Disco from "@/components/musica/Disco";
import Enlaces from "@/components/musica/Enlaces";
import ListaCanciones from "@/components/musica/ListaCanciones";
import { Flecha } from "@/components/ui/Iconos";
import { getAlbum, getAlbumes } from "@/sanity/queries";

export async function generateStaticParams() {
  const albumes = await getAlbumes();
  // Cache Components exige al menos un valor; sin discos la ruta da 404.
  return albumes.length ? albumes.map((a) => ({ slug: a.slug })) : [{ slug: "sin-discos" }];
}

export async function generateMetadata({ params }: PageProps<"/musica/[slug]">): Promise<Metadata> {
  const album = await getAlbum((await params).slug);
  if (!album) return { title: "Disco no encontrado" };
  return {
    title: album.titulo,
    description: album.descripcion ?? `${album.titulo} (${album.anio}), de Julián Osorio.`,
    openGraph: album.portada ? { images: [album.portada.src] } : undefined,
  };
}

export default function AlbumPagina({ params }: PageProps<"/musica/[slug]">) {
  return (
    <main style={{ "--tono": "var(--color-brasa)" } as React.CSSProperties}>
      <Suspense fallback={<div className="h-svh" />}>
        <Album params={params} />
      </Suspense>
    </main>
  );
}

async function Album({ params }: Pick<PageProps<"/musica/[slug]">, "params">) {
  const { slug } = await params;
  const [album, todos] = await Promise.all([getAlbum(slug), getAlbumes()]);
  if (!album) notFound();
  const otros = todos.filter((a) => a.slug !== album.slug);

  return (
    <>
      <section className="contenedor grid gap-14 pt-[calc(var(--barra)+3rem)] pb-20 md:grid-cols-12 md:gap-10 md:pt-[calc(var(--barra)+6rem)] md:pb-32">
        <div className="md:col-span-5">
          <div data-aparecer className="pr-[22%] md:sticky md:top-[calc(var(--barra)+3rem)]">
            <Disco album={album} />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Link href="/musica" className="kicker group inline-flex items-center gap-2 text-ceniza hover:text-hueso">
            <Flecha className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            Música
          </Link>
          <p className="kicker mt-10 text-brasa">
            {album.tipo === "ep" ? "EP" : album.tipo === "sencillo" ? "Sencillo" : "Álbum"} · {album.anio}
            {album.genero ? ` · ${album.genero}` : ""}
          </p>
          <h1 data-titular="ya" className="display mt-5 text-[clamp(3.5rem,8vw,8rem)]">
            {album.titulo}
          </h1>
          {album.descripcion && (
            <p data-aparecer className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ceniza">
              {album.descripcion}
            </p>
          )}
          <div data-aparecer className="mt-8">
            <Enlaces enlaces={album.enlaces} />
          </div>
          <div className="mt-14">
            <ListaCanciones album={album} conLetra />
          </div>
        </div>
      </section>

      {otros.length > 0 && (
        <section className="contenedor border-t border-linea py-20">
          <p className="kicker text-ceniza">Más música</p>
          <ul className="mt-8 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {otros.map((o) => (
              <li key={o.slug} data-aparecer>
                <Link href={`/musica/${o.slug}`} className="group block">
                  <Disco album={o} />
                  <p className="display mt-5 text-2xl group-hover:text-brasa">{o.titulo}</p>
                  <p className="kicker mt-2 text-humo">{o.anio}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Escena />
    </>
  );
}
