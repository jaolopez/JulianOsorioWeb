import type { Metadata } from "next";
import Tarjeta from "@/components/bitacora/Tarjeta";
import Escena from "@/components/movimiento/Escena";
import Encabezado from "@/components/ui/Encabezado";
import { getPublicaciones } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Bitácora",
  description: "Novedades, lanzamientos y notas de Julián Osorio.",
};

export default async function BitacoraPagina() {
  const publicaciones = await getPublicaciones();
  const [primera, ...resto] = publicaciones;

  return (
    <main>
      <Encabezado rotulo="05 · Novedades" titulo="Bitácora" cursiva="lo que va pasando" bajada="Lanzamientos, notas, fechas y todo lo que se cocina entre canciones, textos, fotos y mesa." />
      <div className="contenedor pb-28 md:pb-40">
        {primera ? (
          <>
            <Tarjeta p={primera} grande />
            <div className="mt-20 grid gap-x-8 gap-y-16 md:grid-cols-3">
              {resto.map((p) => (
                <Tarjeta key={p.slug} p={p} />
              ))}
            </div>
          </>
        ) : (
          <p className="display text-4xl italic text-ceniza">Pronto, las primeras noticias.</p>
        )}
      </div>
      <Escena />
    </main>
  );
}
