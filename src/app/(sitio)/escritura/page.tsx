import type { Metadata } from "next";
import IndiceTextos from "@/components/escritura/IndiceTextos";
import Escena from "@/components/movimiento/Escena";
import Encabezado from "@/components/ui/Encabezado";
import { MUNDOS } from "@/lib/mundos";
import { getPortada, getTextos } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Escritura",
  description: "Poemas, prosa y relatos de Julián Osorio. La palabra que se escribe en prosa y en verso.",
};

export default async function EscrituraPagina() {
  const [textos, portada] = await Promise.all([getTextos(), getPortada()]);
  const m = MUNDOS.escritura;
  const frase = portada.mundos.find((x) => x.clave === "escritura")?.frase;

  return (
    <main style={{ "--tono": m.tono } as React.CSSProperties}>
      <Encabezado rotulo={`${m.numero} · ${m.lema}`} titulo="Escritura" cursiva="prosa y verso" bajada={frase} tono={m.tono} />
      {textos.length ? (
        <IndiceTextos textos={textos} />
      ) : (
        <p data-aparecer className="contenedor display pb-32 text-4xl italic text-ceniza">
          Los primeros textos están por llegar.
        </p>
      )}
      <div className="h-24 md:h-36" />
      <Escena />
    </main>
  );
}
