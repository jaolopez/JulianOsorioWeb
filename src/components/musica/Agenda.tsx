import { partesEvento } from "@/lib/fechas";
import { FlechaDiagonal } from "@/components/ui/Iconos";
import type { Evento } from "@/lib/tipos";

/** Próximas fechas. Si no hay ninguna, la sección no aparece. */
export default function Agenda({ eventos, titulo = "En vivo" }: { eventos: Evento[]; titulo?: string }) {
  if (!eventos.length) return null;
  return (
    <section className="contenedor py-24 md:py-32" aria-labelledby="agenda-titulo">
      <h2 id="agenda-titulo" data-titular className="display mb-12 text-[clamp(2.75rem,6vw,6rem)]">
        {titulo}
      </h2>
      <ul className="border-t border-linea">
        {eventos.map((e) => {
          const f = partesEvento(e.fecha);
          const Fila = e.enlace ? "a" : "div";
          return (
            <li key={e.id} data-aparecer className="border-b border-linea">
              <Fila
                {...(e.enlace ? { href: e.enlace, target: "_blank", rel: "noopener noreferrer", "data-cursor": "Info" } : {})}
                className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-6 md:grid-cols-[8rem_1fr_1fr_auto] md:py-8"
              >
                <span className="leading-none">
                  <span className="display block text-5xl md:text-6xl">{f.dia}</span>
                  <span className="kicker mt-2 block text-brasa">
                    {f.mes} {f.anio}
                  </span>
                </span>
                <span>
                  <span className="display block text-2xl transition-colors group-hover:text-brasa md:text-4xl">{e.titulo}</span>
                  <span className="kicker mt-2 block text-humo md:hidden">{[e.lugar, e.ciudad].filter(Boolean).join(" · ")}</span>
                </span>
                <span className="hidden text-ceniza md:block">
                  {e.lugar}
                  <span className="kicker mt-2 block text-humo">
                    {e.ciudad} · {f.hora}
                  </span>
                </span>
                {e.enlace && (
                  <span className="grid size-11 place-items-center rounded-full border border-linea transition-all group-hover:rotate-45 group-hover:border-brasa group-hover:bg-brasa group-hover:text-noche">
                    <FlechaDiagonal className="size-4" />
                  </span>
                )}
              </Fila>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
