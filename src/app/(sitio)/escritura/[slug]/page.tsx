import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BarraLectura from "@/components/escritura/BarraLectura";
import Poema from "@/components/escritura/Poema";
import Escena from "@/components/movimiento/Escena";
import Foto from "@/components/ui/Foto";
import { Flecha } from "@/components/ui/Iconos";
import { fechaLarga } from "@/lib/fechas";
import { getTexto, getTextos } from "@/sanity/queries";

export async function generateStaticParams() {
  const textos = await getTextos();
  return textos.length ? textos.map((t) => ({ slug: t.slug })) : [{ slug: "sin-textos" }];
}

export async function generateMetadata({ params }: PageProps<"/escritura/[slug]">): Promise<Metadata> {
  const texto = await getTexto((await params).slug);
  if (!texto) return { title: "Texto no encontrado" };
  return { title: texto.titulo, description: texto.extracto, openGraph: { type: "article" } };
}

const TIPO = { poema: "Poema", prosa: "Prosa", relato: "Relato" } as const;

export default function TextoPagina({ params }: PageProps<"/escritura/[slug]">) {
  return (
    <main style={{ "--tono": "var(--color-tinta)" } as React.CSSProperties}>
      <BarraLectura />
      <Suspense fallback={<div className="h-svh" />}>
        <Lectura params={params} />
      </Suspense>
    </main>
  );
}

async function Lectura({ params }: Pick<PageProps<"/escritura/[slug]">, "params">) {
  const { slug } = await params;
  const [texto, todos] = await Promise.all([getTexto(slug), getTextos()]);
  if (!texto) notFound();
  const i = todos.findIndex((t) => t.slug === texto.slug);
  const anterior = todos[i + 1];
  const siguiente = todos[i - 1];

  return (
    <article>
      <header className="contenedor pt-[calc(var(--barra)+3rem)] md:pt-[calc(var(--barra)+6rem)]">
        <Link href="/escritura" className="kicker group inline-flex items-center gap-2 text-ceniza hover:text-hueso">
          <Flecha className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
          Escritura
        </Link>
        <div className="mx-auto mt-14 max-w-3xl text-center md:mt-20">
          <p data-aparecer className="kicker text-tinta">
            {TIPO[texto.tipo]} · <time dateTime={texto.fecha}>{fechaLarga(texto.fecha)}</time>
          </p>
          <h1 data-letras="ya" data-letras-centro className="display mt-8 text-[clamp(3.5rem,10vw,9rem)] italic">
            {texto.titulo}
          </h1>
        </div>
      </header>

      {texto.imagen && (
        <div data-revelar className="contenedor mt-16 md:mt-24">
          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-sm">
            <Foto foto={texto.imagen} fill priority sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover grayscale" />
            <div className="absolute inset-0 bg-tinta/15 mix-blend-color" />
          </div>
        </div>
      )}

      <div className="contenedor py-20 md:py-32">
        <Poema cuerpo={texto.cuerpo} prosa={texto.tipo !== "poema"} className={`mx-auto ${texto.tipo === "poema" ? "max-w-2xl" : "max-w-[38rem]"}`} />
        <p className="mx-auto mt-16 max-w-2xl text-center font-display text-2xl italic text-tinta">— Julián Osorio</p>
      </div>

      {(anterior || siguiente) && (
        <nav aria-label="Otros textos" className="grid border-t border-linea md:grid-cols-2">
          {[anterior, siguiente].map((t, k) =>
            t ? (
              <Link
                key={t.slug}
                href={`/escritura/${t.slug}`}
                className={`group contenedor block py-12 transition-colors hover:bg-noche-2 md:py-16 ${k === 1 ? "md:border-l md:border-linea md:text-right" : ""}`}
              >
                <span className="kicker text-humo">{k === 0 ? "Anterior" : "Siguiente"}</span>
                <span className="display mt-4 block text-[clamp(2rem,4vw,3.5rem)] transition-colors group-hover:text-tinta">{t.titulo}</span>
              </Link>
            ) : (
              <span key={k} />
            )
          )}
        </nav>
      )}
      <Escena />
    </article>
  );
}
