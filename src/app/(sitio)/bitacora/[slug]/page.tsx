import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import Tarjeta from "@/components/bitacora/Tarjeta";
import BarraLectura from "@/components/escritura/BarraLectura";
import Escena from "@/components/movimiento/Escena";
import Foto from "@/components/ui/Foto";
import { Flecha } from "@/components/ui/Iconos";
import TextoRico from "@/components/ui/TextoRico";
import { fechaLarga } from "@/lib/fechas";
import { MUNDOS } from "@/lib/mundos";
import { getPublicacion, getPublicaciones } from "@/sanity/queries";

export async function generateStaticParams() {
  const ps = await getPublicaciones();
  return ps.length ? ps.map((p) => ({ slug: p.slug })) : [{ slug: "sin-publicaciones" }];
}

export async function generateMetadata({ params }: PageProps<"/bitacora/[slug]">): Promise<Metadata> {
  const p = await getPublicacion((await params).slug);
  if (!p) return { title: "Publicación no encontrada" };
  return {
    title: p.titulo,
    description: p.extracto,
    openGraph: { type: "article", publishedTime: p.fecha, images: p.portada ? [p.portada.src] : undefined },
  };
}

export default function PublicacionPagina({ params }: PageProps<"/bitacora/[slug]">) {
  return (
    <main>
      <BarraLectura />
      <Suspense fallback={<div className="h-svh" />}>
        <Articulo params={params} />
      </Suspense>
    </main>
  );
}

async function Articulo({ params }: Pick<PageProps<"/bitacora/[slug]">, "params">) {
  const { slug } = await params;
  const [p, todas] = await Promise.all([getPublicacion(slug), getPublicaciones()]);
  if (!p) notFound();
  const mundo = p.mundo === "general" ? null : MUNDOS[p.mundo];
  const mas = todas.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <article style={{ "--tono": mundo?.tono ?? "var(--color-brasa)" } as React.CSSProperties}>
      <header className="contenedor pt-[calc(var(--barra)+3rem)] md:pt-[calc(var(--barra)+6rem)]">
        <Link href="/bitacora" className="kicker group inline-flex items-center gap-2 text-ceniza hover:text-hueso">
          <Flecha className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
          Bitácora
        </Link>
        <div className="mt-12 max-w-5xl">
          <p data-aparecer className="kicker text-[var(--tono)]">
            {mundo?.nombre ?? "General"} · <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
          </p>
          <h1 data-titular="ya" className="display mt-6 text-balance text-[clamp(3rem,7.5vw,7.5rem)]">
            {p.titulo}
          </h1>
          {p.extracto && (
            <p data-aparecer className="mt-8 max-w-2xl text-[1.1875rem] leading-relaxed text-ceniza">
              {p.extracto}
            </p>
          )}
        </div>
      </header>

      {p.portada && (
        <div className="contenedor mt-14 md:mt-20">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
            <ViewTransition name={`publicacion-${p.slug}`} share="foto-viaje" default="none">
              <Foto foto={p.portada} fill priority sizes="100vw" quality={90} className="object-cover" />
            </ViewTransition>
          </div>
        </div>
      )}

      <div className="contenedor py-16 md:py-24">
        <TextoRico value={p.contenido} className="mx-auto max-w-[44rem]" />
      </div>

      {mas.length > 0 && (
        <section className="contenedor border-t border-linea py-20 md:py-28">
          <p className="kicker mb-12 text-ceniza">Seguir leyendo</p>
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-3">
            {mas.map((x) => (
              <Tarjeta key={x.slug} p={x} />
            ))}
          </div>
        </section>
      )}
      <Escena />
    </article>
  );
}
