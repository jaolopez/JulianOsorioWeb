import Foto from "@/components/ui/Foto";
import type { Foto as TFoto } from "@/lib/tipos";

/**
 * El párrafo que se enciende palabra por palabra mientras se baja. Las
 * palabras arrancan casi apagadas y el scroll las va prendiendo.
 */
export default function Manifiesto({ texto, foto }: { texto: string; foto?: TFoto }) {
  return (
    <section className="contenedor relative grid gap-12 py-28 md:grid-cols-12 md:py-44" aria-label="Manifiesto">
      <div className="md:col-span-3">
        <p data-aparecer className="kicker flex items-center gap-3 text-ceniza">
          <span className="block h-px w-8 bg-brasa" />
          Manifiesto
        </p>
        {foto && (
          <div data-revelar className="relative mt-10 hidden aspect-[3/4] w-full max-w-[14rem] overflow-hidden rounded-sm md:block">
            <Foto foto={foto} fill sizes="14rem" className="object-cover grayscale" />
          </div>
        )}
      </div>
      <p
        data-palabras
        className="display text-balance text-[clamp(2.1rem,5.2vw,5.5rem)] leading-[1.02] md:col-span-9"
      >
        {texto}
      </p>
    </section>
  );
}
