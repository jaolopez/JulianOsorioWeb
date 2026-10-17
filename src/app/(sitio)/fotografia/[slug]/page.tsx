import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import Visor from "@/components/fotografia/Visor";
import Escena from "@/components/movimiento/Escena";
import Foto from "@/components/ui/Foto";
import { Flecha } from "@/components/ui/Iconos";
import { fechaLarga } from "@/lib/fechas";
import { getGaleria, getGalerias } from "@/sanity/queries";

export async function generateStaticParams() {
  const galerias = await getGalerias();
  return galerias.length ? galerias.map((g) => ({ slug: g.slug })) : [{ slug: "sin-galerias" }];
}

export async function generateMetadata({ params }: PageProps<"/fotografia/[slug]">): Promise<Metadata> {
  const g = await getGaleria((await params).slug);
  if (!g) return { title: "Galería no encontrada" };
  return { title: g.titulo, description: g.descripcion, openGraph: { images: [g.portada.src] } };
}

export default function GaleriaPagina({ params }: PageProps<"/fotografia/[slug]">) {
  return (
    <main style={{ "--tono": "var(--color-plata)" } as React.CSSProperties}>
      <Suspense fallback={<div className="h-svh" />}>
        <Galeria params={params} />
      </Suspense>
    </main>
  );
}

async function Galeria({ params }: Pick<PageProps<"/fotografia/[slug]">, "params">) {
  const { slug } = await params;
  const [g, todas] = await Promise.all([getGaleria(slug), getGalerias()]);
  if (!g) notFound();
  const i = todas.findIndex((x) => x.slug === g.slug);
  const siguiente = todas[(i + 1) % todas.length];

  return (
    <>
      <section className="relative h-[88svh] min-h-[32rem] overflow-hidden">
        <ViewTransition name={`galeria-${g.slug}`} share="foto-viaje" default="none">
          <Foto foto={g.portada} fill priority sizes="100vw" quality={90} className="object-cover" />
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-noche via-noche/20 to-noche/40" />
        <div className="contenedor absolute inset-x-0 bottom-0 pb-12 md:pb-16">
          <Link href="/fotografia" className="kicker group inline-flex items-center gap-2 text-hueso/80 hover:text-hueso">
            <Flecha className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            Fotografía
          </Link>
          <h1 data-letras="ya" className="display mt-6 text-[clamp(3.75rem,12vw,12rem)]">
            {g.titulo}
          </h1>
          <p data-aparecer className="kicker mt-6 text-ceniza">
            {[g.lugar, fechaLarga(g.fecha), `${g.fotos.length} fotos`].filter(Boolean).join(" · ")}
          </p>
        </div>
      </section>

      <div className="contenedor py-16 md:py-24">
        {g.descripcion && (
          <p data-aparecer className="mb-16 max-w-2xl font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-tight text-hueso/90">
            {g.descripcion}
          </p>
        )}
        <Visor fotos={g.fotos} titulo={g.titulo} />
      </div>

      {siguiente && siguiente.slug !== g.slug && (
        <Link href={`/fotografia/${siguiente.slug}`} data-cursor="Ver" className="group relative block h-[60svh] overflow-hidden">
          <Foto foto={siguiente.portada} fill sizes="100vw" className="object-cover opacity-50 transition-[opacity,scale] duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105 group-hover:opacity-80" />
          <div className="contenedor absolute inset-0 flex flex-col justify-center">
            <span className="kicker text-ceniza">Siguiente galería</span>
            <span className="display mt-4 text-[clamp(3rem,9vw,9rem)] italic">{siguiente.titulo}</span>
          </div>
        </Link>
      )}
      <Escena />
    </>
  );
}
